/**
 * src/lib/rbac/guards.ts
 *
 * Guard hàm dùng trong Server Component, Server Action, và Route Handler.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TẤT CẢ các hàm này chạy trên SERVER (Node.js) — KHÔNG dùng ở client  │
 * │  Chúng có thể gọi DB, cookies(), redirect(), và nextHeaders()          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Cách sử dụng:
 *
 *   // Trong Server Component / Server Action:
 *   const user = await requireAdminGuard();
 *   const user = await requireShareholderGuard();
 *   const user = await requirePermissionGuard("documents:manage");
 *
 *   // Trong Route Handler (không redirect, trả về JSON lỗi):
 *   const result = await checkAdminAPI();
 *   if (!result.user) return result.response!;
 *
 *   // Lấy user hiện tại từ bất kỳ nguồn nào (admin/shareholder/public):
 *   const user = await resolveCurrentUser();
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import Shareholder from "@/models/Shareholder";
import { getSessionEmail } from "@/lib/session";
import { parseShareholderToken, SH_COOKIE } from "@/lib/sh-session";
import {
  forbiddenResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import type { AppRole, AuthenticatedUser, Permission } from "./types";
import { canAccess, hasAllPermissions, hasAnyPermission, isAdmin } from "./utils";

// ─── Resolver người dùng hiện tại ─────────────────────────────────────────────

/**
 * Phân giải người dùng hiện tại từ session cookie.
 * Thử theo thứ tự: admin session → shareholder session → null.
 *
 * @returns AuthenticatedUser nếu có session hợp lệ, null nếu không
 */
export async function resolveCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    await connectDB();

    // ── Thử session Admin ─────────────────────────────────────────────────
    const adminEmail = await getSessionEmail();
    if (adminEmail) {
      const admin = await Admin.findOne({ email: adminEmail }).lean();
      if (admin) {
        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role as AppRole,
          source: "admin",
        };
      }
    }

    // ── Thử session Cổ Đông ───────────────────────────────────────────────
    const cookieStore = await cookies();
    const shRaw = cookieStore.get(SH_COOKIE)?.value;
    if (shRaw) {
      const parsed = parseShareholderToken(shRaw);
      if (parsed) {
        const sh = await Shareholder.findById(parsed.id).lean();
        if (sh && sh.status === "active") {
          return {
            id: sh._id.toString(),
            name: sh.name,
            email: sh.email,
            role: "shareholder",
            source: "shareholder",
          };
        }
      }
    }

    // ── Thử session Public User ───────────────────────────────────────────
    const publicSession = await resolvePublicUserFromCookie();
    if (publicSession) return publicSession;

    return null;
  } catch {
    return null;
  }
}

/**
 * Phân giải Public User từ cookie `pub_session`.
 * Trả về null nếu không có session hoặc session không hợp lệ.
 */
async function resolvePublicUserFromCookie(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("pub_session")?.value;
    if (!raw) return null;

    // Import động để tránh vòng tròn
    const { parsePublicUserToken } = await import("@/lib/rbac/public-session");
    const parsed = parsePublicUserToken(raw);
    if (!parsed) return null;

    // Lấy thông tin từ DB
    const PublicUser = (await import("@/models/PublicUser")).default;
    const u = await PublicUser.findById(parsed.id).lean();
    if (!u || !u.isActive) return null;

    return {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: "public",
      source: "public",
    };
  } catch {
    return null;
  }
}

// ─── Guard dùng trong Server Component / Server Action ────────────────────────

/**
 * Yêu cầu người dùng là Admin (admin hoặc superadmin).
 * Nếu chưa xác thực hoặc không đủ quyền → redirect đến /admin-login.
 *
 * @example
 *   // Trong Server Component:
 *   export default async function AdminPage() {
 *     const user = await requireAdminGuard();
 *     // user được đảm bảo là admin/superadmin
 *   }
 */
export async function requireAdminGuard(): Promise<AuthenticatedUser> {
  const user = await resolveCurrentUser();

  if (!user) {
    redirect("/admin-login");
  }

  if (!isAdmin(user)) {
    redirect("/admin-login");
  }

  return user;
}

/**
 * Yêu cầu người dùng là Siêu Quản Trị.
 * Nếu không đủ quyền → redirect đến /admin (không ra ngoài hệ thống admin).
 *
 * @example
 *   const user = await requireSuperAdminGuard();
 */
export async function requireSuperAdminGuard(): Promise<AuthenticatedUser> {
  const user = await resolveCurrentUser();

  if (!user || user.role !== "superadmin") {
    // Admin thường bị redirect về dashboard, không bị đăng xuất
    if (user && isAdmin(user)) {
      redirect("/admin");
    }
    redirect("/admin-login");
  }

  return user;
}

/**
 * Yêu cầu người dùng là Cổ Đông (hoặc Admin có quyền cao hơn).
 * Nếu chưa xác thực → redirect đến trang đăng nhập cổ đông.
 *
 * @example
 *   const user = await requireShareholderGuard();
 */
export async function requireShareholderGuard(): Promise<AuthenticatedUser> {
  const user = await resolveCurrentUser();

  if (!user) {
    redirect("/portals/shareholders/login");
  }

  // Admin cũng có thể truy cập cổng cổ đông
  const allowed = canAccess(user, ["shareholder", "admin", "superadmin"]);
  if (!allowed.allowed) {
    redirect("/portals/shareholders/login");
  }

  return user;
}

/**
 * Yêu cầu người dùng đã xác thực (bất kỳ vai trò nào trừ guest).
 * Nếu chưa đăng nhập → redirect đến /login.
 *
 * @example
 *   const user = await requireAuthGuard();
 */
