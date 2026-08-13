#!/bin/bash
set -euo pipefail

# ================================================================
# Environment Validation Script — AXVN Tech Holding
# Purpose: Validate all required environment variables before deploy
# Usage: bash scripts/check-env.sh
# ================================================================

ENV_FILE="${ENV_FILE:-.env.local}"
ERRORS=0

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { echo "[❌] $*"; ((ERRORS++)); }
success() { echo "[✓] $*"; }

log "Validating environment file: $ENV_FILE"

[[ -f "$ENV_FILE" ]] || { error "Environment file not found: $ENV_FILE"; exit 1; }

# Load env file
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# ── Required variables ──────────────────────────────────────────
REQUIRED=(
  "NODE_ENV"
  "NEXT_PUBLIC_SITE_URL"
  "MONGODB_URI"
  "ADMIN_EMAIL"
  "ADMIN_PASSWORD"
  "SESSION_SECRET"
)

for VAR in "${REQUIRED[@]}"; do
  if [[ -z "${!VAR:-}" ]]; then
    error "Missing required variable: $VAR"
  else
    success "$VAR is set"
  fi
done

# ── Site URL validation ─────────────────────────────────────────
if [[ "${NEXT_PUBLIC_SITE_URL:-}" =~ ^https?:// ]]; then
  success "NEXT_PUBLIC_SITE_URL format is valid"
else
  error "NEXT_PUBLIC_SITE_URL must start with http:// or https://"
fi

# ── MongoDB URI validation ──────────────────────────────────────
if [[ "${MONGODB_URI:-}" =~ ^mongodb(\+srv)?:// ]]; then
  success "MONGODB_URI format is valid"
else
  error "MONGODB_URI must start with mongodb:// or mongodb+srv://"
fi

# ── SMTP validation (optional but recommended) ──────────────────
if [[ -n "${SMTP_HOST:-}" && -n "${SMTP_USER:-}" && -n "${SMTP_PASS:-}" ]]; then
  success "SMTP configuration is complete"
else
  log "⚠️  SMTP not fully configured (email notifications disabled)"
fi

# ── Cloudinary validation (optional) ────────────────────────────
if [[ -n "${CLOUDINARY_CLOUD_NAME:-}" && -n "${CLOUDINARY_API_KEY:-}" && -n "${CLOUDINARY_API_SECRET:-}" ]]; then
  success "Cloudinary configuration is complete"
else
  log "⚠️  Cloudinary not configured (file uploads will fail)"
fi

# ── Final result ────────────────────────────────────────────────
echo ""
if [[ $ERRORS -eq 0 ]]; then
  log "✅ Environment validation passed!"
  exit 0
else
  log "❌ Environment validation failed with $ERRORS error(s)"
  exit 1
fi
