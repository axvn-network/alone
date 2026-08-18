# AXVN Tech Holding — Website

Next.js website cho AXVN Tech Holding.
MongoDB · Cloudinary · Nodemailer · Admin panel với HMAC-signed cookie auth · SSE realtime · AI content assistant (Anthropic Claude).

> **Lưu ý trước khi public:** Chủ sở hữu cần xác minh toàn bộ thông tin pháp lý, giấy phép, số liệu tài chính, địa chỉ và kênh liên hệ trong CMS/Settings trước khi go-live.

---

## Quick Start (Development)

```bash
# 1. Clone & cài đặt
git clone <repo-url>
cd langding
npm install

# 2. Cấu hình môi trường
cp .env.example .env.local
# Chỉnh .env.local — bắt buộc: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

# 3. Khởi động dev server
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin-login

# 4. Seed gói đầu tư mẫu (chỉ dùng lần đầu với DB trống)
npm run seed:plans
```

---

## Cấu Trúc Dự Án

```
src/
├── app/          # Next.js Routing, Page/Layout definitions, API webhooks
├── core/         # Hạ tầng: DB connection, RBAC, Security, VN-utils
├── modules/      # Business logic: domain models, services, domain-specific components
├── shared/       # Cross-cutting: UI components, reusable hooks, shared utils, common types
├── data/         # Global static data/JSON
├── locales/      # i18n
└── middleware.ts # Edge: auth guard + CSRF + security headers
```

---

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm run build
npm run verify
```

---

## Deploy (Ubuntu VPS)

```bash
# Rolling update (zero-downtime)
cd /var/lkvip/langding
bash scripts/deploy.sh
```

---

## Environment Variables

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `NODE_ENV` | ✅ | `production` hoặc `development` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL đầy đủ e.g. `https://axvn.vn` |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `ADMIN_EMAIL` | ✅ | Email admin |
| `ADMIN_PASSWORD` | ✅ | Mật khẩu admin |
| `SESSION_SECRET` | ✅ | 64+ hex chars |
| `ANTHROPIC_API_KEY` | ⭕ | AI assistant key |
| `S3_BUCKET` | ⭕ | S3 backup bucket |
| `LOG_LEVEL` | ⭕ | Log level |

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
