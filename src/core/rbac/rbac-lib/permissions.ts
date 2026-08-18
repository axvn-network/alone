/**
 * src/lib/rbac/permissions.ts
 *
 * Bảng quyền hạn trung tâm — ánh xạ vai trò → danh sách quyền,
 * và định nghĩa bản đồ route → vai trò được phép truy cập.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  NGUYÊN TẮC THIẾT KẾ                                                   │
 * │  • superadmin kế thừa tất cả quyền của admin                           │
 * │  • admin kế thừa tất cả quyền của shareholder về báo cáo               │
 * │  • shareholder KHÔNG có quyền admin                                     │
 * │  • public KHÔNG có quyền truy cập trang nội bộ                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Mở rộng thêm vai trò:
 *   1. Thêm vai trò mới vào `AppRole` (types.ts)
 *   2. Khai báo mảng quyền trong ROLE_PERMISSIONS bên dưới
 *   3. Thêm route patterns vào ROUTE_ACCESS_MAP nếu cần
 */

import type { AppRole, Permission, RouteConfig } from "./types";

// ─── Quyền hạn theo từng vai trò ─────────────────────────────────────────────

/**
 * Bảng ánh xạ vai trò → danh sách quyền được phép.
 *
 * QUAN TRỌNG: Đây là nguồn sự thật duy nhất (single source of truth).
 * Không hard-code quyền ở nơi khác — luôn tham chiếu bảng này.
 */
export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  // ── Siêu Quản Trị Viên ────────────────────────────────────────────────────
  // Có toàn bộ quyền hạn trong hệ thống
  superadmin: [
    // Quản lý tài khoản admin
    "admin_accounts:manage",

    // Nội dung
    "content:read",
    "content:write",
    "content:publish",
    "content:delete",

    // Cổ đông
    "shareholders:read",
    "shareholders:write",
    "shareholders:manage",

    // Tài liệu
    "documents:read",
    "documents:download",
    "documents:manage",

    // Kế hoạch đầu tư
    "investment_plans:read",
    "investment_plans:manage",

    // Báo cáo
    "reports:read",
    "reports:read_all",

    // Enquiry
    "enquiries:read",
    "enquiries:manage",

    // Đối tác
    "partner_applications:read",
    "partner_applications:manage",

    // Cài đặt
    "settings:read",
    "settings:manage",

    // Audit log
    "audit_log:read",

    // Cổ đông nội bộ
    "sh_meetings:read",
    "sh_meetings:manage",
    "sh_messages:read",
    "sh_messages:write",
    "sh_tasks:read",
    "sh_tasks:manage",

    // Cổng công khai
    "public:access",
    "public:contact",
    "public:register",
    "public:newsletter",
  ],

  // ── Quản Trị Viên ─────────────────────────────────────────────────────────
  // Quản lý nội dung, cổ đông, báo cáo — KHÔNG tạo/xóa admin khác
  admin: [
    // Nội dung
    "content:read",
    "content:write",
    "content:publish",
    "content:delete",

    // Cổ đông
    "shareholders:read",
    "shareholders:write",
    "shareholders:manage",

    // Tài liệu
    "documents:read",
    "documents:download",
    "documents:manage",

    // Kế hoạch đầu tư
    "investment_plans:read",
    "investment_plans:manage",

    // Báo cáo
    "reports:read",
    "reports:read_all",

    // Enquiry
    "enquiries:read",
    "enquiries:manage",

    // Đối tác
    "partner_applications:read",
    "partner_applications:manage",

    // Cài đặt (chỉ đọc — không quản lý vai trò người dùng)
    "settings:read",
    "settings:manage",

    // Audit log
    "audit_log:read",

    // Cổ đông nội bộ
    "sh_meetings:read",
    "sh_meetings:manage",
    "sh_messages:read",
    "sh_messages:write",
    "sh_tasks:read",
    "sh_tasks:manage",

    // Cổng công khai
    "public:access",
    "public:contact",
    "public:register",
    "public:newsletter",
  ],

  // ── Cổ Đông Dự Án ─────────────────────────────────────────────────────────
  // Truy cập cổng nội bộ — KHÔNG có quyền admin
  shareholder: [
    // Tài liệu — chỉ đọc và tải xuống
    "documents:read",
    "documents:download",

    // Kế hoạch đầu tư — chỉ đọc
    "investment_plans:read",

    // Báo cáo nội bộ — chỉ đọc (không xem toàn bộ log hệ thống)
    "reports:read",

    // Cuộc họp cổ đông
    "sh_meetings:read",

    // Tin nhắn nội bộ
    "sh_messages:read",
    "sh_messages:write",

    // Nhiệm vụ được giao
    "sh_tasks:read",

    // Cổng công khai
    "public:access",
    "public:contact",
    "public:newsletter",
  ],

  // ── Người Dùng Công Khai ──────────────────────────────────────────────────
  // Chỉ truy cập trang public — không có quyền nội bộ
  public: [
    "public:access",
    "public:contact",
    "public:register",
    "public:newsletter",
  ],
};

// ─── Bản đồ route → cấu hình quyền truy cập ──────────────────────────────────

/**
 * Ánh xạ pattern route → cấu hình vai trò & quyền được phép.
 *
 * Quy ước pattern:
 *   - Chuỗi đơn giản khớp chính xác hoặc prefix nếu kết thúc bằng "*"
 *   - Ký tự "*" cuối cùng = khớp tất cả sub-path
 *
 * Thứ tự ưu tiên: pattern cụ thể hơn được đặt trước.
 *
 * Sử dụng trong:
 *   - middleware.ts (Edge Runtime — kiểm tra nhanh theo prefix)
 *   - guards.ts (Server-side — kiểm tra đầy đủ với quyền hạn)
 */
