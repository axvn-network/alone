#!/usr/bin/env bash
# =============================================================================
# scripts/axvn-manage.sh -- AXVN Tech Holding Unified Management CLI
#
# Usage:
#   bash scripts/axvn-manage.sh <command> [options]
#   bash scripts/axvn-manage.sh                    # interactive menu
#
# Commands:
#   deploy        [--skip-build] [--no-git]         Zero-downtime deploy
#   rollback      [<sha>] [--list]                  Rollback to a git SHA
#   backup                                          MongoDB backup + optional S3
#   health        [--url <url>]                     Smoke test + PM2 check
#   setup                                           First-time VPS provisioning
#   verify                                          Full pipeline: audit+build+tsc+lint
#   check-env                                       Validate .env.local variables
#   seed-plans    [--force]                         Seed investment plans (first-time)
#   make-module   <name>                            Scaffold Feature-Sliced module
#   compress-img                                    Compress public/ images (requires sharp)
# =============================================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ECOSYSTEM="$APP_DIR/infra/ecosystem.config.js"
NGINX_CONF_SRC="$APP_DIR/infra/nginx/langding.conf"
NGINX_CONF_DST="/etc/nginx/sites-available/langding.conf"
PM2_APP="AXVN-langding"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.local}"
BACKUP_DIR="/var/backups/AXVN"
LOG_FILE="/var/log/AXVN-backup.log"

# -- Terminal colors ----------------------------------------------------------
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}+${NC}  $*"; }
warn() { echo -e "${YELLOW}!${NC}  $*"; }
err()  { echo -e "${RED}x${NC}  $*"; exit 1; }
step() { echo -e "\n${YELLOW}>>${NC}  $*"; }
info() { echo -e "   $*"; }

# =============================================================================
# CMD: deploy
# =============================================================================
cmd_deploy() {
  local skip_build=false no_git=false
  for arg in "$@"; do
    [[ "$arg" == "--skip-build" ]] && skip_build=true
    [[ "$arg" == "--no-git"    ]] && no_git=true
  done

  cd "$APP_DIR"

  step "[deploy] Preflight checks"
  cmd_check_env || err "Environment validation failed. Fix .env.local first."
  [[ -f ".env.local"   ]] || err ".env.local not found -- copy from .env.example"
  [[ -f "package.json" ]] || err "package.json not found"
  [[ -d "node_modules" ]] || err "node_modules missing -- run: npm ci"
  [[ -f "$NGINX_CONF_SRC" ]] || err "Nginx config not found: $NGINX_CONF_SRC"
  command -v pm2   &>/dev/null || err "pm2 not found -- npm i -g pm2"
  command -v nginx &>/dev/null || err "nginx not found"
  ok "Preflight passed"

  if [[ "$no_git" == false ]]; then
    step "[deploy] git pull"
    git pull --ff-only 2>&1 || err "git pull failed -- resolve conflicts manually"
    ok "Git up-to-date"
  else
    warn "Skipping git pull (--no-git)"
  fi

  step "[deploy] TypeScript check"
  ./node_modules/.bin/tsc --noEmit 2>&1 || err "TypeScript errors -- fix before deploy"
  ok "TypeScript clean"

  if [[ "$skip_build" == false ]]; then
    step "[deploy] Production build"
    rm -rf .next/build 2>/dev/null || true
    npm run build 2>&1 || err "Build failed"
    ok "Build complete"
  else
    warn "Skipping build (--skip-build)"
  fi

  step "[deploy] Verify standalone output"
  [[ -f ".next/standalone/server.js" ]] || err ".next/standalone/server.js missing -- check next.config.ts output: 'standalone'"
  ok "Standalone output exists"

  step "[deploy] Copy static assets"
  mkdir -p .next/standalone/.next
  cp -r .next/static  .next/standalone/.next/static
  cp -r public        .next/standalone/public
  ok "Static assets copied"

  step "[deploy] Nginx config"
  if ! diff -q "$NGINX_CONF_SRC" "$NGINX_CONF_DST" &>/dev/null; then
    cp "$NGINX_CONF_SRC" "$NGINX_CONF_DST"
    warn "Nginx config updated -- testing..."
  else
    ok "Nginx config unchanged"
  fi
  nginx -t 2>&1 || err "nginx -t failed -- not reloading"
  nginx -s reload
  ok "Nginx reloaded"

  step "[deploy] PM2 reload"
  if pm2 list | grep -q "$PM2_APP"; then
    pm2 reload "$PM2_APP" 2>&1 | tail -6
    ok "PM2 reloaded (zero-downtime)"
  else
    warn "App not running -- starting from ecosystem config"
    pm2 start "$ECOSYSTEM" --env production 2>&1 | tail -6
    ok "PM2 started"
  fi
  pm2 save --force &>/dev/null
  ok "PM2 state saved"

  step "[deploy] Smoke test"
  sleep 3
  local base_url
  base_url=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d= -f2- | tr -d '"')
  base_url="${base_url:-http://localhost:3000}"
  local pass=0 fail=0
  _check_url() {
    local code
    code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$1")
    if [[ "$code" == "$2" ]]; then ok "[$code] $3"; ((pass++)); else warn "[$code != $2] $3 -- $1"; ((fail++)); fi
  }
  _check_url "${base_url}/"               "200" "Homepage"
  _check_url "${base_url}/api/health"     "200" "Health API"
  _check_url "${base_url}/content/strategy" "200" "Strategy page"
  _check_url "${base_url}/admin"          "307" "Admin (auth redirect)"

  echo ""
  if [[ $fail -eq 0 ]]; then ok "Smoke test passed ($pass/$((pass+fail)))"
  else warn "Smoke test: $pass passed, $fail failed -- check: pm2 logs $PM2_APP --lines 50"; fi

  echo -e "\n${GREEN}Deploy complete -> ${base_url}${NC}\n"
}

