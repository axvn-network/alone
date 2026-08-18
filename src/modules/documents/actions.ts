"use server";

/**
 * src/modules/documents/actions.ts
 * Server Actions — Documents / Tài liệu quản trị
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { documentSchema, formatZodErrors } from "@/validators";
import type { DocumentInput } from "@/validators";
import { documentService } from "./service";

export async function createDocumentAction(data: DocumentInput) {
  await requireAuth();

  const parsed = documentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const doc = await documentService.create(parsed.data);
    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function updateDocumentAction(id: string, data: Partial<DocumentInput>) {
  await requireAuth();

  const parsed = documentSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const doc = await documentService.update(id, parsed.data);
    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function deleteDocumentAction(id: string) {
  await requireAuth();
  try {
    await documentService.delete(id);
    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
