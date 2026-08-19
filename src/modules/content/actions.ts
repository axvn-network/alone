"use server";

/**
 * src/modules/content/actions.ts
 * Server Actions — Page Content (Visual Editor)
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { pageContentSchema, type PageContentInput } from "@/modules/content/schema";
import { formatZodErrors } from "@/shared/utils/zod";
import { updatePage } from "./service";

export async function updatePageAction(slug: string, data: PageContentInput) {
  await requireAuth();
  const parsed = pageContentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }
  try {
    const doc = await updatePage(slug, parsed.data);
    revalidatePath(`/content/${slug}`);
    revalidatePath("/admin/content");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
