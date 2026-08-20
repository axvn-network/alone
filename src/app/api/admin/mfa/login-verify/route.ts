import { NextRequest, NextResponse } from "next/server";
import { verify } from "otplib";
import { connectDB } from "@/core/database";
import { AdminModel as Admin } from "@/modules/auth";
import { setSessionCookie } from "@/core/security/session";
import { rateLimit, clearRateLimit } from "@/utils/rate-limit";
import { successResponse, errorResponse } from "@/utils/api-response";

/**
 * POST /api/admin/mfa/login-verify
 *
 * Step-2 of admin MFA login. Verifies TOTP token for a given email.
 * Rate-limited: 5 attempts / 60s per IP to prevent TOTP brute-force.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rlKey = `mfa-verify:${ip}`;
  const limit = rateLimit(rlKey, 5, 60_000);
  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { success: false, message: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Reset": String(limit.resetAt),
        },
      },
    );
  }

  const { email, token } = await req.json();

  await connectDB();
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    "+mfaSecret",
  );
  if (!admin || !admin.mfaEnabled || !admin.mfaSecret)
    return errorResponse("Invalid request");

  const result = await verify({
    token,
    secret: admin.mfaSecret,
    strategy: "totp",
  });
  const verified = result.valid;
  if (verified) {
    clearRateLimit(rlKey); // reset on success
    await setSessionCookie(admin.email);
    return successResponse(null, "Login verified");
  } else {
    return errorResponse("Invalid token");
  }
}
