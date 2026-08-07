import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac } from "crypto";

// ── Constants are inlined — middleware runs in Edge, cannot import from Node lib ──
const SESSION_COOKIE_NAME = "admin_session";
const SH_COOKIE_NAME = "sh_session";
const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

const PROTECTED_PREFIXES = ["/admin"] as const;
const PUBLIC_PATHS = ["/admin-login", "/admin-login/"] as const;

// Shareholder portal
const SH_PROTECTED_PREFIX = "/shareholders/dashboard";
const SH_LOGIN_PATH = "/shareholders/login";

// CSRF is enforced on all mutating admin API routes
const CSRF_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_API_PREFIX = "/api/admin";

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

// ── Session verification ──────────────────────────────────────────────────────
function hmac(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function constantEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function verifySessionCookie(raw: string): boolean {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return false;
  const encoded = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);
  const expected = hmac(getSessionSecret(), encoded);
  if (!constantEqual(provided, expected)) return false;

  // Decode payload to check expiry
  try {
    const json = Buffer.from(
      encoded.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString();
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp || Date.now() / 1000 > exp) return false;
  } catch {
    return false;
  }
  return true;
}

// ── CSRF verification ─────────────────────────────────────────────────────────
function verifyCsrfToken(cookieToken: string, headerToken: string): boolean {
  if (!cookieToken || !headerToken) return false;
  if (!constantEqual(cookieToken, headerToken)) return false;

  // Validate token structure and signature
  const parts = cookieToken.split(".");
  if (parts.length !== 3) return false;
  const [rand, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() / 1000 > exp) return false;
  const expected = hmac(getCsrfSecret(), `${rand}.${expStr}`);
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
    if (!sessionCookie || !verifySessionCookie(sessionCookie)) {
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
    if (!shCookie) {
      const loginUrl = new URL(SH_LOGIN_PATH, request.url);
      const res = NextResponse.redirect(loginUrl);
      applySecurityHeaders(res);
      return res;
    }
    // Token validity is verified server-side in the API routes;
    // here we just ensure the cookie is present to avoid redirect loops.
  }

  // ── 2. CSRF protection for mutating admin API routes ──────────────────────
  if (
    pathname.startsWith(CSRF_API_PREFIX) &&
    CSRF_METHODS.has(reqMethod)
  ) {
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value ?? "";
    const headerToken = request.headers.get(CSRF_HEADER) ?? "";

    if (!verifyCsrfToken(cookieToken, headerToken)) {
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
    // Shareholder portal
    "/shareholders/dashboard",
    "/shareholders/dashboard/:path*",
    // All API routes (for security headers + CSRF on admin mutations)
    "/api/:path*",
  ],
};