# =============================================================================
# CMD: rollback
# =============================================================================
cmd_rollback() {
  cd "$APP_DIR"
  local target_sha="${1:-}"

  if [[ "${target_sha}" == "--list" ]]; then
    echo ""
    echo -e "${CYAN}Last 15 commits:${NC}"
    git log --oneline -15
    echo ""
    return 0
  fi

  local current_sha current_msg
  current_sha=$(git rev-parse HEAD)
  current_msg=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "unknown")

  echo -e "\n${CYAN}Current:  ${YELLOW}${current_sha:0:8}${NC}  $current_msg"
  echo ""
  echo "Last 10 commits:"
  git log --oneline -10 | sed 's/^/  /'
  echo ""

  if [[ -z "$target_sha" ]]; then
    echo -ne "${YELLOW}Enter SHA to rollback (or Enter to cancel): ${NC}"
    read -r target_sha
    [[ -z "$target_sha" ]] && { warn "Rollback cancelled."; return 0; }
  fi

  git cat-file -e "${target_sha}^{commit}" 2>/dev/null || err "Invalid SHA: $target_sha"
  local target_full target_msg
  target_full=$(git rev-parse "$target_sha")
  target_msg=$(git log -1 --pretty=format:"%s" "$target_full" 2>/dev/null || echo "unknown")

  warn "Rollback:"
  echo "  From: ${current_sha:0:8}  $current_msg"
  echo "  To:   ${target_full:0:8}  $target_msg"
  echo ""
  echo -ne "${YELLOW}Confirm? (y/N): ${NC}"
  read -r confirm
  [[ "${confirm,,}" != "y" ]] && { warn "Rollback cancelled."; return 0; }

  step "[rollback] Save current SHA"
  echo "$current_sha" > "$APP_DIR/.rollback-prev-sha"
  ok "Saved to .rollback-prev-sha"

  step "[rollback] Checkout $target_full"
  git checkout "$target_full" 2>&1 | tail -3
  ok "Checked out ${target_full:0:8}"

  step "[rollback] npm ci"
  npm ci --omit=dev 2>&1 | tail -5
  ok "Dependencies installed"

  step "[rollback] Build"
  npm run build 2>&1 | tail -10
  ok "Build complete"

  step "[rollback] Copy static assets"
  [[ -f ".next/standalone/server.js" ]] || err ".next/standalone/server.js missing"
  mkdir -p .next/standalone/.next
  cp -r .next/static  .next/standalone/.next/static
  cp -r public        .next/standalone/public
  ok "Static assets copied"

  step "[rollback] PM2 reload"
  if pm2 list | grep -q "$PM2_APP"; then
    pm2 reload "$PM2_APP" 2>&1 | tail -4
    ok "PM2 reloaded"
  else
    pm2 start "$ECOSYSTEM" --env production 2>&1 | tail -4
    ok "PM2 started"
  fi
  pm2 save --force &>/dev/null

  sleep 3
  local base_url
  base_url=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d= -f2- | tr -d '"')
  base_url="${base_url:-http://localhost:3000}"
  local code
  code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$base_url/api/health")
  [[ "$code" == "200" ]] && ok "Health check: $code" || warn "Health check: $code"

  echo -e "\n${GREEN}Rollback complete -> ${target_full:0:8} | $base_url${NC}"
  echo ""
  echo "  To go back to main:"
  echo "    git checkout main && bash scripts/axvn-manage.sh deploy --no-git"
  echo ""
}

