#!/usr/bin/env bash
# ============================================================
# scripts/ssl-setup.sh — Obtain & install Let's Encrypt SSL
# Usage: bash scripts/ssl-setup.sh yourdomain.com
# ============================================================
set -euo pipefail

DOMAIN="${1:-}"
if [[ -z "$DOMAIN" ]]; then
  echo "Usage: bash scripts/ssl-setup.sh yourdomain.com"
  exit 1
fi

ADMIN_EMAIL="${CERTBOT_EMAIL:-admin@$DOMAIN}"

echo "Obtaining SSL certificate for $DOMAIN and www.$DOMAIN"
echo "Using admin email: $ADMIN_EMAIL"
echo ""

# ── Request certificate ──────────────────────────────────────
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --redirect \
  --email "$ADMIN_EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# ── Verify auto-renewal ──────────────────────────────────────
echo ""
echo "Testing auto-renewal (dry-run)..."
sudo certbot renew --dry-run

# ── Add cron for auto-renewal (if not present) ───────────────
CRON_JOB="0 3 * * * /usr/bin/certbot renew --quiet --deploy-hook 'systemctl reload nginx'"
if ! (crontab -l 2>/dev/null | grep -qF "certbot renew"); then
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "Certbot auto-renewal cron installed (daily at 03:00)"
fi

echo ""
echo "✅ SSL setup complete for $DOMAIN"
echo "   Your site is now available at: https://$DOMAIN"
