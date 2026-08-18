#!/usr/bin/env bash
# ================================================================
# infra/lkvip_holding/scripts/renew-ssl.sh
#
# Renew Let's Encrypt SSL certs và reload Nginx
#
# Sử dụng:
#   bash infra/lkvip_holding/scripts/renew-ssl.sh
#
# Cron (hàng ngày lúc 3:30 AM):
#   30 3 * * * /var/lkvip/langding/infra/lkvip_holding/scripts/renew-ssl.sh >> /var/log/AXVN-ssl-renew.log 2>&1
# ================================================================
set -euo pipefail

LOG_FILE="/var/log/AXVN-ssl-renew.log"
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "Starting SSL renewal check..."

if ! command -v certbot &>/dev/null; then
  log "❌ certbot không tìm thấy"
  exit 1
fi

# certbot renew chỉ renew nếu cert sắp hết hạn (< 30 ngày)
if certbot renew --nginx --quiet 2>>"$LOG_FILE"; then
  log "✓ Renewal check complete"
  # Reload Nginx để áp dụng cert mới (nếu có)
  if systemctl reload nginx 2>/dev/null; then
    log "✓ Nginx reloaded"
  fi
else
  log "⚠  Renewal check completed with warnings — xem log trên"
fi

log "Done."
