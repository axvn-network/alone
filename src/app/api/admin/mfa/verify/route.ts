import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "@otplib/preset-default";
import { getCurrentUser } from "@/lib/auth-utils";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: NextRequest) {
  const userEmail = await getCurrentUser();
  if (!userEmail) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();

  await connectDB();
  const admin = await Admin.findOne({ email: userEmail }).select("+mfaSecret");
  if (!admin || !admin.mfaSecret) return NextResponse.json({ message: "MFA not set up" }, { status: 400 });

  const verified = authenticator.check(token, admin.mfaSecret);
  if (verified) {
    admin.mfaEnabled = true;
    await admin.save();
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }
}
