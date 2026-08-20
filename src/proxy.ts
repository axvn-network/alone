/**
 * src/proxy.ts — Next.js 16+ Edge Proxy (replaces middleware.ts)
 *
 * Entry point for the Next.js Edge proxy layer.
 * All logic is isolated in core/security/proxy.ts — this file only
 * wires the export and the static `config` matcher.
 *
 * NOTE: `config` must be defined directly here (not re-exported) because
 * Next.js parses it statically at build time.
 *
 * Export name must be `proxy` (Next.js 16 / Turbopack requirement).
 */
export { proxy } from "@/core/security/proxy";

export const config = {
  matcher: [
    // Admin area
    "/admin",
    "/admin/:path*",
    // Legacy admin-login alias
    "/auth/admin-login",
    // Shareholder portal
    "/portals/shareholders/dashboard",
    "/portals/shareholders/dashboard/:path*",
    // All API routes (CSRF + security headers)
    "/api/:path*",
  ],
};
