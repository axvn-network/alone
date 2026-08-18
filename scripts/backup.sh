#!/usr/bin/env bash
# ============================================================
# scripts/backup.sh — MongoDB backup with rotation + offsite S3 sync
#
# Usage:
#   bash scripts/backup.sh
#
# Cron (hàng ngày lúc 2:00 AM):
#   0 2 * * * /var/lkvip/langding/scripts/backup.sh >> /var/log/AXVN-backup.log 2>&1
#
# Biến môi trường tùy chọn:
#   BACKUP_RETENTION_DAYS  — số ngày giữ backup local (mặc định: 30)
#   S3_BUCKET              — s3://your-bucket/AXVN-backups (bỏ qua nếu không cấu hình)
#   AWS_PROFILE            — AWS profile name (mặc định: default)
# ============================================================
set -euo pipefail

ENV_FILE="${ENV_FILE:-/var/lkvip/langding/.env.local}"
BACKUP_DIR="/var/backups/AXVN"
LOG_FILE="/var/log/AXVN-backup.log"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# ── Logger ────────────────────────────────────────────────────────────────────
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [BACKUP] $*" | tee -a "$LOG_FILE"; }
log_err() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [BACKUP] ❌ $*" | tee -a "$LOG_FILE" >&2; }

# ── Load env vars ─────────────────────────────────────────────────────────────
if [[ -f "$ENV_FILE" ]]; then
  # Chỉ load các dòng KEY=VALUE, bỏ qua comment và dòng trống
  while IFS='=' read -r key rest; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    export "$key"="${rest}"
  done < <(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | grep '=')
else
  log_err "ENV_FILE không tìm thấy: $ENV_FILE"
  exit 1
fi

MONGODB_URI="${MONGODB_URI:-}"
S3_BUCKET="${S3_BUCKET:-}"

if [[ -z "$MONGODB_URI" ]]; then
  log_err "MONGODB_URI không được cấu hình trong $ENV_FILE"
  exit 1
fi

# ── Tạo thư mục backup nếu chưa có ──────────────────────────────────────────
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true

BACKUP_FILE="$BACKUP_DIR/AXVN_${TIMESTAMP}.gz"

log "Starting backup → $BACKUP_FILE"

# ── Run mongodump ─────────────────────────────────────────────────────────────
if ! command -v mongodump &>/dev/null; then
  log_err "mongodump không tìm thấy — cài: https://www.mongodb.com/docs/database-tools/"
  exit 1
fi

if mongodump --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip --quiet; then
  SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  log "✓ Backup complete ($SIZE) → $BACKUP_FILE"
else
  log_err "mongodump failed!"
  exit 1
fi

# ── Rotate old local backups ─────────────────────────────────────────────────
log "Rotating backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "AXVN_*.gz" -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true
COUNT=$(find "$BACKUP_DIR" -name "AXVN_*.gz" | wc -l)
log "✓ Rotation done. Retained backups: $COUNT"

# ── Offsite S3 sync (optional — chỉ chạy nếu S3_BUCKET được cấu hình) ────────
if [[ -n "$S3_BUCKET" ]]; then
  if command -v aws &>/dev/null; then
    log "Syncing to S3: $S3_BUCKET ..."
    AWS_PROFILE="${AWS_PROFILE:-default}"
    if aws s3 cp "$BACKUP_FILE" "${S3_BUCKET}/$(basename "$BACKUP_FILE")" \
        --profile "$AWS_PROFILE" \
        --storage-class STANDARD_IA \
        --quiet 2>>"$LOG_FILE"; then
      log "✓ S3 upload complete → ${S3_BUCKET}/$(basename "$BACKUP_FILE")"
      # Xóa remote files cũ hơn RETENTION_DAYS
      CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" '+%Y-%m-%d' 2>/dev/null || \
                   date -v -"${RETENTION_DAYS}d" '+%Y-%m-%d' 2>/dev/null || echo "")
      if [[ -n "$CUTOFF_DATE" ]]; then
        aws s3 ls "${S3_BUCKET}/" --profile "$AWS_PROFILE" 2>/dev/null | \
          awk '{print $4}' | \
          grep "^AXVN_" | \
          while read -r obj; do
            obj_date="${obj:5:8}"  # extract YYYYMMDD from AXVN_YYYYMMDD_...
            obj_date_fmt="${obj_date:0:4}-${obj_date:4:2}-${obj_date:6:2}"
            if [[ "$obj_date_fmt" < "$CUTOFF_DATE" ]]; then
              aws s3 rm "${S3_BUCKET}/${obj}" --profile "$AWS_PROFILE" --quiet 2>/dev/null || true
              log "✓ S3 removed old backup: $obj"
            fi
          done
      fi
    else
      log_err "S3 upload failed — backup local đã thành công"
    fi
  else
    log "⚠  S3_BUCKET được cấu hình nhưng 'aws' CLI không tìm thấy — bỏ qua offsite sync"
  fi
else
  log "ℹ  S3_BUCKET chưa cấu hình — chỉ backup local"
fi

log "✅ Done at $(date '+%Y-%m-%d %H:%M:%S')"
