import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Page from "@/models/Page";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const page = await Page.findOne({ slug }).lean();
    if (!page) {
      return NextResponse.json({ success: false, data: null }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