export const ROUTE_ACCESS_MAP: Record<string, RouteConfig> = {
  // ── Trang Quản Trị ────────────────────────────────────────────────────────
  "/admin": {
    allowedRoles: ["admin", "superadmin"],
    description: "Bảng điều khiển quản trị",
  },
  "/admin/*": {
    allowedRoles: ["admin", "superadmin"],
    description: "Tất cả trang con trong khu vực quản trị",
  },

  // ── API Quản Trị ──────────────────────────────────────────────────────────
  "/api/admin/*": {
    allowedRoles: ["admin", "superadmin"],
    description: "Tất cả API quản trị",
  },

  // API chỉ dành cho superadmin
  "/api/admin/admins": {
    allowedRoles: ["superadmin"],
    requiredPermissions: ["admin_accounts:manage"],
    description: "Quản lý tài khoản admin — chỉ superadmin",
  },

  // ── Cổng Cổ Đông ──────────────────────────────────────────────────────────
  "/portals/shareholders/dashboard": {
    allowedRoles: ["admin", "superadmin", "shareholder"],
    description: "Trang tổng quan cổ đông",
  },
  "/portals/shareholders/dashboard/*": {
    allowedRoles: ["admin", "superadmin", "shareholder"],
    description: "Tất cả trang trong cổng cổ đông",
  },

  // ── API Cổ Đông ───────────────────────────────────────────────────────────
  "/api/shareholders/auth": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Đăng nhập / đăng xuất cổ đông (public — không cần auth)",
  },
  "/api/shareholders/*": {
    allowedRoles: ["admin", "superadmin", "shareholder"],
    requiredPermissions: ["sh_messages:read"],
    requireAnyPermission: true,
    description: "API dành riêng cho cổ đông",
  },

  // ── API Tài Liệu ──────────────────────────────────────────────────────────
  "/api/documents/*": {
    allowedRoles: ["admin", "superadmin", "shareholder"],
    requiredPermissions: ["documents:read"],
    description: "Xem và tải xuống tài liệu nội bộ",
  },

  // ── Trang Công Khai ───────────────────────────────────────────────────────
  // Không cần xác thực — ai cũng truy cập được
  "/": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    requiredPermissions: ["public:access"],
    description: "Trang chủ công khai",
  },
  "/about/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Giới thiệu công ty",
  },
  "/contact/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Liên hệ",
  },
  "/insights/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Bài viết & tin tức",
  },

  // ── API Công Khai ────────────────────────────────────────────────────────
  "/api/contact/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    requiredPermissions: ["public:contact"],
    description: "Gửi form liên hệ",
  },
  "/api/blog/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Nội dung blog công khai",
  },
  "/api/chat/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Chat AI công khai",
  },

  // ── Xác Thực Người Dùng Công Khai ─────────────────────────────────────────
  "/api/auth/*": {
    allowedRoles: ["public", "shareholder", "admin", "superadmin"],
    description: "Đăng ký / đăng nhập public user",
  },
};

// ─── Các route không cần xác thực (luôn công khai) ───────────────────────────

/**
 * Danh sách prefix route không yêu cầu xác thực.
 * Middleware sẽ bỏ qua kiểm tra session cho các route này.
 */
export const PUBLIC_ROUTE_PREFIXES: string[] = [
  // Trang đăng nhập hệ thống
  "/admin-login",
  "/auth/admin-login",
  "/portals/shareholders/login",
  "/register", // Đăng ký public user
  "/login", // Đăng nhập public user

  // Nội dung công khai
  "/",
  "/about",
  "/contact",
  "/insights",
  "/compliance",
  "/governance",
  "/roadmap",
  "/documents",
  "/invest-with-axvn",
  "/our-approach",
  "/investment-focus",
  "/investment-disclaimer",
  "/privacy-policy",
  "/terms-of-use",
  "/portals/invest-with-axvn",

  // API không cần auth
  "/api/contact",
  "/api/blog",
  "/api/chat",
  "/api/content",
  "/api/seo",
  "/api/settings",
  "/api/health",
  "/api/csrf",
  "/api/opportunities",
  "/api/partner-application",
  "/api/investment-plans",
  "/api/whatsapp",
  "/api/auth", // Đăng ký / đăng nhập public user
  "/api/shareholders/auth", // Đăng nhập cổ đông
  "/api/enquiries", // Form liên hệ công khai
];

// ─── Hằng số route quan trọng ─────────────────────────────────────────────────

/** Route đăng nhập tương ứng với từng vai trò */
export const ROLE_LOGIN_PATHS: Record<AppRole, string> = {
  superadmin: "/admin-login",
  admin: "/admin-login",
  shareholder: "/portals/shareholders/login",
  public: "/login",
};

/** Route sau khi đăng nhập thành công theo từng vai trò */
export const ROLE_HOME_PATHS: Record<AppRole, string> = {
  superadmin: "/admin",
  admin: "/admin",
  shareholder: "/portals/shareholders/dashboard",
  public: "/",
};

/** Route trả về khi bị từ chối truy cập (403) */
export const ROLE_FORBIDDEN_PATHS: Record<AppRole, string> = {
  superadmin: "/admin",
  admin: "/admin",
  shareholder: "/portals/shareholders/dashboard",
  public: "/",
};
