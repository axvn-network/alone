/**
 * proxy.ts
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HỆ THỐNG PHÂN QUYỀN 3 LỚP — EDGE RUNTIME (Web Crypto API)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Lớp 1 — Admin Guard:
 *   • /admin, /admin/* → Yêu cầu session admin hợp lệ
 *   • /api/admin/*     → Yêu cầu session admin + CSRF trên mutating methods
 *   • Redirect về /admin-login nếu thiếu hoặc hết hạn session
 *
 * Lớp 2 — Shareholder Guard:
 *   • /portals/shareholders/dashboard/* → Yêu cầu session cổ đông hợp lệ
 *   • Redirect về /portals/shareholders/login nếu không có session
 *
 * Lớp 3 — Public User Guard:
 *   • Trang công khai: không cần xác thực
 *   • /api/auth/*: không cần session (đăng ký / đăng nhập)
 *
 * CSRF:
 *   • Áp dụng cho POST/PUT/PATCH/DELETE trên /api/admin/* (trừ auth endpoints)
 *   • Dùng HMAC-SHA256 double-submit cookie pattern
 *
 * Security Headers:
 *   • Gắn vào tất cả response (X-Content-Type-Options, X-Frame-Options, v.v.)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LƯU Ý EDGE RUNTIME: Không import module Node.js (crypto, fs, etc.)
 * Chỉ dùng Web Crypto API (crypto.subtle) — tương thích Vercel Edge / CF Workers
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Web Crypto API — Edge Runtime compatible ─────────────────────────────────

async function hmacSha256(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Hằng số — inline vì Edge Runtime không import từ Node module ────────────

/** Cookie session Admin */
const SESSION_COOKIE_NAME = "admin_session";

/** Cookie session Cổ Đông */
const SH_COOKIE_NAME = "sh_session";

/** Cookie CSRF */
const CSRF_COOKIE = "csrf_token";

/** Header CSRF */
const CSRF_HEADER = "x-csrf-token";

// ─── Bản đồ route theo vai trò ────────────────────────────────────────────────

/**
 * Prefix yêu cầu session Admin.
 * Lưu ý: /admin-login bắt đầu bằng /admin → phải loại trừ trước.
 */
const ADMIN_PROTECTED_PREFIXES = ["/admin"] as const;

/**
 * Các route admin được miễn kiểm tra session (trang đăng nhập).
 */
const ADMIN_PUBLIC_PATHS = [
  "/admin-login",
  "/admin-login/",
  "/auth/admin-login",
  "/auth/admin-login/",
] as const;

/**
 * Prefix yêu cầu session Cổ Đông.
 */
const SH_PROTECTED_PREFIX = "/portals/shareholders/dashboard";

/**
 * Trang đăng nhập Cổ Đông — miễn kiểm tra session.
 */
const SH_LOGIN_PATH = "/portals/shareholders/login";

/**
 * Prefix các route API cần CSRF protection.
 */
const CSRF_API_PREFIX = "/api/admin";

/**
 * HTTP methods kích hoạt kiểm tra CSRF (mutating operations).
 */
const CSRF_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Endpoint admin không cần CSRF (chưa có session khi gọi).
 */
const CSRF_EXEMPT = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
  "/api/admin/mfa/login-verify",
]);

// ─── Security Headers gắn vào tất cả response ─────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  /** Ngăn MIME sniffing */
  "X-Content-Type-Options": "nosniff",
  /** Ngăn Clickjacking — chỉ cho phép frame từ cùng origin */
  "X-Frame-Options": "SAMEORIGIN",
  /** Bật XSS filter trình duyệt cũ */
  "X-XSS-Protection": "1; mode=block",
  /** Giới hạn thông tin Referrer gửi đi */
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /** Tắt các API trình duyệt nhạy cảm */
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// ─── Helper: lấy secret từ biến môi trường ───────────────────────────────────

function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    "dev-only-insecure-fallback-do-not-use-in-prod-ever"
  );
}

function getCsrfSecret(): string {
  return (process.env.SESSION_SECRET || "dev-csrf-fallback-secret") + ":csrf";
}

// ─── So sánh constant-time (chống timing attack) ─────────────────────────────

function constantEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─── Xác minh session cookie ──────────────────────────────────────────────────

/**
 * Xác minh session cookie Admin.
 * Kiểm tra chữ ký HMAC + thời hạn exp.
 */
async function verifySessionCookie(raw: string): Promise<boolean> {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return false;
  const encoded = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = await hmacSha256(getSessionSecret(), encoded);
  if (!constantEqual(provided, expected)) return false;

  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp || Date.now() / 1000 > exp) return false;
  } catch {
    return false;
  }
  return true;
}

