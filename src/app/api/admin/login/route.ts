import { NextResponse } from "next/server";
import { connectDB } from "@/core/database";
import { AdminModel as Admin } from "@/modules/auth";
import bcrypt from "bcryptjs";
import { setSessionCookie } from "@/core/security/session";
import { rateLimit, clearRateLimit } from "@/utils/rate-limit";
import { env } from "@/core/env";

const FALLBACK_PASSWORD = env.ADMIN_PASSWORD;

/**
 * POST /api/admin/login
 *
 * Security:
 *   - Rate-limited per IP: 5 attempts per minute, progressive lockout
 *   - Generic error message (no username/password enumeration)
 *   - Clears rate-limit key on successful login
 *   - Updates lastLogin timestamp in DB
 *   - Issues HMAC-signed session cookie on success
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateLimitKey = `admin-login:${ip}`;
  const limit = rateLimit(rateLimitKey, 5, 60_000);

  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Reset": String(limit.resetAt),
        },
      },
    );
  }

  // ── Generic bad-request guard ──────────────────────────────────────────────
  let username: string;
  let password: string;
  try {
    const body = await request.json();
    username = typeof body.username === "string" ? body.username.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "Credentials required" },
      { status: 400 },
    );
  }

  // ── MongoDB auth ───────────────────────────────────────────────────────────
  try {
    await connectDB();
    const admin = await Admin.findOne({
      $or: [{ email: username.toLowerCase() }, { name: username }],
    }).select("+password");

    if (admin) {
      const valid = await bcrypt.compare(password, admin.password);
      if (valid) {
        await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });
        await setSessionCookie(admin.email);
        clearRateLimit(rateLimitKey); // reset failed-attempt counter
        return NextResponse.json({ success: true });
      }
    }
  } catch {
    // DB unavailable — fall through to env fallback
  }

  // ── Env-based emergency fallback (DB unavailable) ────────────────────────
  // Uses ADMIN_EMAIL + ADMIN_PASSWORD from env — no separate ADMIN_USERNAME var needed.
  if (
    FALLBACK_PASSWORD.length >= 8 &&
    username === env.ADMIN_EMAIL &&
    password === FALLBACK_PASSWORD
  ) {
    await setSessionCookie(env.ADMIN_EMAIL);
    clearRateLimit(rateLimitKey);
    return NextResponse.json({ success: true });
  }

  // ── Generic failure — do not reveal whether user exists ───────────────────
  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 },
  );
}