# =============================================================================
# CMD: backup
# =============================================================================
cmd_backup() {
  local log_ts
  log_ts() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [BACKUP] $*" | tee -a "$LOG_FILE"; }
  local log_err_fn
  log_err_fn() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [BACKUP] ERROR: $*" | tee -a "$LOG_FILE" >&2; }

  [[ -f "$ENV_FILE" ]] || { log_err_fn "ENV_FILE not found: $ENV_FILE"; exit 1; }

  local MONGODB_URI S3_BUCKET BACKUP_RETENTION_DAYS AWS_PROFILE
  while IFS='=' read -r key rest; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    export "$key"="${rest}"
  done < <(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | grep '=')

  MONGODB_URI="${MONGODB_URI:-}"
  S3_BUCKET="${S3_BUCKET:-}"
  BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
  AWS_PROFILE="${AWS_PROFILE:-default}"

  [[ -n "$MONGODB_URI" ]] || { log_err_fn "MONGODB_URI not set"; exit 1; }
  command -v mongodump &>/dev/null || { log_err_fn "mongodump not found"; exit 1; }

  mkdir -p "$BACKUP_DIR"
  mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true

  local timestamp backup_file
  timestamp=$(date '+%Y%m%d_%H%M%S')
  backup_file="$BACKUP_DIR/AXVN_${timestamp}.gz"

  log_ts "Starting backup -> $backup_file"

  if mongodump --uri="$MONGODB_URI" --archive="$backup_file" --gzip --quiet; then
    local size; size=$(du -sh "$backup_file" | cut -f1)
    log_ts "Backup complete ($size) -> $backup_file"
  else
    log_err_fn "mongodump failed"; exit 1
  fi

  log_ts "Rotating backups older than $BACKUP_RETENTION_DAYS days..."
  find "$BACKUP_DIR" -name "AXVN_*.gz" -mtime +"$BACKUP_RETENTION_DAYS" -delete 2>/dev/null || true
  local count; count=$(find "$BACKUP_DIR" -name "AXVN_*.gz" | wc -l)
  log_ts "Rotation done. Retained: $count"

  if [[ -n "$S3_BUCKET" ]]; then
    if command -v aws &>/dev/null; then
      log_ts "Syncing to S3: $S3_BUCKET ..."
      if aws s3 cp "$backup_file" "${S3_BUCKET}/$(basename "$backup_file")" \
          --profile "$AWS_PROFILE" --storage-class STANDARD_IA --quiet 2>>"$LOG_FILE"; then
        log_ts "S3 upload complete"
      else
        log_err_fn "S3 upload failed -- local backup still valid"
      fi
    else
      log_ts "S3_BUCKET set but 'aws' CLI not found -- skipping offsite sync"
    fi
  else
    log_ts "S3_BUCKET not configured -- local backup only"
  fi

  log_ts "Done at $(date '+%Y-%m-%d %H:%M:%S')"
}

