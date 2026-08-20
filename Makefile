# =============================================================================
# Makefile — Developer ergonomics for langding.tc-gaming.live / vnkr.vn
#
# Usage (từ thư mục gốc dự án /var/lkvip/langding):
#   make           — default: dev server
#   make build     — production build
#   make deploy    — zero-downtime deploy
#   make help      — list all targets
# =============================================================================
.DEFAULT_GOAL := dev
.PHONY: dev build build-analyze typecheck lint verify \
        deploy deploy-skip-build deploy-no-git rollback \
        start stop restart logs monit health \
        backup seed-plans seed-rbac provision-admin reset-admin \
        module env-check compress-images \
        pm2-setup pm2-save pm2-restart \
        setup install clean clean-all help

# ── Development ───────────────────────────────────────────────────────────────
dev:
	npm run dev

build:
	npm run build

build-analyze:
	npm run build:analyze

typecheck:
	npm run typecheck

lint:
	npm run lint

verify:
	bash scripts/axvn-manage.sh verify 2>&1

# ── Production ────────────────────────────────────────────────────────────────
deploy:
	bash scripts/axvn-manage.sh deploy

# Hot-patch: reload PM2 + Nginx nhưng không build (dành cho thay đổi env/nginx)
deploy-skip-build:
	bash scripts/axvn-manage.sh deploy --skip-build

# Build + deploy từ code hiện tại (không git pull — dành cho dev iteration)
deploy-no-git:
	bash scripts/axvn-manage.sh deploy --no-git

rollback:
	bash scripts/axvn-manage.sh rollback

start:
	npm run start

stop:
	pm2 stop AXVN-langding

restart:
	pm2 restart infra/ecosystem.config.js --env production --update-env

# ── Monitoring ────────────────────────────────────────────────────────────────
logs:
	pm2 logs AXVN-langding --lines 100

monit:
	pm2 monit

health:
	bash scripts/axvn-manage.sh health

# ── Database ──────────────────────────────────────────────────────────────────
backup:
	bash scripts/axvn-manage.sh backup

# Seed dữ liệu gói đầu tư mẫu (chỉ dùng với DB trống lần đầu)
seed-plans:
	npm run seed:plans

# Seed RBAC roles (chạy một lần khi setup lần đầu)
seed-rbac:
	npm run seed:rbac

# Provision tài khoản admin superadmin
provision-admin:
	npm run provision:admin

# Đặt lại mật khẩu admin khẩn cấp: make reset-admin email=admin@vnkr.vn pass=NewPass@123
reset-admin:
ifndef email
	$(error Usage: make reset-admin email=<admin-email> pass=<new-password>)
endif
ifndef pass
	$(error Usage: make reset-admin email=<admin-email> pass=<new-password>)
endif
	npx tsx src/cli/reset-admin.ts "$(email)" "$(pass)"

# ── Code generation ───────────────────────────────────────────────────────────
# Scaffold module Feature-Sliced: make module name=my-module
module:
ifndef name
	$(error Usage: make module name=<module-name>)
endif
	bash scripts/axvn-manage.sh make-module "$(name)"

# ── Utilities ─────────────────────────────────────────────────────────────────
# Validate biến môi trường trong .env.local
env-check:
	bash scripts/axvn-manage.sh check-env

# Nén ảnh trong public/ (giảm size trước khi deploy)
compress-images:
	bash scripts/axvn-manage.sh compress-img

# ── PM2 helpers ───────────────────────────────────────────────────────────────
# Cài pm2-logrotate (chạy một lần sau khi cài pm2)
pm2-setup:
	pm2 install pm2-logrotate
	pm2 set pm2-logrotate:max_size 10M
	pm2 set pm2-logrotate:retain 7
	pm2 set pm2-logrotate:compress true
	pm2 save

pm2-save:
	pm2 save --force

pm2-restart:
	pm2 restart infra/ecosystem.config.js --env production --update-env

# ── VPS Setup (lần đầu) ───────────────────────────────────────────────────────
setup:
	sudo bash scripts/axvn-manage.sh setup

# ── Dependencies ─────────────────────────────────────────────────────────────
install:
	npm ci

# Xóa cache và incremental build (giữ nguyên node_modules)
clean:
	rm -rf .next node_modules/.cache tsconfig.tsbuildinfo

# Xóa hoàn toàn — dùng khi cần npm ci sạch (mất ~2 phút để cài lại)
clean-all:
	rm -rf .next node_modules node_modules/.cache tsconfig.tsbuildinfo
	npm cache clean --force

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  ┌─────────────────────────────────────────────────────────────────────┐"
	@echo "  │  AXVN Tech Holding — Makefile targets                               │"
	@echo "  └─────────────────────────────────────────────────────────────────────┘"
	@echo ""
	@echo "  ── Development ─────────────────────────────────────────────────────────"
	@echo "  make dev                  — start Next.js dev server (turbopack)"
	@echo "  make build                — production build"
	@echo "  make build-analyze        — production build + bundle analyzer"
	@echo "  make typecheck            — TypeScript check (tsc --noEmit)"
	@echo "  make lint                 — ESLint (0 warnings)"
	@echo "  make verify               — full local verification (audit+build+tsc+lint)"
	@echo ""
	@echo "  ── Production ──────────────────────────────────────────────────────────"
	@echo "  make deploy               — zero-downtime deploy (git pull+build+PM2 reload)"
	@echo "  make deploy-skip-build    — reload PM2 only (no build — for env/config changes)"
	@echo "  make deploy-no-git        — build+deploy from current files (no git pull)"
	@echo "  make rollback             — interactive rollback to previous git SHA"
	@echo ""
	@echo "  ── Monitoring ──────────────────────────────────────────────────────────"
	@echo "  make logs                 — tail PM2 logs (100 lines)"
	@echo "  make monit                — PM2 monitor UI"
	@echo "  make health               — comprehensive health check"
	@echo ""
	@echo "  ── Database ────────────────────────────────────────────────────────────"
	@echo "  make backup               — MongoDB backup → /var/backups/AXVN/"
	@echo "  make seed-plans           — seed investment plans (first-time, empty DB)"
	@echo "  make seed-rbac            — seed RBAC roles (first-time setup)"
	@echo "  make provision-admin      — provision superadmin account"
	@echo "  make reset-admin email=<e> pass=<p>  — emergency password reset"
	@echo ""
	@echo "  ── Code generation ─────────────────────────────────────────────────────"
	@echo "  make module name=<n>      — scaffold new Feature-Sliced module"
	@echo ""
	@echo "  ── Utilities ───────────────────────────────────────────────────────────"
	@echo "  make env-check            — validate .env.local variables"
	@echo "  make compress-images      — lossless compress public/ images"
	@echo ""
	@echo "  ── PM2 ─────────────────────────────────────────────────────────────────"
	@echo "  make pm2-setup            — install + configure pm2-logrotate"
	@echo "  make pm2-save             — persist PM2 process list"
	@echo "  make pm2-restart          — force restart with updated env"
	@echo "  make stop                 — stop AXVN-langding process"
	@echo "  make restart              — restart with current ecosystem config"
	@echo ""
	@echo "  ── VPS Setup ───────────────────────────────────────────────────────────"
	@echo "  make setup                — first-time VPS provisioning (run as root)"
	@echo ""
	@echo "  ── Dependencies ────────────────────────────────────────────────────────"
	@echo "  make install              — npm ci"
	@echo "  make clean                — remove build cache (keep node_modules)"
	@echo "  make clean-all            — full wipe: build + node_modules + npm cache"
	@echo ""
