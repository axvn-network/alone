#!/usr/bin/env bash
# =============================================================================
# scripts/deploy.sh — 1-command stealth deploy
#
# Usage:
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
NGINX_CONF_SRC="$APP_DIR/infra/nginx/langding.conf"
NGINX_CONF_DEST="/etc/nginx/sites-available/langding.conf"
PM2_ECOSYSTEM="$APP_DIR/infra/ecosystem.config.js"

cd "$APP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Deploy — Stealth Ops"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Build
echo ""
echo "[1/4] Building Next.js..."
npm run build

# Copy standalone static assets (required for output: standalone)
echo "      Syncing static assets..."
mkdir -p .next/standalone/.next/static .next/standalone/public
cp -r .next/static/. .next/standalone/.next/static/
cp -r public/.       .next/standalone/public/

# 2. PM2
echo ""
echo "[2/4] Starting process daemon..."
if pm2 list | grep -q "core-sys-daemon"; then
  pm2 reload "$PM2_ECOSYSTEM" --env production --update-env
else
  pm2 start "$PM2_ECOSYSTEM" --env production
fi
pm2 save

# 3. Nginx
echo ""
echo "[3/4] Deploying Nginx firewall..."

# Ensure limit_req_zone is defined in the main http {} block (idempotent)
if ! sudo grep -q "zone=langding" /etc/nginx/nginx.conf; then
  sudo sed -i '/^http {/a\\tlimit_req_zone $binary_remote_addr zone=langding:10m rate=20r/s;' /etc/nginx/nginx.conf
  echo "      Injected limit_req_zone into nginx.conf"
fi

sudo cp "$NGINX_CONF_SRC" "$NGINX_CONF_DEST"
sudo ln -sf "$NGINX_CONF_DEST" /etc/nginx/sites-enabled/langding.conf
sudo nginx -t
sudo systemctl reload nginx

# 4. Log dir
echo ""
echo "[4/4] Ensuring log dir exists..."
sudo mkdir -p /var/log/pm2
sudo chown "$(whoami)" /var/log/pm2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done. System online and obfuscated."
echo "  pm2 status    → check process"
echo "  pm2 logs      → tail errors only"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
