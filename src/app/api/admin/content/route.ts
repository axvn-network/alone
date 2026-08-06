import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Page from "@/models/Page";
import { getCurrentUser } from "@/lib/auth-utils";

const DEFAULT_PAGES = [
  "home", "about", "investment-focus", "our-approach",
  "partner-with-us", "contact", "privacy-policy",
  "terms-of-use", "investment-disclaimer",
];

async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      let page = await Page.findOne({ slug }).lean();
      if (!page) {
        page = await Page.create({ slug, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) });
        page = page.toObject();
      }
      return NextResponse.json(page);
    }

    const pages = await Page.find().sort({ slug: 1 }).lean();
    const result = DEFAULT_PAGES.map((s) => {
      const existing = pages.find((p) => p.slug === s);
      return existing || { slug: s, title: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { slug, title, content } = await request.json();
    if (!slug || title === undefined || content === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await Page.findOneAndUpdate(
      { slug },
      { $set: { title, content, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
