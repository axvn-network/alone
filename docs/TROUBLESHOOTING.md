# Khắc phục sự cố (Troubleshooting)

Tài liệu này tập trung vào các lỗi thường gặp trong quá trình phát triển và vận hành hệ thống.

---

## 1. Vấn đề về Cơ sở dữ liệu (MongoDB)
- **Lỗi kết nối:** Kiểm tra `MONGODB_URI` trong `.env.local`. Đảm bảo dịch vụ `mongod` đang chạy trên server.
- **Dữ liệu gói đầu tư trống:** Chạy lại script seed (chỉ dùng với DB trống):
  ```bash
  npm run seed:plans
  ```
- **Thay đổi schema hoặc dữ liệu:** Repository hiện không có script migration độc lập. Chuẩn bị, review và sao lưu trước khi chạy một migration riêng.

---

## 2. Vấn đề về Realtime (SSE)
- **SSE không nhận tin nhắn:**
  - Kiểm tra xem browser có chặn kết nối SSE không.
  - Kiểm tra `lib/sse-broker.ts` xem pub/sub có đang hoạt động bình thường không.
  - Nếu sử dụng Nginx, đảm bảo cấu hình proxy không buffering SSE responses:
    ```nginx
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding on;
    ```

---

## 3. Vấn đề về Deploy/Build
- **Build fail:** Kiểm tra `npx tsc --noEmit` để phát hiện lỗi TypeScript trước khi build.
- **PM2 reload không thành công:**
  - Kiểm tra logs: `pm2 logs langding --lines 200`
  - Đảm bảo các biến môi trường cần thiết (`ADMIN_PASSWORD`, `SESSION_SECRET`,...) đều đã được cấu hình đúng.

---

## 4. Vấn đề về AI/Gemini
- **AI không phản hồi:**
  - Kiểm tra `GEMINI_API_KEY` trong `.env.local`.
  - Kiểm tra quota API trên Google AI Studio.

---

## 5. Các lỗi thông thường khác
- **Lỗi quyền (Permissions):** Đảm bảo các file trong `scripts/` có quyền thực thi (`chmod +x scripts/*.sh`).
- **Lỗi ESLint:** Nếu lint không chạy được do cấu hình, hãy rà soát lại `eslint.config.mjs` và các dependency liên quan.
