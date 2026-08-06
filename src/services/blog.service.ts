import Blog from "@/models/Blog";
import type { BlogInput } from "@/validators";
import { NotFoundError } from "@/utils/errors";
import { connectDB } from "@/lib/db";

export async function getBlogs(options?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await connectDB();

  const { status, category, search, page = 1, limit = 10 } = options || {};
  const query: Record<string, unknown> = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Blog.countDocuments(query);
  const posts = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug }).lean();
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
  const post = await Blog.findOneAndUpdate({ slug }, { $set: data }, { new: true, runValidators: true }).lean();
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
    { $set: { status: "published", publishedAt: new Date().toISOString() } },
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
