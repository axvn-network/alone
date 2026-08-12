import { NextRequest } from "next/server";
import { verify } from "otplib";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { setSessionCookie } from "@/lib/session";
import { successResponse, errorResponse } from "@/utils/api-response";

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();

  await connectDB();
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+mfaSecret");
  if (!admin || !admin.mfaEnabled || !admin.mfaSecret) return errorResponse("Invalid request");

  const result = await verify({ token, secret: admin.mfaSecret, strategy: "totp" });
  const verified = result.valid;
  if (verified) {
    await setSessionCookie(admin.email);
    return successResponse(null, "Login verified");
  } else {
    return errorResponse("Invalid token");
  }
}
