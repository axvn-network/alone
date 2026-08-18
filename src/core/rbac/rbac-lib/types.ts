/**
 * src/lib/rbac/types.ts
 *
 * Định nghĩa kiểu dữ liệu trung tâm cho hệ thống phân quyền (RBAC).
 *
 * Kiến trúc 3 vai trò:
 *   ┌─────────────────────┬──────────────────────────────────────────────┐
 *   │ Vai trò             │ Mô tả                                        │
 *   ├─────────────────────┼──────────────────────────────────────────────┤
 *   │ superadmin          │ Toàn quyền — quản lý admins + hệ thống      │
 *   │ admin               │ Quản trị viên — nội dung, cổ đông, báo cáo  │
 *   │ shareholder         │ Cổ đông — cổng nội bộ, tài liệu, dữ liệu   │
 *   │ public              │ Người dùng công khai — chỉ trang public      │
 *   └─────────────────────┴──────────────────────────────────────────────┘
 *
 * Cách mở rộng thêm vai trò:
 *   1. Thêm giá trị vào union type `AppRole`
 *   2. Thêm mảng quyền tương ứng trong `ROLE_PERMISSIONS` (permissions.ts)
 *   3. Thêm định nghĩa route trong `ROUTE_ACCESS_MAP` (permissions.ts)
 *   4. Các guard và utility tự động áp dụng — không cần sửa thêm
 */

// ─── Vai trò hệ thống ─────────────────────────────────────────────────────────

/**
 * Tất cả vai trò được phép trong ứng dụng.
 * Thứ tự: từ cao nhất đến thấp nhất về quyền hạn.
 */
export type AppRole =
  | "superadmin"   // Siêu quản trị viên — quyền tuyệt đối
  | "admin"        // Quản trị viên — quản lý hệ thống
  | "shareholder"  // Cổ đông dự án — cổng nội bộ
  | "public";      // Người dùng công khai

// ─── Định danh người dùng đã xác thực ────────────────────────────────────────

/**
 * Thông tin người dùng đã xác thực được lưu trong session / token.
 * Đây là kiểu dữ liệu chung dùng trong toàn bộ ứng dụng.
 */
export interface AuthenticatedUser {
  /** ID tài liệu MongoDB */
  id: string;
  /** Tên hiển thị */
  name: string;
  /** Địa chỉ email */
  email: string;
  /** Vai trò trong hệ thống */
  role: AppRole;
  /** Nguồn gốc của user — để phân biệt collection MongoDB */
  source: "admin" | "shareholder" | "public";
}

// ─── Danh sách quyền hạn (Permissions) ───────────────────────────────────────

/**
 * Tất cả quyền hạn được định nghĩa trong hệ thống.
 * Mỗi quyền là một chuỗi dạng "tài_nguyên:hành_động".
 *
 * Convention:
 *   - `manage` = toàn quyền CRUD
 *   - `read`   = chỉ đọc
 *   - `write`  = tạo + sửa (không xóa)
 *   - `delete` = quyền xóa
 *   - `download` = tải xuống file
 *
 * Mở rộng: thêm giá trị vào union này và khai báo trong ROLE_PERMISSIONS.
 */
export type Permission =
  // ── Quản lý tài khoản Admin ──────────────────────────────────────────────
  | "admin_accounts:manage"     // Tạo / sửa / xóa tài khoản admin (superadmin only)

  // ── Quản lý nội dung ────────────────────────────────────────────────────
  | "content:read"              // Đọc nội dung landing page
  | "content:write"             // Soạn / sửa nội dung
  | "content:publish"           // Xuất bản / gỡ xuống nội dung
  | "content:delete"            // Xóa nội dung

  // ── Cổ đông ──────────────────────────────────────────────────────────────
  | "shareholders:read"         // Xem danh sách cổ đông
  | "shareholders:write"        // Sửa thông tin cổ đông
  | "shareholders:manage"       // Toàn quyền CRUD cổ đông

  // ── Tài liệu ─────────────────────────────────────────────────────────────
  | "documents:read"            // Xem tài liệu
  | "documents:download"        // Tải xuống tài liệu
  | "documents:manage"          // Upload / xóa tài liệu

  // ── Kế hoạch đầu tư ──────────────────────────────────────────────────────
  | "investment_plans:read"     // Xem kế hoạch
  | "investment_plans:manage"   // Quản lý kế hoạch đầu tư

  // ── Báo cáo & Thống kê ────────────────────────────────────────────────────
  | "reports:read"              // Xem báo cáo nội bộ
  | "reports:read_all"          // Xem toàn bộ báo cáo + log hệ thống

  // ── Enquiry / Liên hệ ─────────────────────────────────────────────────────
  | "enquiries:read"            // Xem yêu cầu liên hệ
  | "enquiries:manage"          // Quản lý yêu cầu liên hệ

  // ── Đối tác ──────────────────────────────────────────────────────────────
  | "partner_applications:read"    // Xem đơn đối tác
  | "partner_applications:manage"  // Quản lý đơn đối tác

  // ── Cài đặt hệ thống ──────────────────────────────────────────────────────
  | "settings:read"             // Xem cài đặt
  | "settings:manage"           // Thay đổi cài đặt hệ thống

  // ── Audit Log ─────────────────────────────────────────────────────────────
  | "audit_log:read"            // Xem log kiểm toán

  // ── Cuộc họp cổ đông ─────────────────────────────────────────────────────
  | "sh_meetings:read"          // Xem lịch họp cổ đông
  | "sh_meetings:manage"        // Quản lý cuộc họp

  // ── Tin nhắn nội bộ ──────────────────────────────────────────────────────
  | "sh_messages:read"          // Xem tin nhắn nội bộ
  | "sh_messages:write"         // Gửi tin nhắn

  // ── Nhiệm vụ cổ đông ─────────────────────────────────────────────────────
  | "sh_tasks:read"             // Xem danh sách nhiệm vụ
  | "sh_tasks:manage"           // Quản lý nhiệm vụ

  // ── Cổng công khai ────────────────────────────────────────────────────────
  | "public:access"             // Truy cập trang công khai
  | "public:contact"            // Gửi form liên hệ
  | "public:register"           // Đăng ký tài khoản
  | "public:newsletter";        // Đăng ký nhận bản tin

// ─── Kết quả kiểm tra quyền ──────────────────────────────────────────────────

/**
 * Kết quả trả về từ các hàm kiểm tra quyền.
 * Dùng cho cả phía server (guards) lẫn phía client (hook).
 */
export interface PermissionCheckResult {
  /** Có quyền truy cập không? */
  allowed: boolean;
  /** Lý do từ chối (nếu không có quyền) */
  reason?: string;
  /** Mã HTTP tương ứng (403 hoặc 401) */
  statusCode?: 401 | 403;
}

// ─── Cấu hình route ──────────────────────────────────────────────────────────

/**
 * Cấu hình quyền truy cập cho một nhóm route.
 * Dùng để khai báo trong ROUTE_ACCESS_MAP (permissions.ts).
 */
export interface RouteConfig {
  /** Danh sách vai trò được phép truy cập */
  allowedRoles: AppRole[];
  /** Quyền bổ sung cần có (AND — tất cả quyền đều phải thoả mãn) */
  requiredPermissions?: Permission[];
  /** Nếu true, chỉ cần 1 trong số requiredPermissions (OR) */
  requireAnyPermission?: boolean;
  /** Mô tả route — dùng cho tài liệu và debug */
  description?: string;
}
