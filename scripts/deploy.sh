#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Zero-downtime production deploy cho langding.tc-gaming.live
#
# Sử dụng:
#   ./scripts/deploy.sh              # full deploy
#   ./scripts/deploy.sh --skip-build # chỉ copy assets + reload PM2 (khi code không đổi)
#
# Yêu cầu: chạy từ thư mục gốc dự án (/var/lkvip/langding)
# =============================================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_CONF_SRC="$APP_DIR/infra/nginx/nginx.conf.langding"
NGINX_CONF_DST="/etc/nginx/sites-available/langding.conf"
PM2_APP="AXVN-langding"
ECOSYSTEM="$APP_DIR/infra/ecosystem.config.js"

# ── Màu terminal ──────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err()  { echo -e "${RED}✗${NC}  $*"; exit 1; }
step() { echo -e "\n${YELLOW}▶${NC}  $*"; }

SKIP_BUILD=false
for arg in "$@"; do [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true; done

cd "$APP_DIR"

# ── 0. Preflight ──────────────────────────────────────────────────────────────
step "Preflight checks"

[[ -f ".env.local" ]]          || err ".env.local không tồn tại — copy từ .env.example và điền đầy đủ"
[[ -f "package.json" ]]        || err "package.json không tồn tại"
[[ -d "node_modules" ]]        || err "node_modules chưa có — chạy: npm ci"
[[ -f "$NGINX_CONF_SRC" ]]     || err "Nginx config không tìm thấy: $NGINX_CONF_SRC"
command -v pm2 &>/dev/null     || err "pm2 không tìm thấy — cài: npm i -g pm2"
command -v nginx &>/dev/null   || err "nginx không tìm thấy"

# Kiểm tra biến env tối thiểu
for var in MONGODB_URI SESSION_SECRET NEXT_PUBLIC_SITE_URL; do
  grep -q "^${var}=" .env.local || err ".env.local thiếu biến bắt buộc: $var"
done

ok "Preflight passed"

# ── 1. TypeScript check ───────────────────────────────────────────────────────
step "TypeScript check"
./node_modules/.bin/tsc --noEmit 2>&1 \
  || err "TypeScript có lỗi — sửa trước khi deploy"
ok "TypeScript clean"

# ── 2. Build ──────────────────────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == false ]]; then
  step "Production build"
  # Xóa Turbopack build lock nếu còn sót từ lần trước (tránh "Another build running")
  rm -rf .next/build 2>/dev/null || true
  npm run build 2>&1 \
    || err "Build thất bại"
  ok "Build thành công"
else
  warn "Bỏ qua build (--skip-build)"
fi

# ── 3. Kiểm tra standalone output ─────────────────────────────────────────────
step "Kiểm tra standalone output"
[[ -f ".next/standalone/server.js" ]] \
  || err ".next/standalone/server.js không tồn tại — kiểm tra next.config.ts có output: 'standalone'"
ok "Standalone output tồn tại"

# ── 4. Copy static assets vào standalone ─────────────────────────────────────
step "Copy static assets"
# Bắt buộc: Next.js standalone không tự copy các thư mục này
cp -r .next/static   .next/standalone/.next/static
cp -r public         .next/standalone/public
ok "Static assets copied → standalone"

# ── 5. Sync + reload Nginx ────────────────────────────────────────────────────
step "Nginx config"
if ! diff -q "$NGINX_CONF_SRC" "$NGINX_CONF_DST" &>/dev/null; then
  cp "$NGINX_CONF_SRC" "$NGINX_CONF_DST"
  warn "Config cập nhật — đang test nginx..."
else
  ok "Nginx config đã đồng bộ (không thay đổi)"
fi

nginx -t 2>&1 | grep -v "^$" \
  || err "nginx -t thất bại — không reload"

nginx -s reload
ok "Nginx reloaded"

# ── 6. PM2 zero-downtime reload ───────────────────────────────────────────────
step "PM2 reload"
if pm2 list | grep -q "$PM2_APP"; then
  pm2 reload "$PM2_APP" 2>&1 | tail -6
  ok "PM2 reloaded (zero-downtime)"
else
  warn "App chưa chạy — khởi động lần đầu bằng ecosystem config"
  pm2 start "$ECOSYSTEM" --env production 2>&1 | tail -6
  ok "PM2 started"
fi

pm2 save --force &>/dev/null
ok "PM2 state saved"

# ── 7. Smoke test ─────────────────────────────────────────────────────────────
step "Smoke test"
sleep 3  # chờ workers warm up

BASE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d= -f2- | tr -d '"')
: "${BASE_URL:=http://localhost:3000}"

PASS=0; FAIL=0
check_url() {
  local url="$1" expect="$2" label="$3"
  local code
  code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  if [[ "$code" == "$expect" ]]; then
    ok "[$code] $label"
    ((PASS++))
  else
    warn "[$code != $expect] $label — $url"
    ((FAIL++))
  fi
}

check_url "${BASE_URL}/"              "200" "Homepage"
check_url "${BASE_URL}/api/health"    "200" "Health API"
check_url "${BASE_URL}/content/strategy" "200" "Strategy page"
check_url "${BASE_URL}/admin"         "307" "Admin (auth redirect)"

echo ""
if [[ $FAIL -eq 0 ]]; then
  ok "Smoke test passed ($PASS/$((PASS+FAIL)))"
else
  warn "Smoke test: $PASS passed, $FAIL failed — kiểm tra logs: pm2 logs $PM2_APP --lines 50"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Deploy hoàn tất → ${BASE_URL}${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