export async function requireAuthGuard(): Promise<AuthenticatedUser> {
  const user = await resolveCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Yêu cầu người dùng có ít nhất một quyền hạn cụ thể.
 * Nếu không có quyền → redirect theo vai trò hiện tại.
 *
 * @param permissions     - Danh sách quyền cần có
 * @param requireAll      - true = cần TẤT CẢ (AND), false = cần ÍT NHẤT MỘT (OR)
 * @param redirectPath    - URL redirect khi không có quyền (tùy chọn)
 *
 * @example
 *   // Yêu cầu quyền xuất bản nội dung
 *   const user = await requirePermissionGuard(["content:publish"]);
 *
 *   // Yêu cầu ít nhất 1 trong 2 quyền báo cáo
 *   const user = await requirePermissionGuard(["reports:read", "reports:read_all"], false);
 */
export async function requirePermissionGuard(
  permissions: Permission[],
  requireAll = true,
  redirectPath?: string
): Promise<AuthenticatedUser> {
  const user = await resolveCurrentUser();

  if (!user) {
    redirect(redirectPath ?? "/login");
  }

  const hasPerms = requireAll
    ? hasAllPermissions(user, permissions)
    : hasAnyPermission(user, permissions);

  if (!hasPerms) {
    // Điều hướng về trang phù hợp với vai trò
    const fallback = getFallbackPath(user.role);
    redirect(redirectPath ?? fallback);
  }

  return user;
}

/**
 * Lấy đường dẫn fallback khi bị từ chối truy cập theo vai trò.
 */
function getFallbackPath(role: AppRole): string {
  const paths: Record<AppRole, string> = {
    superadmin: "/admin",
    admin: "/admin",
    shareholder: "/portals/shareholders/dashboard",
    public: "/",
  };
  return paths[role] ?? "/";
}

// ─── Guard cho Route Handler (không redirect — trả JSON) ──────────────────────

/**
 * Kết quả kiểm tra quyền trong Route Handler.
 * Nếu `user` là null → dùng `response` để trả về lỗi.
 */
export interface APIGuardResult {
  user: AuthenticatedUser | null;
  response: ReturnType<typeof unauthorizedResponse | typeof forbiddenResponse> | null;
}

/**
 * Kiểm tra quyền Admin trong Route Handler.
 * Trả về `{ user, response: null }` nếu hợp lệ,
 * hoặc `{ user: null, response: <JSON lỗi> }` nếu không có quyền.
 *
 * @example
 *   export async function GET() {
 *     const { user, response } = await checkAdminAPI();
 *     if (!user) return response!;
 *     // tiếp tục xử lý...
 *   }
 */
export async function checkAdminAPI(): Promise<APIGuardResult> {
  const user = await resolveCurrentUser();

  if (!user) {
    return { user: null, response: unauthorizedResponse("Bạn cần đăng nhập để truy cập.") };
  }

  if (!isAdmin(user)) {
    return { user: null, response: forbiddenResponse("Khu vực này chỉ dành cho Quản Trị Viên.") };
  }

  return { user, response: null };
}

/**
 * Kiểm tra quyền Siêu Quản Trị trong Route Handler.
 *
 * @example
 *   const { user, response } = await checkSuperAdminAPI();
 *   if (!user) return response!;
 */
export async function checkSuperAdminAPI(): Promise<APIGuardResult> {
  const user = await resolveCurrentUser();

  if (!user) {
    return { user: null, response: unauthorizedResponse("Bạn cần đăng nhập.") };
  }

  if (user.role !== "superadmin") {
    return { user: null, response: forbiddenResponse("Chỉ Siêu Quản Trị Viên mới có quyền thực hiện thao tác này.") };
  }

  return { user, response: null };
}

/**
 * Kiểm tra quyền Cổ Đông trong Route Handler.
 *
 * @example
 *   const { user, response } = await checkShareholderAPI();
 *   if (!user) return response!;
 */
export async function checkShareholderAPI(): Promise<APIGuardResult> {
  const user = await resolveCurrentUser();

  if (!user) {
    return { user: null, response: unauthorizedResponse("Bạn cần đăng nhập với tài khoản cổ đông.") };
  }

  const allowed = canAccess(user, ["shareholder", "admin", "superadmin"]);
  if (!allowed.allowed) {
    return { user: null, response: forbiddenResponse(allowed.reason ?? "Không có quyền truy cập.") };
  }

  return { user, response: null };
}

/**
 * Kiểm tra quyền hạn cụ thể trong Route Handler.
 *
 * @param permissions - Danh sách quyền cần có
 * @param requireAll  - true = AND, false = OR
 *
 * @example
 *   const { user, response } = await checkPermissionAPI(["documents:manage"]);
 *   if (!user) return response!;
 */
export async function checkPermissionAPI(
  permissions: Permission[],
  requireAll = true
): Promise<APIGuardResult> {
  const user = await resolveCurrentUser();

  if (!user) {
    return { user: null, response: unauthorizedResponse("Bạn cần đăng nhập.") };
  }

  const hasPerms = requireAll
    ? hasAllPermissions(user, permissions)
    : hasAnyPermission(user, permissions);

  if (!hasPerms) {
    return {
      user: null,
      response: forbiddenResponse("Tài khoản không có đủ quyền hạn để thực hiện thao tác này."),
    };
  }

  return { user, response: null };
}

// Xuất kiểu NextResponse để dùng ở nơi khác nếu cần
export type { NextResponse };
