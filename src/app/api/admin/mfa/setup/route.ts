import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import { getCurrentUser } from "@/core/security/auth-utils";
import { connectDB } from "@/core/database";
import { AdminModel as Admin } from "@/modules/auth";
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/utils/api-response";

/**
 * GET /api/admin/mfa/setup
 *
 * Generate a new TOTP secret + QR code for the current admin.
 * The secret is saved immediately so that POST /mfa/verify can confirm it.
 * Once verified, mfaEnabled is set to true by POST /mfa/verify.
 *
 * Note: Calling GET again before verification overwrites the pending secret.
 * This is intentional — setup is idempotent until verified.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  await connectDB();
  const admin = await Admin.findOne({ email: user.email }).select("+mfaSecret");
  if (!admin) return notFoundResponse("Admin not found");

  // If MFA is already enabled, don't re-generate (user must disable first)
  if (admin.mfaEnabled) {
    return successResponse({ alreadyEnabled: true }, "MFA is already active");
  }

  const secret = generateSecret();
  const otpauth = await generateURI({
    secret,
    label: admin.email,
    issuer: "AXVN Tech Holding",
    strategy: "totp",
  });
  const qrCode = await QRCode.toDataURL(otpauth);

  admin.mfaSecret = secret; // pending — not active until verified via POST /mfa/verify
  await admin.save();

  // Return secret only during setup — never returned again after mfaEnabled = true
  return successResponse({ qrCode, secret });
}
