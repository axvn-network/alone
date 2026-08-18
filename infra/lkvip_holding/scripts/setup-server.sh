#!/usr/bin/env bash
# ================================================================
# infra/lkvip_holding/scripts/setup-server.sh
#
# First-time provisioning cho VPS lkvip_holding
# Bao gồm: Node.js, PM2, Nginx, MongoDB Tools, Certbot, UFW
#
# Sử dụng:
#   sudo bash infra/lkvip_holding/scripts/setup-server.sh
#
# Yêu cầu: Ubuntu 22.04/24.04 · Quyền root/sudo
# ================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err()  { echo -e "${RED}✗${NC}  $*"; exit 1; }
step() { echo -e "\n${CYAN}▶${NC}  $*"; }

[[ "$EUID" -ne 0 ]] && err "Cần quyền root: sudo bash $0"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="/var/lkvip/langding"
NODE_VERSION="22"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  lkvip_holding VPS Setup${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

# ── 1. System packages ────────────────────────────────────────────────────────
step "[1/8] System packages"
apt-get update -qq
apt-get install -y curl wget git build-essential software-properties-common \
  ca-certificates gnupg lsb-release jq unzip &>/dev/null
ok "System packages installed"

# ── 2. Node.js ────────────────────────────────────────────────────────────────
step "[2/8] Node.js ${NODE_VERSION}.x LTS"
if ! command -v node &>/dev/null || [[ "$(node --version | cut -d. -f1 | tr -d 'v')" -lt "$NODE_VERSION" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - &>/dev/null
  apt-get install -y nodejs &>/dev/null
fi
ok "Node.js $(node --version)  |  npm $(npm --version)"

# ── 3. PM2 ────────────────────────────────────────────────────────────────────
step "[3/8] PM2 + pm2-logrotate"
npm install -g pm2 &>/dev/null || true
pm2 install pm2-logrotate &>/dev/null || true
pm2 set pm2-logrotate:max_size 10M &>/dev/null || true
pm2 set pm2-logrotate:retain 7 &>/dev/null || true
pm2 set pm2-logrotate:compress true &>/dev/null || true
# PM2 startup
eval "$(pm2 startup 2>&1 | grep sudo | head -1)" &>/dev/null || true
ok "PM2 $(pm2 --version) + logrotate"

# ── 4. Nginx ──────────────────────────────────────────────────────────────────
step "[4/8] Nginx"
apt-get install -y nginx &>/dev/null
systemctl enable nginx &>/dev/null
systemctl start nginx || true
ok "Nginx $(nginx -v 2>&1 | grep -oP '[\d.]+')"

# ── 5. Certbot ────────────────────────────────────────────────────────────────
step "[5/8] Certbot (Let's Encrypt)"
if ! command -v certbot &>/dev/null; then
  apt-get install -y certbot python3-certbot-nginx &>/dev/null
fi
ok "Certbot $(certbot --version 2>&1 | head -1)"

# ── 6. MongoDB Tools ──────────────────────────────────────────────────────────
step "[6/8] MongoDB Database Tools (mongodump/mongorestore)"
if ! command -v mongodump &>/dev/null; then
  # Ubuntu 22.04/24.04
  UBUNTU_VER=$(lsb_release -rs)
  TOOLS_DEB="mongodb-database-tools-ubuntu${UBUNTU_VER/./}-x86_64-100.9.4.deb"
  TOOLS_URL="https://fastdl.mongodb.org/tools/db/${TOOLS_DEB}"
  wget -q "$TOOLS_URL" -O /tmp/mongodb-tools.deb 2>/dev/null \
    && dpkg -i /tmp/mongodb-tools.deb &>/dev/null \
    && rm -f /tmp/mongodb-tools.deb \
    || warn "MongoDB Tools tải thất bại — cài thủ công: https://www.mongodb.com/docs/database-tools/"
fi
command -v mongodump &>/dev/null && ok "mongodump $(mongodump --version 2>&1 | head -1)" \
  || warn "mongodump chưa được cài"

# ── 7. UFW Firewall ───────────────────────────────────────────────────────────
step "[7/8] UFW Firewall"
apt-get install -y ufw &>/dev/null || true
ufw --force reset &>/dev/null || true
ufw default deny incoming &>/dev/null
ufw default allow outgoing &>/dev/null
ufw allow ssh     &>/dev/null  # Port 22
ufw allow http    &>/dev/null  # Port 80
ufw allow https   &>/dev/null  # Port 443
# Port 3000 chỉ mở localhost (Nginx là reverse proxy) — không allow từ ngoài
ufw --force enable &>/dev/null
ok "UFW enabled: ssh(22) + http(80) + https(443)"

# ── 8. Thư mục & cấu hình Nginx ──────────────────────────────────────────────
step "[8/8] Cấu trúc thư mục + Nginx config"
mkdir -p /var/backups/AXVN
mkdir -p /var/log/pm2
mkdir -p /var/lkvip
mkdir -p /etc/nginx/snippets

# Copy Nginx snippets
SNIPPETS_DIR="$(dirname "$0")/../nginx/snippets"
if [[ -d "$SNIPPETS_DIR" ]]; then
  cp "$SNIPPETS_DIR"/*.conf /etc/nginx/snippets/ 2>/dev/null || true
  ok "Nginx snippets installed → /etc/nginx/snippets/"
else
  warn "Snippets thư mục không tìm thấy — tạo thủ công /etc/nginx/snippets/"
fi

# Copy Nginx site config
SITE_CONF="$(dirname "$0")/../nginx/nginx.conf.lkvip"
if [[ -f "$SITE_CONF" ]]; then
  cp "$SITE_CONF" /etc/nginx/sites-available/lkvip.conf
  ln -sf /etc/nginx/sites-available/lkvip.conf /etc/nginx/sites-enabled/lkvip.conf
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  nginx -t &>/dev/null && ok "Nginx config installed + tested" || warn "nginx -t thất bại — kiểm tra SSL cert paths"
else
  warn "nginx.conf.lkvip không tìm thấy — deploy thủ công"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ lkvip_holding VPS setup hoàn tất!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "  Các bước tiếp theo:"
echo ""
echo "  1. Clone/copy app code:"
echo "     git clone <repo> $APP_DIR"
echo ""
echo "  2. Cấu hình .env.local:"
echo "     cp $APP_DIR/.env.example $APP_DIR/.env.local"
echo "     nano $APP_DIR/.env.local"
echo ""
echo "  3. Install dependencies + build:"
echo "     cd $APP_DIR && npm ci && npm run build"
echo ""
echo "  4. Lấy SSL cert (sau khi DNS đã trỏ về server):"
echo "     certbot --nginx -d vnkr.vn -d www.vnkr.vn"
echo "     certbot --nginx -d langding.tc-gaming.live"
echo ""
echo "  5. Start PM2:"
echo "     cd $APP_DIR && pm2 start infra/ecosystem.config.js --env production"
echo "     pm2 save"
echo ""
echo "  6. Setup cron backup:"
echo "     (crontab -l 2>/dev/null; echo \"0 2 * * * $APP_DIR/scripts/backup.sh >> /var/log/AXVN-backup.log 2>&1\") | crontab -"
echo ""
