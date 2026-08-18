"use server";

/**
 * src/modules/settings/actions.ts
 * Server Actions — Site Settings
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { settingsSchema, type SettingsInput } from "@/modules/settings/schema";
import { formatZodErrors } from "@/shared/utils/zod";
import { updateSettings } from "./service";

export async function updateSettingsAction(data: SettingsInput) {
  await requireAuth();
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }
  try {
    const doc = await updateSettings(parsed.data);
    revalidatePath("/admin/settings");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
