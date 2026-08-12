import { NextRequest } from "next/server";
import { authenticator } from "@otplib/preset-default";
import { getCurrentUser } from "@/lib/auth-utils";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  const { token } = await req.json();

  await connectDB();
  const admin = await Admin.findOne({ email: user.email }).select("+mfaSecret");
  if (!admin || !admin.mfaSecret) return errorResponse("MFA not set up");

  const verified = authenticator.check(token, admin.mfaSecret);
  if (verified) {
    admin.mfaEnabled = true;
    await admin.save();
    return successResponse(null, "MFA verified");
  } else {
    return errorResponse("Invalid token");
  }
}
