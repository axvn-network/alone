#!/usr/bin/env bash
# ============================================================
# scripts/deploy.sh — Rolling update deploy (zero-downtime)
# Run from the app directory on the VPS after a git pull.
# Usage: bash scripts/deploy.sh
# ============================================================
set -euo pipefail

print_step() { echo -e "\n\033[1;34m==>\033[0m $1"; }
print_ok()   { echo -e "  \033[1;32m✓\033[0m $1"; }

# ── Validate env ─────────────────────────────────────────────
print_step "Validating environment"
bash "$(dirname "$0")/check-env.sh"
print_ok "Env check passed"

# ── Pull latest code ─────────────────────────────────────────
print_step "Pulling latest code from git"
git pull --rebase
print_ok "Code updated"

# ── Install / update dependencies ────────────────────────────
print_step "Installing dependencies"
npm ci --prefer-offline --no-audit
print_ok "Dependencies ready"

# ── Build ────────────────────────────────────────────────────
print_step "Building Next.js (production)"
NODE_ENV=production npm run build
print_ok "Build complete"

# ── Copy standalone output ───────────────────────────────────
print_step "Preparing standalone output"
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
print_ok "Standalone updated"

# ── PM2 zero-downtime reload ──────────────────────────────────
print_step "Reloading PM2 (zero-downtime)"
pm2 reload fortress-website --update-env
pm2 save
print_ok "PM2 reloaded"

# ── Reload Nginx (config may have changed) ───────────────────
if sudo nginx -t 2>/dev/null; then
  sudo systemctl reload nginx
  print_ok "Nginx reloaded"
fi

print_step "✅ Deploy complete — $(date '+%Y-%m-%d %H:%M:%S')"
pm2 status fortress-website
