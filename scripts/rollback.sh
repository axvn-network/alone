#!/usr/bin/env bash
# =============================================================================
# scripts/rollback.sh — Zero-downtime rollback
#
# Sử dụng:
#   bash scripts/rollback.sh                # show last 10 commits + prompt
#   bash scripts/rollback.sh <git-sha>      # rollback to specific SHA
#   bash scripts/rollback.sh --list         # list recent commits only
#
# Yêu cầu: chạy từ thư mục gốc dự án (/var/lkvip/langding)
# =============================================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PM2_APP="AXVN-langding"
ECOSYSTEM="$APP_DIR/infra/ecosystem.config.js"

# ── Màu terminal ──────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err()  { echo -e "${RED}✗${NC}  $*"; exit 1; }
step() { echo -e "\n${YELLOW}▶${NC}  $*"; }

cd "$APP_DIR"

# ── Lấy commit hiện tại ───────────────────────────────────────────────────────
CURRENT_SHA=$(git rev-parse HEAD)
CURRENT_MSG=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "unknown")

# ── List only ─────────────────────────────────────────────────────────────────
if [[ "${1:-}" == "--list" ]]; then
  echo ""
  echo -e "${CYAN}Lịch sử 15 commits gần nhất:${NC}"
  echo ""
  git log --oneline -15
  echo ""
  exit 0
fi

# ── Show current state ────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AXVN Tech Holding — Rollback${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "  Current:  ${YELLOW}${CURRENT_SHA:0:8}${NC}  $CURRENT_MSG"
echo ""
echo "  Last 10 commits:"
git log --oneline -10 | sed 's/^/    /'
echo ""

# ── Xác định SHA rollback ─────────────────────────────────────────────────────
TARGET_SHA="${1:-}"

if [[ -z "$TARGET_SHA" ]]; then
  echo -ne "${YELLOW}  Nhập SHA để rollback (hoặc Enter để hủy): ${NC}"
  read -r TARGET_SHA
  if [[ -z "$TARGET_SHA" ]]; then
    warn "Rollback hủy bỏ."
    exit 0
  fi
fi

# Validate SHA
if ! git cat-file -e "${TARGET_SHA}^{commit}" 2>/dev/null; then
  err "SHA không hợp lệ: $TARGET_SHA"
fi

TARGET_FULL_SHA=$(git rev-parse "$TARGET_SHA")
TARGET_MSG=$(git log -1 --pretty=format:"%s" "$TARGET_FULL_SHA" 2>/dev/null || echo "unknown")

echo ""
warn "Chuẩn bị rollback:"
echo "  Từ:  ${CURRENT_SHA:0:8}  $CURRENT_MSG"
echo "  → :  ${TARGET_FULL_SHA:0:8}  $TARGET_MSG"
echo ""
echo -ne "${YELLOW}  Xác nhận? (y/N): ${NC}"
read -r confirm

if [[ "${confirm,,}" != "y" ]]; then
  warn "Rollback hủy bỏ."
  exit 0
fi

# ── Backup current state (bảo toàn để có thể re-rollback) ────────────────────
step "Lưu trạng thái hiện tại"
echo "$CURRENT_SHA" > "$APP_DIR/.rollback-prev-sha"
ok "Đã lưu SHA trước đó → .rollback-prev-sha"

# ── Checkout target ───────────────────────────────────────────────────────────
step "Checkout $TARGET_FULL_SHA"
git checkout "$TARGET_FULL_SHA" 2>&1 | tail -3
ok "Checked out: ${TARGET_FULL_SHA:0:8}"

# ── Install dependencies ──────────────────────────────────────────────────────
step "npm ci (installing dependencies for target SHA)"
npm ci --omit=dev 2>&1 | tail -5
ok "Dependencies installed"

# ── Build ─────────────────────────────────────────────────────────────────────
step "Production build"
npm run build 2>&1 | tail -10
ok "Build thành công"

# ── Copy static assets ────────────────────────────────────────────────────────
step "Copy static assets vào standalone"
[[ -f ".next/standalone/server.js" ]] || err ".next/standalone/server.js không tồn tại"
cp -r .next/static   .next/standalone/.next/static
cp -r public         .next/standalone/public
ok "Static assets copied"

# ── PM2 reload ────────────────────────────────────────────────────────────────
step "PM2 reload"
if pm2 list | grep -q "$PM2_APP"; then
  pm2 reload "$PM2_APP" 2>&1 | tail -4
  ok "PM2 reloaded (zero-downtime)"
else
  warn "App chưa chạy — start từ ecosystem"
  pm2 start "$ECOSYSTEM" --env production 2>&1 | tail -4
  ok "PM2 started"
fi

pm2 save --force &>/dev/null
ok "PM2 state saved"

# ── Smoke test ────────────────────────────────────────────────────────────────
step "Smoke test"
sleep 3

BASE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d= -f2- | tr -d '"')
: "${BASE_URL:=http://localhost:3000}"

code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$BASE_URL/api/health")
if [[ "$code" == "200" ]]; then
  ok "Health check: $code"
else
  warn "Health check: $code — kiểm tra: pm2 logs $PM2_APP --lines 50"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Rollback hoàn tất → ${TARGET_FULL_SHA:0:8}${NC}"
echo -e "${GREEN}  → ${BASE_URL}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo "  Để forward lại về main:"
echo "    git checkout main && bash scripts/deploy.sh --no-git"
echo ""
