#!/usr/bin/env bash
# =============================================================================
# scripts/health-check.sh — Comprehensive health probe
#
# Usage:
#   bash scripts/health-check.sh              # check localhost:3000
#   BASE_URL=https://vnkr.vn bash scripts/health-check.sh
#
# Yêu cầu: curl
# Exit code: 0 = tất cả pass, 1 = có ít nhất 1 failure
# =============================================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ── Màu terminal ──────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err()  { echo -e "${RED}✗${NC}  $*"; }

# ── Config ────────────────────────────────────────────────────────────────────
# Đọc từ .env.local nếu có, cho phép override bằng env var
if [[ -z "${BASE_URL:-}" && -f "$APP_DIR/.env.local" ]]; then
  BASE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" "$APP_DIR/.env.local" | cut -d= -f2- | tr -d '"' || true)
fi
BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
TIMEOUT="${HEALTH_TIMEOUT:-10}"

echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}  Health Check — ${BASE_URL}${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo ""

PASS=0; FAIL=0

# ── Helper ────────────────────────────────────────────────────────────────────
check() {
  local method="${1:-GET}"
  local path="$2"
  local expect="$3"
  local label="$4"
  local url="${BASE_URL}${path}"

  local code
  code=$(curl -sk -o /dev/null -w "%{http_code}" \
    -X "$method" \
    --max-time "$TIMEOUT" \
    "$url" 2>/dev/null || echo "000")

  if [[ "$code" == "$expect" ]]; then
    ok "[$code] $label"
    ((PASS++)) || true
  else
    err "[$code ≠ $expect] $label  →  $url"
    ((FAIL++)) || true
  fi
}

# ── Public routes ─────────────────────────────────────────────────────────────
check GET "/" "200" "Homepage"
check GET "/api/health" "200" "Health API (DB ping)"

# ── Protected routes (auth redirect expected) ─────────────────────────────────
check GET "/admin" "307" "Admin dashboard (auth redirect)"
check GET "/portals/shareholders/dashboard" "307" "Shareholder portal (auth redirect)"

# ── API — authenticated-only (expect 401 Unauthorized) ───────────────────────
check GET "/api/admin/stats" "401" "Admin stats API (auth guard)"
check GET "/api/shareholders/tasks" "401" "Shareholder tasks API (auth guard)"

# ── PM2 process check ─────────────────────────────────────────────────────────
echo ""
if command -v pm2 &>/dev/null; then
  if pm2 list | grep -q "AXVN-langding"; then
    PM2_STATUS=$(pm2 show AXVN-langding 2>/dev/null | grep -E "status\s*│" | awk -F'│' '{gsub(/ /,""); print $2}' | head -1)
    ok "PM2 process AXVN-langding  [status: ${PM2_STATUS:-online}]"
    ((PASS++)) || true
  else
    warn "PM2 process AXVN-langding não encontrado — app may not be running"
    ((FAIL++)) || true
  fi
else
  warn "pm2 not found — skipping process check"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
TOTAL=$((PASS + FAIL))
if [[ $FAIL -eq 0 ]]; then
  echo -e "${GREEN}═══════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✓ All checks passed ($PASS/$TOTAL)${NC}"
  echo -e "${GREEN}═══════════════════════════════════════${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}═══════════════════════════════════════${NC}"
  echo -e "${RED}  ✗ $FAIL check(s) FAILED  ($PASS/$TOTAL passed)${NC}"
  echo -e "${RED}  → pm2 logs AXVN-langding --lines 50${NC}"
  echo -e "${RED}═══════════════════════════════════════${NC}"
  echo ""
  exit 1
fi
