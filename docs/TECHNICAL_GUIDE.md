# Hướng dẫn Kỹ thuật (Technical Guide)

Tài liệu này tổng quan về kiến trúc, bảo mật và quy trình kỹ thuật cho dự án GVI Tech Holding Landing Page.

---

## 1. Kiến trúc Hệ thống

Dự án sử dụng kiến trúc **Next.js 16 (App Router)** với mô hình `standalone` để tối ưu hóa việc triển khai (deploy) trên môi trường sản xuất.

- **Frontend:** Next.js, Tailwind CSS, Framer Motion, GSAP.
- **Backend:** Node.js (tích hợp trong Next.js API routes).
- **Database:** MongoDB 9 + Mongoose (ORM).
- **Reverse Proxy:** Nginx (TLS 1.3, HSTS).
- **Process Manager:** PM2 (Cluster Mode).

---

## 2. Bảo mật (Security)

Bảo mật là ưu tiên hàng đầu, áp dụng theo các tầng:

### 2.1. Session Management
Sử dụng `HMAC-signed cookie` cho phiên làm việc.
- Payload: `JSON{id,email,exp}`
- Cơ chế: `base64url(payload) + '.' + HMAC-SHA256(payload, SESSION_SECRET)`
- Thuộc tính cookie: `httpOnly`, `secure`, `sameSite=strict` (production).

### 2.2. CSRF Protection (Double-submit pattern)
Tất cả các hành động ghi (POST/PUT/PATCH/DELETE) yêu cầu:
1. Cookie `csrf_token` (được set bởi `GET /api/csrf`).
2. Header `x-csrf-token` khớp với giá trị trong cookie.

### 2.3. Rate Limiting
Áp dụng cơ chế **Progressive Lockout** (tăng dần thời gian chặn) cho các endpoint nhạy cảm như `/api/admin-login` và `/api/contact`.

### 2.4. Security Headers
Thiết lập qua `next.config.ts` và `Nginx`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` (CSP) nghiêm ngặt.

---

## 3. Realtime với SSE
Hệ thống sử dụng **Server-Sent Events (SSE)** để cập nhật tin nhắn và thông báo cho admin/cổ đông mà không cần polling.
- **Broker:** `lib/sse-broker.ts` xử lý in-memory pub/sub.
- **Channel:** Phân quyền dựa trên role (`lib/channel-roles.ts`).

---

## 4. Quy trình Phát triển & Triển khai

### 4.1. Môi trường phát triển
- Sử dụng `.env.local` cho cấu hình cục bộ.
- `npm run dev` để chạy server phát triển.

### 4.2. Triển khai (Production - Ubuntu VPS)
Sử dụng script tự động hóa: `bash scripts/deploy.sh`
- Quy trình: `git pull` -> `npm ci` -> `npm run build` -> `pm2 reload langding`.
- Đảm bảo cấu hình môi trường trong `.env.local` đầy đủ các biến cần thiết trước khi deploy.

### 4.3. Backup
Backup dữ liệu MongoDB hàng ngày: `bash scripts/backup.sh` (được lên lịch qua crontab).
- Restore sử dụng: `mongorestore`.

---

## 5. Cấu trúc Thư mục Quan trọng

- `src/app/api/`: Các endpoint backend.
- `src/lib/`: Logic cốt lõi (session, db, sse, auth).
- `src/models/`: Định nghĩa Mongoose schemas.
- `src/services/`: Business logic.
- `scripts/`: Công cụ hỗ trợ (deploy, backup, seed, migration).

---

## 6. Lưu ý quan trọng
- **Legacy Code:** Dự án tồn tại các mã định danh cũ (`fortress-*`, `invest-with-fortress/*`). Không sử dụng chúng trong nội dung công khai mới.
- **Corpus Content:** Không được phép đưa các nội dung tài liệu pháp lý nội bộ ra ngoài hệ thống mà không được phép.
- **Linting:** Giải quyết vấn đề ESLint FlatCompat (nếu có) trước khi commit, không được phép disable lint.
