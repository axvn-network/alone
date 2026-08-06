import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { getCurrentUser } from "@/lib/auth-utils";

const DEFAULT_SETTINGS = {
  companyName: "Fortress Investment Holdings",
  logo: "/large-logo.png",
  favicon: "",
  email: "info@fortressih.com",
  phone: "+971 4 XXX XXXX",
  address: "Dubai, United Arab Emirates",
  whatsapp: "971500000000",
  googleMap: "",
  socialLinks: [
    { platform: "LinkedIn", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "Facebook", url: "#" },
    { platform: "X (Twitter)", url: "#" },
    { platform: "YouTube", url: "#" },
  ],
  googleAnalyticsId: "",
  metaPixelId: "",
  footer: "",
};

async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create(DEFAULT_SETTINGS);
      settings = created.toObject();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...data } = settings as Record<string, unknown>;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const data = await request.json();
    await Settings.findOneAndUpdate({}, { $set: data }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
