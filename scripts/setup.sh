#!/usr/bin/env bash
# =============================================================================
# scripts/setup.sh — First-time VPS provisioning for AXVN Tech Holding
#
# Sử dụng (chạy 1 lần duy nhất trên server mới):
#   sudo bash scripts/setup.sh
#
# Script này sẽ:
#   1. Kiểm tra và cài đặt Node.js (LTS), PM2, Nginx, MongoDB Tools
#   2. Tạo cấu trúc thư mục cần thiết (/var/backups, /var/log/pm2)
#   3. Cài đặt pm2-logrotate
#   4. Cấu hình Nginx site
#   5. Hướng dẫn bước tiếp theo
#
# Yêu cầu: Ubuntu 20.04/22.04/24.04 · Quyền root/sudo
# =============================================================================
set -euo pipefail

APP_DIR="/var/lkvip/langding"
PM2_APP="AXVN-langding"
NODE_VERSION="22"   # LTS version

# ── Màu terminal ──────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()    { echo -e "${GREEN}✓${NC}  $*"; }
warn()  { echo -e "${YELLOW}!${NC}  $*"; }
err()   { echo -e "${RED}✗${NC}  $*"; exit 1; }
step()  { echo -e "\n${CYAN}▶${NC}  $*"; }
info()  { echo -e "   $*"; }

# ── Kiểm tra quyền root ───────────────────────────────────────────────────────
if [[ "$EUID" -ne 0 ]]; then
  err "Script này phải chạy với quyền root/sudo: sudo bash scripts/setup.sh"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AXVN Tech Holding — First-time VPS Setup${NC}"
echo -e "${CYAN}  App dir: $APP_DIR${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# ── 1. Cập nhật package list ──────────────────────────────────────────────────
step "[1/7] Cập nhật package list"
apt-get update -qq
ok "apt-get update"

# ── 2. Cài đặt Node.js ───────────────────────────────────────────────────────
step "[2/7] Node.js ${NODE_VERSION}.x"
if command -v node &>/dev/null; then
  NODE_VER=$(node --version)
  ok "Node.js đã được cài: $NODE_VER"
else
  info "Cài đặt Node.js ${NODE_VERSION}.x via NodeSource..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - &>/dev/null
  apt-get install -y nodejs &>/dev/null
  ok "Node.js $(node --version) đã được cài"
fi

# ── 3. Cài đặt PM2 ───────────────────────────────────────────────────────────
step "[3/7] PM2"
if command -v pm2 &>/dev/null; then
  ok "PM2 đã được cài: $(pm2 --version)"
else
  npm install -g pm2 &>/dev/null
  ok "PM2 $(pm2 --version) đã được cài"
fi

# Cấu hình pm2-logrotate
pm2 install pm2-logrotate &>/dev/null || true
pm2 set pm2-logrotate:max_size 10M &>/dev/null || true
pm2 set pm2-logrotate:retain 7 &>/dev/null || true
pm2 set pm2-logrotate:compress true &>/dev/null || true
ok "pm2-logrotate đã được cấu hình (10M/7 rotations)"

# PM2 startup
info "Cấu hình PM2 startup..."
pm2_startup=$(pm2 startup 2>&1 | grep "sudo" | head -1 || true)
if [[ -n "$pm2_startup" ]]; then
  eval "$pm2_startup" &>/dev/null || true
  ok "PM2 startup configured"
else
  warn "Không thể auto-configure PM2 startup — chạy thủ công: pm2 startup"
fi

# ── 4. Cài đặt Nginx ─────────────────────────────────────────────────────────
step "[4/7] Nginx"
if command -v nginx &>/dev/null; then
  ok "Nginx đã được cài: $(nginx -v 2>&1 | head -1)"
else
  apt-get install -y nginx &>/dev/null
  ok "Nginx $(nginx -v 2>&1 | head -1) đã được cài"
fi

systemctl enable nginx &>/dev/null || true
systemctl start nginx || true
ok "Nginx service enabled + started"

# ── 5. Cài đặt MongoDB Tools (mongodump/mongorestore) ─────────────────────────
step "[5/7] MongoDB Database Tools"
if command -v mongodump &>/dev/null; then
  ok "mongodump đã được cài"
else
  warn "mongodump chưa có — cài thủ công từ https://www.mongodb.com/docs/database-tools/"
  info "Ubuntu 22.04: wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb"
  info "             dpkg -i mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb"
fi

# ── 6. Tạo thư mục cần thiết ──────────────────────────────────────────────────
step "[6/7] Tạo cấu trúc thư mục"
mkdir -p /var/backups/AXVN
mkdir -p /var/log/pm2
mkdir -p /tmp/incidents
ok "Directories created: /var/backups/AXVN, /var/log/pm2, /tmp/incidents"

# ── 7. Cấu hình Nginx site ────────────────────────────────────────────────────
step "[7/7] Nginx site config"
NGINX_CONF_SRC="$APP_DIR/infra/nginx/nginx.conf.langding"
NGINX_CONF_DST="/etc/nginx/sites-available/langding.conf"

if [[ -f "$NGINX_CONF_SRC" ]]; then
  cp "$NGINX_CONF_SRC" "$NGINX_CONF_DST"
  ln -sf "$NGINX_CONF_DST" /etc/nginx/sites-enabled/langding.conf
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  nginx -t 2>&1 | grep -q "ok" && ok "Nginx config deployed + tested" || warn "nginx -t có cảnh báo — kiểm tra lại"
else
  warn "Nginx config không tìm thấy tại $NGINX_CONF_SRC — cấu hình thủ công sau"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ VPS Setup hoàn tất!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  Các bước tiếp theo:"
echo ""
echo "  1. Điền .env.local:"
echo "     cp $APP_DIR/.env.example $APP_DIR/.env.local"
echo "     nano $APP_DIR/.env.local"
echo ""
echo "  2. Cài dependencies:"
echo "     cd $APP_DIR && npm ci"
echo ""
echo "  3. Lấy SSL cert (sau khi DNS đã trỏ về server):"
echo "     apt-get install -y certbot python3-certbot-nginx"
echo "     certbot --nginx -d langding.tc-gaming.live"
echo ""
echo "  4. Deploy lần đầu:"
echo "     cd $APP_DIR && bash scripts/deploy.sh"
echo ""
echo "  5. Verify:"
echo "     bash scripts/health-check.sh"
echo ""
echo "  6. Setup cron backup:"
echo "     crontab -e"
echo "     # Thêm: 0 2 * * * /var/lkvip/langding/scripts/backup.sh >> /var/log/AXVN-backup.log 2>&1"
echo ""
