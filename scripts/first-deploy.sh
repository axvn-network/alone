#!/usr/bin/env bash
# ============================================================
# scripts/first-deploy.sh — First deploy after setup.sh
# Run as the deploy user (NOT root) from the app directory.
# Usage: bash scripts/first-deploy.sh
# ============================================================
set -euo pipefail

APP_DIR="/var/www/fortress/app"
DOMAIN="${DOMAIN:-YOURDOMAIN.COM}"

print_step() { echo -e "\n\033[1;34m==>\033[0m $1"; }
print_ok()   { echo -e "  \033[1;32m✓\033[0m $1"; }

# ── Validate env ─────────────────────────────────────────────
print_step "Validating environment"
bash "$(dirname "$0")/check-env.sh"
print_ok "All required env vars present"

# ── Install dependencies ─────────────────────────────────────
print_step "Installing Node.js dependencies"
npm ci --prefer-offline --no-audit
print_ok "Dependencies installed"

# ── Build Next.js ────────────────────────────────────────────
print_step "Building Next.js (production)"
NODE_ENV=production npm run build
print_ok "Build complete"

# ── Copy standalone output ───────────────────────────────────
print_step "Preparing standalone deploy"
# Copy public & static into standalone for zero-config serving
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
print_ok "Standalone output prepared"

# ── Seed data ────────────────────────────────────────────────
print_step "Seeding database"
node scripts/seed-mongo.js || echo "  Seed skipped (may already be seeded)"
APP_DIR="/var/lkvip/langding"
DOMAIN="${DOMAIN:-langding.tc-gaming.live}"
...
# ── Nginx config ─────────────────────────────────────────────
print_step "Installing Nginx config for $DOMAIN"
CONF="/etc/nginx/sites-available/langding.conf"
if [[ ! -f "$CONF" ]]; then
  sed "s/YOURDOMAIN.COM/$DOMAIN/g" nginx.conf.example | sudo tee "$CONF" > /dev/null
  sudo ln -sf "$CONF" /etc/nginx/sites-enabled/langding.conf
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
  print_ok "Nginx configured for $DOMAIN"
else
  print_ok "Nginx config already exists — skipping"
fi

# ── PM2 start ────────────────────────────────────────────────
print_step "Starting application with PM2"
pm2 delete gvi-langding 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
print_ok "PM2 started — app running on port 3000"

print_step "✅ First deploy complete!"
echo ""
echo "  Run SSL setup next: bash scripts/ssl-setup.sh $DOMAIN"
echo "  View logs:          pm2 logs gvi-langding"
echo "  Monitor:            pm2 monit"
echo ""
