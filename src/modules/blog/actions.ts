"use server";

/**
 * src/modules/blog/actions.ts
 *
 * Server Actions cho blog/article.
 * Luồng: Client Form → actions.ts (RBAC) → service.ts → DB → revalidatePath()
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { blogSchema, type BlogInput } from "@/modules/blog/schema";
import { formatZodErrors } from "@/shared/utils/zod";
import * as blogService from "@/modules/blog";

export async function createBlogAction(data: BlogInput) {
  await requireAuth();

  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const post = await blogService.createBlog(parsed.data);
    revalidatePath("/admin/blog");
    return { success: true as const, data: JSON.parse(JSON.stringify(post)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function updateBlogAction(slug: string, data: Partial<BlogInput>) {
  await requireAuth();

  const parsed = blogSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const post = await blogService.updateBlog(slug, parsed.data);
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${slug}`);
    revalidatePath(`/content/insights/${slug}`);
    return { success: true as const, data: JSON.parse(JSON.stringify(post)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function deleteBlogAction(slug: string) {
  await requireAuth();

  try {
    await blogService.deleteBlog(slug);
    revalidatePath("/admin/blog");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function publishBlogAction(slug: string) {
  await requireAuth();

  try {
    const post = await blogService.publishBlog(slug);
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${slug}`);
    revalidatePath(`/content/insights/${slug}`);
    revalidatePath("/content/insights");
    return { success: true as const, data: JSON.parse(JSON.stringify(post)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function unpublishBlogAction(slug: string) {
  await requireAuth();

  try {
    const post = await blogService.unpublishBlog(slug);
    revalidatePath("/admin/blog");
    revalidatePath(`/content/insights/${slug}`);
    return { success: true as const, data: JSON.parse(JSON.stringify(post)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