/**
 * Xác minh session cookie Cổ Đông.
 * Cùng thuật toán với Admin — namespace khác.
 */
async function verifyShareholderCookie(raw: string): Promise<boolean> {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = await hmacSha256(getSessionSecret(), payload);
  if (!constantEqual(provided, expected)) return false;

  try {
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp || Date.now() / 1000 > exp) return false;
  } catch {
    return false;
  }
  return true;
}

// ─── Xác minh CSRF token ──────────────────────────────────────────────────────

/**
 * Xác minh CSRF token theo double-submit cookie pattern.
 * Token cấu trúc: `<random>.<expTimestamp>.<hmacSignature>`
 */
async function verifyCsrfToken(
  cookieToken: string,
  headerToken: string
): Promise<boolean> {
  if (!cookieToken || !headerToken) return false;
  // Cookie và header phải khớp nhau
  if (!constantEqual(cookieToken, headerToken)) return false;

  const parts = cookieToken.split(".");
  if (parts.length !== 3) return false;
  const [rand, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() / 1000 > exp) return false;

  const expected = await hmacSha256(getCsrfSecret(), `${rand}.${expStr}`);
  return constantEqual(sig, expected);
}

// ─── Thêm security headers ────────────────────────────────────────────────────

function applySecurityHeaders(res: NextResponse): void {
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, val);
  }
}

// ─── Middleware chính ─────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const reqMethod = request.method;

  // ════════════════════════════════════════════════════════════════════════
  // LỚP 1: Bảo vệ khu vực Admin
  // ════════════════════════════════════════════════════════════════════════
  // Loại trừ /admin-login (bắt đầu bằng /admin nhưng là trang public)
  const isAdminPublic = ADMIN_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  const isAdminProtected =
    !isAdminPublic &&
    ADMIN_PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );

  if (isAdminProtected) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    // Không có session hoặc session không hợp lệ → redirect về đăng nhập
    if (!sessionCookie || !(await verifySessionCookie(sessionCookie))) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      applySecurityHeaders(res);
      return res;
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // LỚP 2: Bảo vệ cổng Cổ Đông
  // ════════════════════════════════════════════════════════════════════════
  const isShProtected =
    pathname === SH_PROTECTED_PREFIX ||
    pathname.startsWith(SH_PROTECTED_PREFIX + "/");

  if (isShProtected) {
    const shCookie = request.cookies.get(SH_COOKIE_NAME)?.value;

    // Thử session cổ đông trước
    if (shCookie && (await verifyShareholderCookie(shCookie))) {
      // Cổ đông hợp lệ — cho qua
    } else {
      // Fallback: kiểm tra session admin (admin có thể xem cổng cổ đông)
      const adminCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (!adminCookie || !(await verifySessionCookie(adminCookie))) {
        // Không có session hợp lệ nào → redirect về đăng nhập cổ đông
        const loginUrl = new URL(SH_LOGIN_PATH, request.url);
        const res = NextResponse.redirect(loginUrl);
        applySecurityHeaders(res);
        return res;
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // LỚP 2b: Bảo vệ API Cổ Đông (trừ /api/shareholders/auth)
  // ════════════════════════════════════════════════════════════════════════
  const isShAPI =
    pathname.startsWith("/api/shareholders/") &&
    !pathname.startsWith("/api/shareholders/auth");

  if (isShAPI && CSRF_METHODS.has(reqMethod)) {
    const shCookie = request.cookies.get(SH_COOKIE_NAME)?.value;
    const adminCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    const validSh = shCookie && (await verifyShareholderCookie(shCookie));
    const validAdmin = adminCookie && (await verifySessionCookie(adminCookie));

    if (!validSh && !validAdmin) {
      const res = NextResponse.json(
        { success: false, message: "Bạn cần đăng nhập với tư cách cổ đông để thực hiện thao tác này." },
        { status: 401 }
      );
      applySecurityHeaders(res);
      return res;
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // LỚP 3: CSRF Protection cho API Admin (mutating operations)
  // ════════════════════════════════════════════════════════════════════════
  if (
    pathname.startsWith(CSRF_API_PREFIX) &&
    CSRF_METHODS.has(reqMethod) &&
    !CSRF_EXEMPT.has(pathname)
  ) {
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value ?? "";
    const headerToken = request.headers.get(CSRF_HEADER) ?? "";

    if (!(await verifyCsrfToken(cookieToken, headerToken))) {
      const res = NextResponse.json(
        { success: false, message: "CSRF token không hợp lệ hoặc đã hết hạn." },
        { status: 403 }
      );
      applySecurityHeaders(res);
      return res;
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // Thêm security headers vào tất cả response còn lại
  // ════════════════════════════════════════════════════════════════════════
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

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
