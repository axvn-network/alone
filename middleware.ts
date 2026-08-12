import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Web Crypto API — Edge Runtime compatible (no Node.js crypto) ──
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

// ── Constants are inlined — middleware runs in Edge, cannot import from Node lib ──
const SESSION_COOKIE_NAME = "admin_session";
const SH_COOKIE_NAME = "sh_session";
const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

const PROTECTED_PREFIXES = ["/admin"] as const;
const PUBLIC_PATHS = [
  "/admin-login",
  "/admin-login/",
  "/auth/admin-login",
  "/auth/admin-login/",
] as const;

// Shareholder portal
const SH_PROTECTED_PREFIX = "/portals/shareholders/dashboard";
const SH_LOGIN_PATH = "/portals/shareholders/login";

// CSRF is enforced on mutating admin API routes — except public auth endpoints
const CSRF_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_API_PREFIX = "/api/admin";
// Public auth endpoints — no session exists yet, CSRF adds no protection
const CSRF_EXEMPT = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
  "/api/admin/mfa/login-verify",
]);

// ── Security response headers added to every response ─────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options":   "nosniff",
  "X-Frame-Options":          "SAMEORIGIN",
  "X-XSS-Protection":         "1; mode=block",
  "Referrer-Policy":          "strict-origin-when-cross-origin",
  "Permissions-Policy":       "camera=(), microphone=(), geolocation=()",
};

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-insecure-fallback-do-not-use-in-prod-ever";
}

function getCsrfSecret(): string {
  return (process.env.SESSION_SECRET || "dev-csrf-fallback-secret") + ":csrf";
}

// ── Helper functions ──────────────────────────────────────────────────────────
function constantEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Session verification ──────────────────────────────────────────────────────
async function verifySessionCookie(raw: string): Promise<boolean> {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return false;
  const encoded = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = await hmacSha256(getSessionSecret(), encoded);
  if (!constantEqual(provided, expected)) return false;

  // Decode payload to check expiry
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

// ── Shareholder session verification ─────────────────────────────────────────
async function verifyShareholderCookie(raw: string): Promise<boolean> {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = await hmacSha256(getSessionSecret(), payload);
  if (!constantEqual(provided, expected)) return false;

  try {
    // base64url → standard base64 for atob
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp || Date.now() / 1000 > exp) return false;
  } catch {
    return false;
  }
  return true;
}

// ── CSRF verification ─────────────────────────────────────────────────────────
async function verifyCsrfToken(cookieToken: string, headerToken: string): Promise<boolean> {
  if (!cookieToken || !headerToken) return false;
  if (!constantEqual(cookieToken, headerToken)) return false;

  // Validate token structure and signature
  const parts = cookieToken.split(".");
  if (parts.length !== 3) return false;
  const [rand, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() / 1000 > exp) return false;
  const expected = await hmacSha256(getCsrfSecret(), `${rand}.${expStr}`);  // Web Crypto — Edge compatible
  return constantEqual(sig, expected);
}


// ── Middleware ─────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const reqMethod = request.method;

  // ── 1. Admin page protection ───────────────────────────────────────────────
  // NOTE: /admin-login starts with /admin — must exclude it first
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
  const isProtected = !isPublic && PROTECTED_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie || !(await verifySessionCookie(sessionCookie))) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      applySecurityHeaders(res);
      return res;
    }
  }

  // ── 1b. Shareholder portal protection ─────────────────────────────────────
  if (pathname === SH_PROTECTED_PREFIX || pathname.startsWith(SH_PROTECTED_PREFIX + "/")) {
    const shCookie = request.cookies.get(SH_COOKIE_NAME)?.value;
    if (!shCookie || !(await verifyShareholderCookie(shCookie))) {
      const loginUrl = new URL(SH_LOGIN_PATH, request.url);
      const res = NextResponse.redirect(loginUrl);
      applySecurityHeaders(res);
      return res;
    }
  }

  // ── 2. CSRF protection for mutating admin API routes ──────────────────────
  if (
    pathname.startsWith(CSRF_API_PREFIX) &&
    CSRF_METHODS.has(reqMethod) &&
    !CSRF_EXEMPT.has(pathname)
  ) {
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value ?? "";
    const headerToken = request.headers.get(CSRF_HEADER) ?? "";

    if (!(await verifyCsrfToken(cookieToken, headerToken))) {
      const res = NextResponse.json(
        { success: false, message: "CSRF token invalid or missing" },
        { status: 403 }
      );
      applySecurityHeaders(res);
      return res;
    }
  }

  // ── 3. Add security headers to all responses ──────────────────────────────
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(res: NextResponse) {
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, val);
  }
}

export const config = {
  matcher: [
    // Admin UI pages — includes /admin exact and all sub-paths
    "/admin",
    "/admin/:path*",
    // Legacy /auth/admin-login alias — must be in matcher so PUBLIC_PATHS check runs
    "/auth/admin-login",
    // Shareholder portal
    "/portals/shareholders/dashboard",
    "/portals/shareholders/dashboard/:path*",
    // All API routes (for security headers + CSRF on admin mutations)
    "/api/:path*",
  ],
};
