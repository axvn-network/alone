# =============================================================================
# infra/Makefile — Developer ergonomics (gọi từ thư mục gốc dự án)
#
# Usage:
#   make -f infra/Makefile           — default: dev server
#   make -f infra/Makefile build     — production build
#   make -f infra/Makefile deploy    — zero-downtime deploy
#   make -f infra/Makefile help      — list all targets
#
# Khuyến nghị: symlink root Makefile thay vì dùng -f trực tiếp:
#   ln -sf infra/Makefile Makefile  (nếu chưa có)
# =============================================================================

ROOT := $(shell cd "$(dir $(lastword $(MAKEFILE_LIST)))/.." && pwd)

.DEFAULT_GOAL := dev
.PHONY: dev build build-analyze typecheck lint verify \
        deploy deploy-skip-build deploy-no-git rollback \
        start stop restart logs monit health \
        backup seed-plans seed-rbac provision-admin reset-admin \
        module env-check compress-images \
        pm2-setup pm2-save pm2-restart \
        setup install clean help

# ── Development ───────────────────────────────────────────────────────────────
dev:
	cd "$(ROOT)" && npm run dev

build:
	cd "$(ROOT)" && npm run build

build-analyze:
	cd "$(ROOT)" && npm run build:analyze

typecheck:
	cd "$(ROOT)" && npm run typecheck

lint:
	cd "$(ROOT)" && npm run lint

verify:
	cd "$(ROOT)" && npm run verify

# ── Production ────────────────────────────────────────────────────────────────
deploy:
	cd "$(ROOT)" && bash scripts/deploy.sh

deploy-skip-build:
	cd "$(ROOT)" && bash scripts/deploy.sh --skip-build

deploy-no-git:
	cd "$(ROOT)" && bash scripts/deploy.sh --no-git

rollback:
	cd "$(ROOT)" && bash scripts/rollback.sh

start:
	cd "$(ROOT)" && npm run start

stop:
	pm2 stop AXVN-langding

restart:
	cd "$(ROOT)" && pm2 restart infra/ecosystem.config.js --env production --update-env

# ── Monitoring ────────────────────────────────────────────────────────────────
logs:
	pm2 logs AXVN-langding --lines 100

monit:
	pm2 monit

health:
	cd "$(ROOT)" && bash scripts/health-check.sh

# ── Database ──────────────────────────────────────────────────────────────────
backup:
	cd "$(ROOT)" && bash scripts/backup.sh

seed-plans:
	cd "$(ROOT)" && npm run seed:plans

seed-rbac:
	cd "$(ROOT)" && npm run seed:rbac

provision-admin:
	cd "$(ROOT)" && npm run provision:admin

# Đặt lại mật khẩu admin: make -f infra/Makefile reset-admin email=admin@vnkr.vn pass=NewPass@123
reset-admin:
ifndef email
	$(error Usage: make reset-admin email=<admin-email> pass=<new-password>)
endif
ifndef pass
	$(error Usage: make reset-admin email=<admin-email> pass=<new-password>)
endif
	cd "$(ROOT)" && npx tsx scripts/reset-admin.ts "$(email)" "$(pass)"

# ── Code generation ───────────────────────────────────────────────────────────
# Scaffold module: make -f infra/Makefile module name=investor
module:
ifndef name
	$(error Usage: make -f infra/Makefile module name=<module-name>)
endif
	cd "$(ROOT)" && bash scripts/make-module.sh "$(name)"

# ── Utilities ─────────────────────────────────────────────────────────────────
env-check:
	cd "$(ROOT)" && bash scripts/check-env.sh

compress-images:
	cd "$(ROOT)" && node scripts/compress-images.mjs

# ── PM2 helpers ───────────────────────────────────────────────────────────────
pm2-setup:
	pm2 install pm2-logrotate
	pm2 set pm2-logrotate:max_size 10M
	pm2 set pm2-logrotate:retain 7
	pm2 set pm2-logrotate:compress true
	pm2 save

pm2-save:
	pm2 save --force

pm2-restart:
	cd "$(ROOT)" && pm2 restart infra/ecosystem.config.js --env production --update-env

# ── VPS Setup ─────────────────────────────────────────────────────────────────
setup:
	sudo bash "$(ROOT)/scripts/setup.sh"

# ── Dependencies ─────────────────────────────────────────────────────────────
install:
	cd "$(ROOT)" && npm ci

clean:
	cd "$(ROOT)" && rm -rf .next node_modules/.cache tsconfig.tsbuildinfo

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  ┌──────────────────────────────────────────────────────────────────────────┐"
	@echo "  │  AXVN Tech Holding — infra/Makefile targets                              │"
	@echo "  └──────────────────────────────────────────────────────────────────────────┘"
	@echo ""
	@echo "  ── Development ──────────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile dev                  — start Next.js dev server"
	@echo "  make -f infra/Makefile build                — production build"
	@echo "  make -f infra/Makefile build-analyze        — build + bundle analyzer"
	@echo "  make -f infra/Makefile typecheck            — TypeScript check"
	@echo "  make -f infra/Makefile lint                 — ESLint (0 warnings)"
	@echo "  make -f infra/Makefile verify               — full verification suite"
	@echo ""
	@echo "  ── Production ────────────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile deploy               — zero-downtime deploy"
	@echo "  make -f infra/Makefile deploy-skip-build    — reload PM2 only (no build)"
	@echo "  make -f infra/Makefile deploy-no-git        — build from current files"
	@echo "  make -f infra/Makefile rollback             — interactive git rollback"
	@echo ""
	@echo "  ── Monitoring ────────────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile logs                 — tail PM2 logs"
	@echo "  make -f infra/Makefile monit                — PM2 monitor UI"
	@echo "  make -f infra/Makefile health               — comprehensive health check"
	@echo ""
	@echo "  ── Database ──────────────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile backup               — MongoDB backup"
	@echo "  make -f infra/Makefile seed-plans           — seed investment plans (first-time)"
	@echo "  make -f infra/Makefile reset-admin email=<e> pass=<p>"
	@echo ""
	@echo "  ── Code generation ──────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile module name=<n>      — scaffold Feature-Sliced module"
	@echo ""
	@echo "  ── Utilities ─────────────────────────────────────────────────────────────────"
	@echo "  make -f infra/Makefile env-check            — validate .env.local"
	@echo "  make -f infra/Makefile compress-images      — compress public/ images"
	@echo "  make -f infra/Makefile setup                — first-time VPS provisioning"
	@echo "  make -f infra/Makefile clean                — remove build cache"
	@echo ""
