import Blog from "./model";
import type { BlogInput } from "@/modules/blog/schema";
import type { AdminArticleItem } from "@/types";
import { NotFoundError } from "@/utils/errors";
import { connectDB } from "@/core/database";
import { buildSearchFilter } from "@/utils/search";

// ─── Public / paginated list ───────────────────────────────────────────────────

export async function getBlogs(options?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await connectDB();

  const { status, category, search, page = 1, limit = 10 } = options || {};
  const query: Record<string, unknown> = {
    ...(status   ? { status }   : {}),
    ...(category ? { category } : {}),
    ...buildSearchFilter(search, ["title", "excerpt"]),
  };

  const [total, posts] = await Promise.all([
    Blog.countDocuments(query),
    Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * List view for admin blog management — strips content/seo to keep
 * payload small when rendering the card grid.
 */
export async function listForAdmin(options?: {
  status?: "draft" | "published";
  category?: string;
  search?: string;
}): Promise<AdminArticleItem[]> {
  await connectDB();

  const query: Record<string, unknown> = {
    ...(options?.status   ? { status:   options.status }   : {}),
    ...(options?.category ? { category: options.category } : {}),
    ...buildSearchFilter(options?.search, ["title", "excerpt"]),
  };

  const docs = await Blog.find(query, {
    slug: 1, title: 1, excerpt: 1, category: 1, readTime: 1, tags: 1,
    featuredImage: 1, status: 1, updatedAt: 1, createdAt: 1,
  })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return docs.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || "",
    category: a.category || "General",
    readTime: (a as Record<string, unknown>).readTime as string || "5 min read",
    tags: a.tags || [],
    featuredImage: a.featuredImage || "",
    status: a.status,
    updatedAt: ((a.updatedAt || a.createdAt) as Date).toISOString(),
  }));
}

// ─── Single article ───────────────────────────────────────────────────────────

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug }).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

/** Public endpoint — only returns published posts */
export async function getPublicBySlug(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug, status: "published" }).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function createBlog(data: BlogInput) {
  await connectDB();
  const post = await Blog.create(data);
  return post.toObject();
}

export async function updateBlog(slug: string, data: Partial<BlogInput>) {
  await connectDB();
  const post = await Blog.findOneAndUpdate(
    { slug },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function deleteBlog(slug: string) {
  await connectDB();
  const post = await Blog.findOneAndDelete({ slug }).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function publishBlog(slug: string) {
  await connectDB();
  const post = await Blog.findOneAndUpdate(
    { slug },
    { $set: { status: "published", publishedAt: new Date() } },
    { new: true }
  ).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function unpublishBlog(slug: string) {
  await connectDB();
  const post = await Blog.findOneAndUpdate(
    { slug },
    { $set: { status: "draft", publishedAt: null } },
    { new: true }
  ).lean();
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function getBlogCategories() {
  await connectDB();
  return Blog.distinct("category");
}

/** Related posts — same category, excluding current slug, max 3 */
export async function getRelated(slug: string, category: string, limit = 3) {
  await connectDB();
  return Blog.find(
    { status: "published", category, slug: { $ne: slug } },
    { slug: 1, title: 1, excerpt: 1, featuredImage: 1, createdAt: 1 }
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
