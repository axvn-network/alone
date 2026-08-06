"use server";

import { blogService } from "@/services";
import { blogSchema, formatZodErrors } from "@/validators";
import type { BlogInput } from "@/validators";

export async function createBlogAction(data: BlogInput) {
  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: formatZodErrors(parsed.error) };
  }

  try {
    const post = await blogService.createBlog(parsed.data);
    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch {
    return { success: false, message: "Failed to create blog post" };
  }
}

export async function updateBlogAction(slug: string, data: Partial<BlogInput>) {
  const parsed = blogSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: formatZodErrors(parsed.error) };
  }

  try {
    const post = await blogService.updateBlog(slug, parsed.data);
    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch {
    return { success: false, message: "Failed to update blog post" };
  }
}

export async function deleteBlogAction(slug: string) {
  try {
    await blogService.deleteBlog(slug);
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete blog post" };
  }
}

export async function publishBlogAction(slug: string) {
  try {
    const post = await blogService.publishBlog(slug);
    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch {
    return { success: false, message: "Failed to publish blog post" };
  }
}