# =============================================================================
# CMD: health
# =============================================================================
cmd_health() {
  local base_url="${BASE_URL:-}"
  if [[ -z "$base_url" && -f "$ENV_FILE" ]]; then
    base_url=$(grep "^NEXT_PUBLIC_SITE_URL=" "$ENV_FILE" | cut -d= -f2- | tr -d '"' || true)
  fi
  base_url="${base_url:-http://127.0.0.1:3000}"

  echo ""
  echo -e "${YELLOW}Health Check -- ${base_url}${NC}"
  echo ""

  local pass=0 fail=0 timeout="${HEALTH_TIMEOUT:-10}"
  _chk() {
    local method="$1" path="$2" expect="$3" label="$4"
    local code
    code=$(curl -sk -o /dev/null -w "%{http_code}" -X "$method" --max-time "$timeout" "${base_url}${path}" 2>/dev/null || echo "000")
    if [[ "$code" == "$expect" ]]; then ok "[$code] $label"; ((pass++)) || true
    else err "[$code != $expect] $label  ->  ${base_url}${path}"; ((fail++)) || true; fi
  }

  _chk GET "/"                             "200" "Homepage"
  _chk GET "/api/health"                   "200" "Health API (DB ping)"
  _chk GET "/admin"                        "307" "Admin dashboard (auth redirect)"
  _chk GET "/portals/shareholders/dashboard" "307" "Shareholder portal (auth redirect)"
  _chk GET "/api/admin/stats"              "401" "Admin stats API (auth guard)"
  _chk GET "/api/shareholders/tasks"       "401" "Shareholder tasks API (auth guard)"

  echo ""
  if command -v pm2 &>/dev/null; then
    if pm2 list | grep -q "$PM2_APP"; then
      local st; st=$(pm2 show "$PM2_APP" 2>/dev/null | grep -E "status\s*\|" | awk -F'|' '{gsub(/ /,""); print $2}' | head -1)
      ok "PM2 $PM2_APP  [${st:-online}]"
      ((pass++)) || true
    else
      warn "PM2 $PM2_APP not found"; ((fail++)) || true
    fi
  fi

  echo ""
  local total=$((pass + fail))
  if [[ $fail -eq 0 ]]; then
    echo -e "${GREEN}All checks passed ($pass/$total)${NC}\n"
    return 0
  else
    echo -e "${RED}$fail check(s) FAILED ($pass/$total) -- pm2 logs $PM2_APP --lines 50${NC}\n"
    return 1
  fi
}

