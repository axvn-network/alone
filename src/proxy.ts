/**
 * src/proxy.ts — Gatekeeper
 *
 * Entry point cho Next.js Edge Proxy (Next.js 16+ convention).
 * Logic thực thi được cô lập trong core/security/proxy.ts.
 *
 * LƯU Ý: `config` phải được định nghĩa trực tiếp tại đây (không được re-export)
 * vì Next.js cần parse tĩnh tại build time.
 */
export { proxy } from "@/core/security/proxy";

export const config = {
  matcher: [
    // Khu vực quản trị
    "/admin",
    "/admin/:path*",
    // Alias đăng nhập admin cũ
    "/auth/admin-login",
    // Cổng cổ đông
    "/portals/shareholders/dashboard",
    "/portals/shareholders/dashboard/:path*",
    // Tất cả API (CSRF + security headers)
    "/api/:path*",
  ],
};
