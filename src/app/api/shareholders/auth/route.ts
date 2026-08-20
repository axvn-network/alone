import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/database";
import { ShareholderModel as Shareholder } from "@/modules/shareholders";
import { successResponse, serverErrorResponse, notFoundResponse, unauthorizedResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";
import { cookies } from "next/headers";
import { makeShareholderToken, parseShareholderToken, SH_COOKIE } from "@/modules/auth/sh-session";
import { rateLimit, clearRateLimit } from "@/utils/rate-limit";
import { logger } from "@/shared/utils/logger";

// POST /api/shareholders/auth — login
export async function POST(req: NextRequest) {
  // ── Rate limiting per IP: 5 attempts / 60s, progressive lockout ─────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateLimitKey = `sh-login:${ip}`;
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

  try {
    await connectDB();
    const { email, password } = await req.json() as { email: string; password: string };
    if (!email || !password) return unauthorizedResponse();

    const sh = await Shareholder.findOne({ email: email.toLowerCase(), status: "active" }).select("+password");
    if (!sh) return unauthorizedResponse();

    const ok = await sh.comparePassword(password);
    if (!ok) return unauthorizedResponse();

    await Shareholder.findByIdAndUpdate(sh._id, { lastLogin: new Date() });

    const token = makeShareholderToken(sh._id.toString(), sh.email);
    const cookieStore = await cookies();
    cookieStore.set(SH_COOKIE, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/", maxAge: 8 * 60 * 60,
    });

    // Clear rate-limit on successful login
    clearRateLimit(rateLimitKey);
    logger.info("[sh/login] Login success", { email: sh.email, ip });

    return successResponse({
      id: sh._id.toString(), name: sh.name, email: sh.email,
      role: sh.role, equityPercent: sh.equityPercent,
      capitalCommitted: sh.capitalCommitted, capitalPaid: sh.capitalPaid,
      kycStatus: sh.kycStatus ?? "not_started",
    });
  } catch (e) {
    logger.error("[sh/login] Unexpected error", e);
    return serverErrorResponse(handleError(e).message);
  }
}

// DELETE /api/shareholders/auth — logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0, expires: new Date(0) });
  return successResponse({ ok: true });
}

// GET /api/shareholders/auth — get current session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SH_COOKIE)?.value;
    if (!raw) return notFoundResponse("No session");
    const parsed = parseShareholderToken(raw);
    if (!parsed) return notFoundResponse("Invalid session");

    await connectDB();
    const sh = await Shareholder.findById(parsed.id).lean();
    if (!sh || sh.status !== "active") return unauthorizedResponse();

    return successResponse({
      id: sh._id.toString(), name: sh.name, email: sh.email,
      role: sh.role, equityPercent: sh.equityPercent,
      capitalCommitted: sh.capitalCommitted, capitalPaid: sh.capitalPaid,
      kycStatus: sh.kycStatus ?? "not_started",
    });
  } catch (e) {
    return serverErrorResponse(handleError(e).message);
  }
}
