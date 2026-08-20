#!/usr/bin/env bash
# =============================================================================
# scripts/health-check.sh — Local project health check
#
# Delegates to axvn-manage.sh health so all endpoint logic stays in one place.
# Called by:  npm run health
#
# For full verify pipeline (audit+lint+tsc+build) use:
#   npm run verify  |  bash scripts/axvn-manage.sh verify
# =============================================================================
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/axvn-manage.sh" health "$@"
