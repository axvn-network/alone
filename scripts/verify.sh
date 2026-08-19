#!/usr/bin/env bash
# =============================================================================
# scripts/verify.sh — Full local verification pipeline
#
# Delegates to axvn-manage.sh verify so all logic stays in one place.
# Called by:  npm run verify  |  make verify
# =============================================================================
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/axvn-manage.sh" verify "$@"
