import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth-utils";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/utils/api-response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  await connectDB();
  const admin = await Admin.findOne({ email: user.email }).select("+mfaSecret");
  if (!admin) return notFoundResponse("Admin not found");

  const secret = generateSecret();
  const otpauth = await generateURI({ secret, label: admin.email, issuer: "GVI Tech Holding", strategy: "totp" });
  const qrCode = await QRCode.toDataURL(otpauth);

  admin.mfaSecret = secret;
  await admin.save();

  return successResponse({ qrCode, secret });
}