# =============================================================================
# CMD: setup  (first-time VPS provisioning, requires root)
# =============================================================================
cmd_setup() {
  [[ "$EUID" -eq 0 ]] || err "Run with sudo: sudo bash scripts/axvn-manage.sh setup"

  local node_ver="22"
  echo -e "\n${CYAN}AXVN Tech Holding -- First-time VPS Setup${NC}\n"

  step "[1/7] apt-get update"
  apt-get update -qq
  ok "apt-get update"

  step "[2/7] Node.js ${node_ver}.x"
  if command -v node &>/dev/null; then
    ok "Node.js already installed: $(node --version)"
  else
    curl -fsSL "https://deb.nodesource.com/setup_${node_ver}.x" | bash - &>/dev/null
    apt-get install -y nodejs &>/dev/null
    ok "Node.js $(node --version) installed"
  fi

  step "[3/7] PM2"
  if command -v pm2 &>/dev/null; then
    ok "PM2 already installed: $(pm2 --version)"
  else
    npm install -g pm2 &>/dev/null
    ok "PM2 installed"
  fi
  pm2 install pm2-logrotate &>/dev/null || true
  pm2 set pm2-logrotate:max_size 10M &>/dev/null || true
  pm2 set pm2-logrotate:retain 7    &>/dev/null || true
  pm2 set pm2-logrotate:compress true &>/dev/null || true
  ok "pm2-logrotate configured"
  local pm2_startup
  pm2_startup=$(pm2 startup 2>&1 | grep "sudo" | head -1 || true)
  [[ -n "$pm2_startup" ]] && { eval "$pm2_startup" &>/dev/null || true; ok "PM2 startup configured"; } \
    || warn "Could not auto-configure PM2 startup -- run manually: pm2 startup"

  step "[4/7] Nginx"
  if command -v nginx &>/dev/null; then
    ok "Nginx already installed"
  else
    apt-get install -y nginx &>/dev/null
    ok "Nginx installed"
  fi
  systemctl enable nginx &>/dev/null || true
  systemctl start  nginx || true
  ok "Nginx enabled + started"

  step "[5/7] MongoDB Tools"
  if command -v mongodump &>/dev/null; then
    ok "mongodump already installed"
  else
    warn "mongodump not found -- install manually: https://www.mongodb.com/docs/database-tools/"
    info "Ubuntu 22.04: wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb"
    info "             dpkg -i mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb"
  fi

  step "[6/7] Create directories"
  mkdir -p /var/backups/AXVN /var/log/pm2 /tmp/incidents
  ok "/var/backups/AXVN, /var/log/pm2, /tmp/incidents created"

  step "[7/7] Nginx site config"
  local src="$APP_DIR/infra/nginx/langding.conf"
  if [[ -f "$src" ]]; then
    cp "$src" /etc/nginx/sites-available/langding.conf
    ln -sf /etc/nginx/sites-available/langding.conf /etc/nginx/sites-enabled/langding.conf
    rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
    nginx -t 2>&1 | grep -q "ok" && ok "Nginx config deployed" || warn "nginx -t warning -- check manually"
  else
    warn "Nginx config not found at $src -- configure manually"
  fi

  echo -e "\n${GREEN}VPS Setup complete!${NC}\n"
  echo "  Next steps:"
  echo "  1. cp $APP_DIR/.env.example $APP_DIR/.env.local  &&  nano $APP_DIR/.env.local"
  echo "  2. cd $APP_DIR && npm ci"
  echo "  3. certbot --nginx -d vnkr.vn  (after DNS is pointed)"
  echo "  4. bash scripts/axvn-manage.sh deploy"
  echo "  5. bash scripts/axvn-manage.sh health"
  echo "  6. Crontab:"
  echo "       0 2 * * * $APP_DIR/scripts/axvn-manage.sh backup >> /var/log/AXVN-backup.log 2>&1"
  echo "      30 3 * * * certbot renew --nginx --quiet"
  echo ""
}

# =============================================================================
# CMD: verify  (full pipeline -- local dev)
# =============================================================================
cmd_verify() {
  cd "$APP_DIR"
  for tool in next tsc eslint; do
    [[ -x "$APP_DIR/node_modules/.bin/$tool" ]] || err "Missing: node_modules/.bin/$tool -- run npm install"
  done

  step "[1/5] npm audit"
  npm audit --audit-level=high

  step "[2/5] lint"
  npm run lint

  step "[3/5] typecheck"
  npm run typecheck

  step "[4/5] build"
  npm run build

  step "[5/5] git diff --check"
  git diff --check

  ok "verify passed"
}

