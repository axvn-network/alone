import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { getCurrentUser } from "@/lib/auth-utils";

async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { id } = await params;
    const result = await Enquiry.findByIdAndUpdate(id, { $set: { status: "read" } });
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { id } = await params;
    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
