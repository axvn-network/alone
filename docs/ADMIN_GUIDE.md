# Hướng dẫn Quản trị Hệ thống (Admin Guide)

Tài liệu này cung cấp hướng dẫn chi tiết cho đội ngũ quản trị viên về cách vận hành website GVI Tech Holding (vnkr.vn).

---

## 1. Đăng nhập
- **URL:** `/admin-login`
- **Yêu cầu:** Tài khoản admin hợp lệ.
- **Bảo mật:** Sử dụng HMAC-signed cookie auth. Không chia sẻ tài khoản.

---

## 2. Tổng quan Dashboard (`/admin`)
Trang chủ admin cung cấp cái nhìn tổng quan về:
- Thống kê hệ thống.
- Nhật ký hoạt động gần nhất.
- Các yêu cầu mới từ cổ đông hoặc liên hệ.

---

## 3. Quản lý Nội dung (CMS - `/admin/content`, `/admin/blog`)
Hệ thống tích hợp **AI Content Assistant (Gemini)** để hỗ trợ soạn thảo.

### Quy trình soạn bài:
1. Truy cập trang quản lý tương ứng.
2. Tạo mới hoặc chỉnh sửa tài liệu/bài viết.
3. Trong khung soạn thảo, sử dụng tính năng **AI Assist** (thanh công cụ hoặc nút lệnh chuyên dụng) để:
   - Tạo dàn ý bài viết.
   - Viết tiếp đoạn văn dựa trên ý tưởng chính.
   - Sửa lỗi ngữ pháp/cấu trúc câu.
   - Tóm tắt hoặc mở rộng nội dung từ tài liệu nội bộ.

*Lưu ý: Luôn kiểm tra lại thông tin do AI tạo ra trước khi Publish.*

---

## 4. Quản lý Cổ đông & Điều hành (`/admin/shareholders`)
Đây là module cốt lõi để duy trì liên lạc và quản lý vận hành.

### 4.1. Cổ đông
- Xem danh sách, thông tin cổ đông.
- Kiểm tra trạng thái hoạt động.

### 4.2. Nhiệm vụ (`/admin/shareholder-ops/tasks`)
- Tạo, cập nhật trạng thái nhiệm vụ cho cổ đông.
- Phân quyền thực hiện.

### 4.3. Cuộc họp (`/admin/shareholder-ops/meetings`)
- Lên lịch họp.
- Thiết lập URL phòng họp.
- Quản lý danh sách khách mời (invitedRoles).

### 4.4. Nhắn tin Realtime (`/admin/shareholder-ops/messages`)
- Hệ thống hỗ trợ SSE (Server-Sent Events) để nhận thông báo tin nhắn mới theo thời gian thực.
- Đảm bảo kiểm tra các tab `Messages` để phản hồi kịp thời cho cổ đông.

---

## 5. Cài đặt Hệ thống (`/admin/settings`)
*Chỉ dành cho Superadmin.*
- Cấu hình Footer, Newsletter.
- Cấu hình thông tin liên hệ.
- Quản lý tài khoản Admin (`/admin/admins`).
- Xem Nhật ký hoạt động (`/admin/audit-log`).

---

## 6. Mẹo vận hành
- **Sử dụng AI:** Hãy tận dụng AI để tối ưu hóa thời gian soạn thảo văn bản, báo cáo hoặc tin nhắn cổ đông.
- **Kiểm tra nhật ký:** Nếu có sự cố bất thường, hãy kiểm tra `/admin/audit-log` để xem hành động của các admin khác.
- **Bảo mật:** Luôn đăng xuất (`/admin-logout`) sau khi hoàn tất công việc.
