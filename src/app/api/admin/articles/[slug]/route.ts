import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getCurrentUser } from "@/lib/auth-utils";

async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { slug } = await params;
    const article = await Blog.findOne({ slug }).lean();
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      date: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      readTime: article.excerpt ? `${Math.max(1, Math.ceil(article.content.length / 2000))} min read` : "1 min read",
      featuredImage: article.featuredImage || "",
      status: article.status,
      seo: article.seo || { title: article.title, description: article.excerpt || "" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();
    const existing = await Blog.findOne({ slug }).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await Blog.findOneAndUpdate(
      { slug },
      {
        $set: {
          title: body.title ?? existing.title,
          excerpt: body.excerpt ?? existing.excerpt,
          content: body.content ?? existing.content,
          category: body.category ?? existing.category,
          featuredImage: body.featuredImage ?? existing.featuredImage,
          status: body.status ?? existing.status,
          seo: body.seo ?? existing.seo,
        },
      }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { slug } = await params;
    await Blog.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
