import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "@otplib/preset-default";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();

  await connectDB();
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+mfaSecret");
  if (!admin || !admin.mfaEnabled || !admin.mfaSecret) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  const verified = authenticator.check(token, admin.mfaSecret);
  if (verified) {
    await setSessionCookie(admin.email);
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }
}
