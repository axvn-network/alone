#!/usr/bin/env bash
# ================================================================
# deploy-langding.sh — Full deploy pipeline
# Domain : langding.tc-gaming.live
# App dir: /var/lkvip/langding
#
# Lần đầu  : sudo bash scripts/setup.sh
#             bash scripts/deploy-langding.sh --first
# Cập nhật : bash scripts/deploy-langding.sh
# ================================================================
set -euo pipefail

DOMAIN="langding.tc-gaming.live"
APP_DIR="/var/lkvip/langding"
REPO_URL="https://github.com/hoangbom98/alone.git"
BRANCH="main"
PM2_APP="gvi-langding"
NGINX_CONF="/etc/nginx/sites-available/langding.conf"
FIRST_DEPLOY="${1:-}"

print_step() { echo -e "\n\033[1;34m[$(date '+%H:%M:%S')] ==>\033[0m $1"; }
print_ok()   { echo -e "  \033[1;32m✓\033[0m $1"; }
print_warn() { echo -e "  \033[1;33m!\033[0m $1"; }
die()        { echo -e "\n\033[1;31m[ERROR]\033[0m $1"; exit 1; }

# ── systemd helper ───────────────────────────────────────────────
nginx_reload() {
  if command -v systemctl &>/dev/null && systemctl is-active nginx &>/dev/null 2>&1; then
    sudo systemctl reload nginx
  else
    sudo nginx -s reload 2>/dev/null || true
  fi
}

# ================================================================
# BƯỚC 1 — Clone hoặc pull code
# ================================================================
print_step "Sync code từ GitHub ($BRANCH)"

if [[ "$FIRST_DEPLOY" == "--first" ]]; then
  # Lần đầu: clone vào APP_DIR
  if [[ -d "$APP_DIR/.git" ]]; then
    print_warn "$APP_DIR đã có repo — chuyển sang pull"
  else
    mkdir -p "$APP_DIR"
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
    print_ok "Clone xong: $APP_DIR"
  fi
fi

cd "$APP_DIR"
# Thay đổi: chỉ pull thay vì fetch + reset --hard
git pull origin "$BRANCH"
print_ok "Code: $(git log -1 --oneline)"

# ================================================================
# BƯỚC 2 — Kiểm tra .env.local
# ================================================================
print_step "Kiểm tra .env.local"

ENV_FILE="$APP_DIR/.env.local"
if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$APP_DIR/.env.local.example" ]]; then
    cp "$APP_DIR/.env.local.example" "$ENV_FILE"
    die ".env.local chưa tồn tại — đã tạo từ .env.local.example\n  Hãy điền đầy đủ giá trị rồi chạy lại:\n  nano $ENV_FILE\n  bash scripts/deploy-langding.sh"
  else
    die ".env.local không tồn tại. Tạo từ .env.local.example rồi điền đầy đủ."
  fi
fi

# Validate env
bash "$APP_DIR/scripts/check-env.sh"
print_ok ".env.local hợp lệ"

# ================================================================
# BƯỚC 3 — Cài dependencies
# ================================================================
print_step "npm ci (production deps)"
npm ci --prefer-offline --no-audit
print_ok "Dependencies đã cài"

# ================================================================
# BƯỚC 4 — Build Next.js (standalone output)
# ================================================================
print_step "Build Next.js production"
npm run build
print_ok "Build xong"

# Next.js standalone cần thư mục public và static riêng
# (bắt buộc — không copy thì domain không tải được CSS/JS/assets)
print_step "Copy public + static vào standalone"
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public         .next/standalone/public
cp -r .next/static   .next/standalone/.next/static
print_ok "Standalone đã chuẩn bị"

# ================================================================
# BƯỚC 5 — Seed database (chỉ lần đầu)
# ================================================================
if [[ "$FIRST_DEPLOY" == "--first" ]]; then
  print_step "Seed MongoDB"
  if [[ -f scripts/seed-investment-plans.ts ]]; then
    npx tsx scripts/seed-investment-plans.ts || print_warn "seed-investment-plans.ts bỏ qua"
  fi
  print_ok "Seed hoàn tất"
fi

# ================================================================
# BƯỚC 6 — Nginx config (chỉ lần đầu)
# ================================================================
if [[ "$FIRST_DEPLOY" == "--first" ]]; then
  print_step "Cài Nginx config cho $DOMAIN"
  if [[ ! -f "$NGINX_CONF" ]]; then
    sudo cp "$APP_DIR/infra/nginx/nginx.conf.langding" "$NGINX_CONF"
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/langding.conf
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && nginx_reload
    print_ok "Nginx → $NGINX_CONF"
  else
    print_warn "Nginx config đã tồn tại — bỏ qua"
  fi
fi

# ================================================================
# BƯỚC 7 — PM2 start / reload (zero-downtime)
# ================================================================
print_step "PM2 reload (zero-downtime)"

if pm2 describe "$PM2_APP" &>/dev/null; then
  pm2 reload "$PM2_APP"
  print_ok "PM2 reloaded: $PM2_APP"
else
  pm2 start "$APP_DIR/infra/ecosystem.config.js" --env production
  print_ok "PM2 started: $PM2_APP"
fi

pm2 save
print_ok "PM2 process list saved"

# ================================================================
# BƯỚC 8 — SSL (chỉ lần đầu)
# ================================================================
if [[ "$FIRST_DEPLOY" == "--first" ]]; then
  print_step "Lấy SSL Let's Encrypt cho $DOMAIN"
  bash "$APP_DIR/scripts/ssl-setup.sh" "$DOMAIN"
fi

# ================================================================
# Tóm tắt
# ================================================================
echo ""
echo "================================================================"
echo "  ✅ Deploy hoàn tất — $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Domain : https://$DOMAIN"
echo "  App dir: $APP_DIR"
echo "  Commit : $(git -C "$APP_DIR" log -1 --oneline)"
echo "================================================================"
echo ""
echo "  pm2 logs $PM2_APP        # xem log"
echo "  pm2 monit                # monitor"
echo "  bash scripts/backup.sh   # backup MongoDB thủ công"
echo ""
