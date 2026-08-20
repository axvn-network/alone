#!/usr/bin/env bash
# =============================================================================
# scripts/deploy.sh — Zero-downtime deploy entry point
#
# This script is the CD entry point called by the GitHub Actions CD workflow
# (langding/.github/workflows/cd.yml) via SSH.
#
# All deployment logic is consolidated in axvn-manage.sh to avoid duplication.
#
# Usage (local):
#   bash scripts/deploy.sh [--skip-build]
#
# Usage (CI/CD):
#   bash scripts/deploy.sh           # full deploy
#   bash scripts/deploy.sh --skip-build
# =============================================================================
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/axvn-manage.sh" deploy "$@"