# =============================================================================
# CMD: check-env
# =============================================================================
cmd_check_env() {
  local env_file="${ENV_FILE:-$APP_DIR/.env.local}"
  local errors=0

  [[ -f "$env_file" ]] || { echo "[x] Environment file not found: $env_file"; return 1; }

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a

  local required=( NODE_ENV NEXT_PUBLIC_SITE_URL MONGODB_URI ADMIN_EMAIL ADMIN_PASSWORD SESSION_SECRET )
  for var in "${required[@]}"; do
    if [[ -z "${!var:-}" ]]; then
      echo "[x] Missing: $var"; ((errors++))
    else
      echo "[+] $var is set"
    fi
  done

  [[ "${NEXT_PUBLIC_SITE_URL:-}" =~ ^https?:// ]] \
    && echo "[+] NEXT_PUBLIC_SITE_URL format valid" \
    || { echo "[x] NEXT_PUBLIC_SITE_URL must start with http:// or https://"; ((errors++)); }

  [[ "${MONGODB_URI:-}" =~ ^mongodb(\+srv)?:// ]] \
    && echo "[+] MONGODB_URI format valid" \
    || { echo "[x] MONGODB_URI must start with mongodb:// or mongodb+srv://"; ((errors++)); }

  if [[ -n "${SMTP_HOST:-}" && -n "${SMTP_USER:-}" && -n "${SMTP_PASS:-}" ]]; then
    echo "[+] SMTP configured"
  else
    echo "[!] SMTP not fully configured (email notifications disabled)"
  fi

  if [[ -n "${CLOUDINARY_CLOUD_NAME:-}" && -n "${CLOUDINARY_API_KEY:-}" && -n "${CLOUDINARY_API_SECRET:-}" ]]; then
    echo "[+] Cloudinary configured"
  else
    echo "[!] Cloudinary not configured (file uploads will fail)"
  fi

  echo ""
  if [[ $errors -eq 0 ]]; then
    echo "Environment validation passed"
    return 0
  else
    echo "Environment validation failed: $errors error(s)"
    return 1
  fi
}

# =============================================================================
# CMD: seed-plans
# =============================================================================
cmd_seed_plans() {
  cd "$APP_DIR"
  [[ -f "$ENV_FILE" ]] || err ".env.local not found"
  local seed_script="$APP_DIR/src/cli/seed-investment-plans.ts"
  [[ -f "$seed_script" ]] || err "Seed script not found: $seed_script"
  echo "Seeding investment plans..."
  npx tsx "$seed_script" "$@"
}

# =============================================================================
# CMD: make-module
# =============================================================================
cmd_make_module() {
  local name="${1:-}"
  [[ -n "$name" ]] || err "Usage: axvn-manage.sh make-module <name>"

  local kebab pascal dest
  kebab=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
  pascal=$(echo "$name" | sed 's/[-_]\([a-z]\)/\U\1/g; s/^\([a-z]\)/\U\1/g')
  dest="$APP_DIR/src/modules/$kebab"

  [[ -d "$dest" ]] && err "Module '$kebab' already exists at $dest"
  mkdir -p "$dest"

  cat > "$dest/types.ts" << TMPL
/**
 * src/modules/$kebab/types.ts
 */

export interface I${pascal} {
  _id:       string;
  createdAt: string;
  updatedAt: string;
}

export interface ${pascal}Query {
  page?:  number;
  limit?: number;
}

export interface ${pascal}ListResult {
  docs:  I${pascal}[];
  total: number;
  page:  number;
  limit: number;
}
TMPL

  cat > "$dest/model.ts" << TMPL
/**
 * src/modules/$kebab/model.ts
 */
import mongoose, { Schema, Document } from "mongoose";

export interface I${pascal}Doc extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const ${pascal}Schema = new Schema<I${pascal}Doc>(
  { /* TODO: add fields */ },
  { timestamps: true }
);

const ${pascal} =
  mongoose.models.${pascal} ||
  mongoose.model<I${pascal}Doc>("${pascal}", ${pascal}Schema);

export default ${pascal};
TMPL

  cat > "$dest/schema.ts" << TMPL
/**
 * src/modules/$kebab/schema.ts
 * Zod validation schemas
 */
import { z } from "zod";

export const create${pascal}Schema = z.object({
  // TODO: add fields
});

export const update${pascal}Schema = create${pascal}Schema.partial();

export type Create${pascal}Input = z.infer<typeof create${pascal}Schema>;
export type Update${pascal}Input = z.infer<typeof update${pascal}Schema>;
TMPL

  cat > "$dest/service.ts" << TMPL
/**
 * src/modules/$kebab/service.ts
 */
import { connectDB } from "@/core/database";
import { paginate } from "@/shared/utils/pagination";
import ${pascal} from "./model";
import type { ${pascal}Query, ${pascal}ListResult } from "./types";

export async function list(query: ${pascal}Query = {}): Promise<${pascal}ListResult> {
  await connectDB();
  const { page, limit, skip } = paginate(query, { limit: 20, maxLimit: 100 });
  const [docs, total] = await Promise.all([
    ${pascal}.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ${pascal}.countDocuments(),
  ]);
  return { docs: docs as unknown as ${pascal}ListResult["docs"], total, page, limit };
}

// TODO: add create, update, delete functions
TMPL

  cat > "$dest/actions.ts" << TMPL
"use server";

/**
 * src/modules/$kebab/actions.ts
 * Server Actions
 */
import { revalidatePath } from "next/cache";
import { requireAdminGuard } from "@/core/rbac";
import { handleError } from "@/shared/utils/errors";
import * as service from "./service";
import { create${pascal}Schema } from "./schema";
import type { Create${pascal}Input } from "./schema";

export async function create${pascal}Action(raw: Create${pascal}Input) {
  await requireAdminGuard();

  const parsed = create${pascal}Schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    void service; // TODO: implement
    revalidatePath("/admin/$kebab");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
TMPL

  cat > "$dest/index.ts" << TMPL
/**
 * src/modules/$kebab/index.ts
 * Barrel export
 */
export * from "./types";
export * from "./schema";
export * as service from "./service";
export * as actions from "./actions";
export { default as ${pascal}Model } from "./model";
TMPL

  echo ""
  ok "Module scaffolded: $dest"
  echo ""
  echo "  Files created:"
  for f in types.ts model.ts schema.ts service.ts actions.ts index.ts; do
    echo "    $dest/$f"
  done
  echo ""
  echo "  Next steps:"
  echo "    1. Add fields to model.ts and schema.ts"
  echo "    2. Implement service functions"
  echo "    3. Create page: src/app/(admin)/admin/$kebab/page.tsx"
  echo ""
}

# =============================================================================
# CMD: compress-img
# =============================================================================
cmd_compress_img() {
  cd "$APP_DIR"
  [[ -f "node_modules/.bin/sharp" || -d "node_modules/sharp" ]] || err "sharp not installed -- npm install sharp"
  local script="$APP_DIR/scripts/compress-images.mjs"
  [[ -f "$script" ]] || err "compress-images.mjs not found"
  node "$script"
}

# =============================================================================
# Interactive menu
# =============================================================================
show_menu() {
  echo ""
  echo -e "${CYAN}AXVN Management CLI${NC}"
  echo -e "${CYAN}===================${NC}"
  echo "  1) deploy        -- Zero-downtime deploy"
  echo "  2) rollback      -- Rollback to a git SHA"
  echo "  3) backup        -- MongoDB backup"
  echo "  4) health        -- Smoke test + PM2 check"
  echo "  5) verify        -- Full pipeline (audit+lint+tsc+build)"
  echo "  6) check-env     -- Validate .env.local"
  echo "  7) seed-plans    -- Seed investment plans"
  echo "  8) make-module   -- Scaffold a new module"
  echo "  9) setup         -- First-time VPS setup (requires root)"
  echo "  0) exit"
  echo ""
  echo -ne "Option: "
}

run_interactive() {
  while true; do
    show_menu
    read -r opt
    echo ""
    case "$opt" in
      1) cmd_deploy ;;
      2) cmd_rollback ;;
      3) cmd_backup ;;
      4) cmd_health ;;
      5) cmd_verify ;;
      6) cmd_check_env ;;
      7) cmd_seed_plans ;;
      8)
        echo -ne "Module name: "
        read -r mod_name
        cmd_make_module "$mod_name"
        ;;
      9) cmd_setup ;;
      0) exit 0 ;;
      *) warn "Invalid option" ;;
    esac
  done
}

# =============================================================================
# Main dispatch
# =============================================================================
CMD="${1:-}"
shift || true

case "$CMD" in
  deploy)       cmd_deploy        "$@" ;;
  rollback)     cmd_rollback      "$@" ;;
  backup)       cmd_backup        "$@" ;;
  health)       cmd_health        "$@" ;;
  setup)        cmd_setup         "$@" ;;
  verify)       cmd_verify        "$@" ;;
  check-env)    cmd_check_env     "$@" ;;
  seed-plans)   cmd_seed_plans    "$@" ;;
  make-module)  cmd_make_module   "$@" ;;
  compress-img) cmd_compress_img  "$@" ;;
  "")           run_interactive ;;
  *)
    echo "Unknown command: $CMD"
    echo "Usage: bash scripts/axvn-manage.sh <command>"
    echo "Commands: deploy rollback backup health setup verify check-env seed-plans make-module compress-img"
    exit 1
    ;;
esac
