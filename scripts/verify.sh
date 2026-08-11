#!/usr/bin/env bash
# scripts/verify.sh — full project verification
# Always runs from the repo root regardless of where it is called from.
# Usage: bash scripts/verify.sh   OR   npm run verify
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

for tool in next tsc eslint; do
  if [[ ! -x "$REPO/node_modules/.bin/$tool" ]]; then
    echo "Missing local tool: node_modules/.bin/$tool. Run npm install first." >&2
    exit 1
  fi
done

# ── 1. Security audit ─────────────────────────────────────────────────────────
echo "▶ [1/5] npm audit (high+)"
npm audit --audit-level=high

# ── 2. Build (next build = compile + tsc + page generation) ──────────────────
echo "▶ [2/5] build"
npm run build

# ── 3. Standalone TypeScript check, after build generated .next/types ─────────
echo "▶ [3/5] typecheck"
npm run typecheck

# ── 4. Lint (ESLint CLI, 0 warnings allowed) ─────────────────────────────────
echo "▶ [4/5] lint"
npm run lint

# ── 5. Whitespace / conflict-marker check ────────────────────────────────────
echo "▶ [5/5] git diff --check"
git diff --check

echo "✅ verify passed"
