import { NextResponse } from "next/server";
import { authenticator } from "@otplib/preset-default";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth-utils";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const admin = await Admin.findOne({ email: user.email }).select("+mfaSecret");
  if (!admin) return NextResponse.json({ message: "Admin not found" }, { status: 404 });

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(admin.email, "GVI Tech Holding", secret);
  const qrCode = await QRCode.toDataURL(otpauth);

  admin.mfaSecret = secret;
  await admin.save();

  return NextResponse.json({ qrCode, secret });
}
