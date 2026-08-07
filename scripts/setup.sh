#!/usr/bin/env bash
# ============================================================
# scripts/setup.sh — Run ONCE as root on a fresh Ubuntu VPS
# Usage: sudo bash scripts/setup.sh
# ============================================================
set -euo pipefail

NODEJS_VERSION="20"
APP_DIR="/var/www/fortress/app"
LOG_DIR="/var/log/pm2"
SWAP_SIZE="2G"

print_step() { echo -e "\n\033[1;34m==>\033[0m $1"; }
print_ok()   { echo -e "  \033[1;32m✓\033[0m $1"; }
print_warn() { echo -e "  \033[1;33m!\033[0m $1"; }

# ── Must be root ─────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root: sudo bash $0"
  exit 1
fi

# ── Update system ────────────────────────────────────────────
print_step "Updating system packages"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl git unzip wget gnupg2 ca-certificates lsb-release ufw fail2ban

# ── Swap (helps on low-RAM VPS) ──────────────────────────────
print_step "Configuring swap ($SWAP_SIZE)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l "$SWAP_SIZE" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  print_ok "Swap created"
else
  print_warn "Swap already exists, skipping"
fi

# ── Node.js ──────────────────────────────────────────────────
print_step "Installing Node.js $NODEJS_VERSION"
if ! command -v node &>/dev/null || [[ $(node -e "process.stdout.write(process.version)" | cut -d. -f1 | tr -d 'v') -lt $NODEJS_VERSION ]]; then
  curl -fsSL https://deb.nodesource.com/setup_${NODEJS_VERSION}.x | bash -
  apt-get install -y nodejs
  print_ok "Node.js $(node -v) installed"
else
  print_warn "Node.js $(node -v) already installed"
fi

# ── PM2 ──────────────────────────────────────────────────────
print_step "Installing PM2"
npm install -g pm2 --quiet
print_ok "PM2 $(pm2 -v) installed"

# ── MongoDB ──────────────────────────────────────────────────
print_step "Installing MongoDB 7"
if ! command -v mongod &>/dev/null; then
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-server-7.0.gpg
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-7.0.list
  apt-get update -qq
  apt-get install -y mongodb-org
  systemctl daemon-reload
  systemctl enable mongod
  systemctl start mongod
  print_ok "MongoDB $(mongod --version | head -1) installed & started"
else
  print_warn "MongoDB already installed"
fi

# ── Nginx ────────────────────────────────────────────────────
print_step "Installing Nginx"
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
print_ok "Nginx installed"

# ── Certbot ──────────────────────────────────────────────────
print_step "Installing Certbot"
apt-get install -y certbot python3-certbot-nginx
print_ok "Certbot installed"

# ── UFW Firewall ─────────────────────────────────────────────
print_step "Configuring UFW firewall"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    comment "SSH"
ufw allow 80/tcp    comment "HTTP"
ufw allow 443/tcp   comment "HTTPS"
ufw --force enable
print_ok "UFW configured: ports 22, 80, 443 open"

# ── Fail2Ban ─────────────────────────────────────────────────
print_step "Configuring Fail2Ban"
systemctl enable fail2ban
systemctl start fail2ban
print_ok "Fail2Ban running"

# ── App directories ──────────────────────────────────────────
print_step "Creating application directories"
mkdir -p "$APP_DIR"
mkdir -p "$LOG_DIR"
mkdir -p /var/backups/fortress
print_ok "Directories created: $APP_DIR, $LOG_DIR"

# ── PM2 startup ──────────────────────────────────────────────
print_step "Registering PM2 startup hook"
pm2 startup systemd -u root --hp /root | tail -1 | bash || true
print_ok "PM2 will auto-start on reboot"

print_step "✅ Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Copy your code to $APP_DIR"
echo "  2. Copy .env.example → .env.local and fill in values"
echo "  3. Run: bash scripts/first-deploy.sh"
echo ""
