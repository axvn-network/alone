import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getCurrentUser } from "@/lib/auth-utils";

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
      const article = await Blog.findOne({ slug }).lean();
      if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags || [],
        date: article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
          : new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        readTime: article.excerpt ? `${Math.max(1, Math.ceil(article.content.length / 2000))} min read` : "1 min read",
        featuredImage: article.featuredImage || "",
        status: article.status,
        updatedAt: article.updatedAt || article.createdAt,
        seo: article.seo || { title: article.title, description: article.excerpt || "" },
      });
    }

    const articles = await Blog.find({}, { content: 0, seo: 0 })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json(
      articles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        tags: a.tags || [],
        featuredImage: a.featuredImage || "",
        status: a.status,
        updatedAt: a.updatedAt || a.createdAt,
      }))
    );
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await Blog.findOneAndUpdate(
      { slug: body.slug },
      {
        $set: {
          title: body.title,
          excerpt: body.excerpt || "",
          content: body.content || "",
          category: body.category || "Market Insights",
          tags: body.tags || [],
          featuredImage: body.featuredImage || "",
          status: body.status || "draft",
          seo: body.seo || { title: body.title, description: body.excerpt || "" },
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const body = await request.json();
    if (!body.slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const existing = await Blog.findOne({ slug: body.slug }).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await Blog.findOneAndUpdate(
      { slug: body.slug },
      {
        $set: {
          title: body.title ?? existing.title,
          excerpt: body.excerpt ?? existing.excerpt,
          content: body.content ?? existing.content,
          category: body.category ?? existing.category,
          tags: body.tags ?? existing.tags,
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

export async function DELETE(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await Blog.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
