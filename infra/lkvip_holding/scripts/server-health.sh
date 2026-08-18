#!/usr/bin/env bash
# ================================================================
# infra/lkvip_holding/scripts/server-health.sh
#
# Kiểm tra tổng thể sức khoẻ VPS lkvip_holding
# (Khác với scripts/health-check.sh — cái này check system-level)
#
# Sử dụng:
#   bash infra/lkvip_holding/scripts/server-health.sh
# ================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err_line() { echo -e "${RED}✗${NC}  $*"; }

FAIL=0
PASS=0

chk() {
  local label="$1"; shift
  if "$@" &>/dev/null; then
    ok "$label"
    ((PASS++)) || true
  else
    err_line "$label"
    ((FAIL++)) || true
  fi
}

echo ""
echo "══════════════════════════════════════"
echo "  lkvip_holding — Server Health Check"
echo "══════════════════════════════════════"
echo ""

# ── Services ──────────────────────────────────────────────────
echo "● Services"
chk "Nginx running"     systemctl is-active --quiet nginx
chk "PM2 daemon running" pm2 ping

# PM2 app status
if command -v pm2 &>/dev/null; then
  if pm2 list | grep -q "AXVN-langding"; then
    ok "AXVN-langding process online"
    ((PASS++)) || true
  else
    err_line "AXVN-langding NOT running"
    ((FAIL++)) || true
  fi
fi
echo ""

# ── Disk usage ────────────────────────────────────────────────
echo "● Disk"
ROOT_USE=$(df -h / | awk 'NR==2{print $5}' | tr -d '%')
BACKUP_USE=$(df -h /var/backups 2>/dev/null | awk 'NR==2{print $5}' | tr -d '%' || echo "0")

if [[ "$ROOT_USE" -lt 80 ]]; then
  ok "Root disk: ${ROOT_USE}% used"
  ((PASS++)) || true
else
  warn "Root disk: ${ROOT_USE}% used — dọn dẹp hoặc expand"
  ((FAIL++)) || true
fi
echo ""

# ── Memory ────────────────────────────────────────────────────
echo "● Memory"
MEM_FREE_PCT=$(free | awk '/Mem/{printf "%.0f", $4/$2*100}')
if [[ "$MEM_FREE_PCT" -gt 15 ]]; then
  ok "Memory: ${MEM_FREE_PCT}% free"
  ((PASS++)) || true
else
  warn "Memory low: ${MEM_FREE_PCT}% free"
  ((FAIL++)) || true
fi
echo ""

# ── SSL Certs ─────────────────────────────────────────────────
echo "● SSL Certificates"
for domain in langding.tc-gaming.live vnkr.vn; do
  CERT_PATH="/etc/letsencrypt/live/${domain}/fullchain.pem"
  if [[ -f "$CERT_PATH" ]]; then
    EXPIRE=$(openssl x509 -enddate -noout -in "$CERT_PATH" 2>/dev/null | cut -d= -f2)
    EXPIRE_TS=$(date -d "$EXPIRE" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRE" +%s 2>/dev/null || echo "0")
    NOW_TS=$(date +%s)
    DAYS_LEFT=$(( (EXPIRE_TS - NOW_TS) / 86400 ))
    if [[ "$DAYS_LEFT" -gt 14 ]]; then
      ok "$domain: cert valid (${DAYS_LEFT} days left)"
      ((PASS++)) || true
    else
      warn "$domain: cert EXPIRING SOON (${DAYS_LEFT} days left) — chạy: certbot renew"
      ((FAIL++)) || true
    fi
  else
    warn "$domain: cert không tìm thấy"
    ((FAIL++)) || true
  fi
done
echo ""

# ── Backup ────────────────────────────────────────────────────
echo "● Backup"
LATEST_BACKUP=$(find /var/backups/AXVN -name "AXVN_*.gz" -newer /tmp -mtime -2 2>/dev/null | head -1 || true)
if [[ -n "$LATEST_BACKUP" ]]; then
  BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP" 2>/dev/null || echo 0)) / 3600 ))
  ok "Latest backup: $(basename "$LATEST_BACKUP") (${BACKUP_AGE}h ago)"
  ((PASS++)) || true
else
  warn "Không tìm thấy backup trong 48h qua — kiểm tra cron"
  ((FAIL++)) || true
fi
echo ""

# ── Summary ───────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
if [[ "$FAIL" -eq 0 ]]; then
  echo -e "${GREEN}══════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✓ All checks passed ($PASS/$TOTAL)${NC}"
  echo -e "${GREEN}══════════════════════════════════════${NC}"
  exit 0
else
  echo -e "${RED}══════════════════════════════════════${NC}"
  echo -e "${RED}  ✗ $FAIL check(s) FAILED ($PASS/$TOTAL)${NC}"
  echo -e "${RED}══════════════════════════════════════${NC}"
  exit 1
fi
