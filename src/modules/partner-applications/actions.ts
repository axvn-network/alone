"use server";

/**
 * src/modules/partner-applications/actions.ts
 * Server Actions — Partner Applications
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import {
  partnerApplicationSchema,
  partnerApplicationUpdateSchema,
  type PartnerApplicationInput,
  type PartnerApplicationUpdateInput,
} from "@/modules/partner-applications/schema";
import { formatZodErrors } from "@/shared/utils/zod";
import { createApplication, updateApplication } from "./service";

export async function submitPartnerApplicationAction(
  data: PartnerApplicationInput,
) {
  const parsed = partnerApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }
  try {
    const doc = await createApplication(parsed.data);
    revalidatePath("/admin/partner-applications");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function updateApplicationStatusAction(
  id: string,
  data: PartnerApplicationUpdateInput,
) {
  await requireAuth();
  const parsed = partnerApplicationUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }
  try {
    const doc = await updateApplication(id, parsed.data);
    revalidatePath("/admin/partner-applications");
    return { success: true as const, data: JSON.parse(JSON.stringify(doc)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
