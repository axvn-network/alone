#!/usr/bin/env bash
# ============================================================
# scripts/backup.sh — MongoDB backup with rotation
# Usage: bash scripts/backup.sh
# Add to cron: 0 2 * * * /var/lkvip/langding/scripts/backup.sh
# ============================================================
set -euo pipefail

ENV_FILE="${ENV_FILE:-/var/lkvip/langding/.env.local}"
BACKUP_DIR="/var/backups/gvi"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Load env vars
[[ -f "$ENV_FILE" ]] && export $(grep -v '^#' "$ENV_FILE" | grep -v '^\s*$' | xargs)

MONGODB_URI="${MONGODB_URI:-}"

if [[ -z "$MONGODB_URI" ]]; then
  echo "[BACKUP] ❌ MONGODB_URI not set"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/gvi_${TIMESTAMP}.gz"

echo "[BACKUP] Starting backup at $(date '+%Y-%m-%d %H:%M:%S')"
echo "[BACKUP] Output: $BACKUP_FILE"

# ── Run mongodump ────────────────────────────────────────────
if mongodump --uri="$MONGODB_URI" --archive="$BACKUP_FILE" --gzip --quiet; then
  SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  echo "[BACKUP] ✓ Backup complete ($SIZE)"
else
  echo "[BACKUP] ❌ Backup failed!"
  exit 1
fi

# ── Rotate old backups ───────────────────────────────────────
echo "[BACKUP] Rotating backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "gvi_*.gz" -mtime +$RETENTION_DAYS -delete
COUNT=$(find "$BACKUP_DIR" -name "gvi_*.gz" | wc -l)
echo "[BACKUP] ✓ Rotation done. Retained backups: $COUNT"

echo "[BACKUP] ✅ Done at $(date '+%Y-%m-%d %H:%M:%S')"
