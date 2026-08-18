"use server";

/**
 * src/modules/shareholders/actions.ts
 * Server Actions for Shareholder CRUD — auth-gated, validated, cache-revalidating.
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { shareholderSchema, formatZodErrors } from "@/validators";
import type { ShareholderInput } from "@/validators";
import * as shareholderService from "@/modules/shareholders";

export async function createShareholderAction(data: ShareholderInput) {
  await requireAuth();

  const parsed = shareholderSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const doc = await shareholderService.create(parsed.data);
    revalidatePath("/admin/shareholders");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function updateShareholderAction(id: string, data: Partial<ShareholderInput>) {
  await requireAuth();

  const parsed = shareholderSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const doc = await shareholderService.update(id, parsed.data);
    revalidatePath("/admin/shareholders");
    revalidatePath(`/admin/shareholders/${id}`);
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function deleteShareholderAction(id: string) {
  await requireAuth();

  try {
    await shareholderService.remove(id);
    revalidatePath("/admin/shareholders");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
