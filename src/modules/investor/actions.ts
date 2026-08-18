"use server";

/**
 * src/modules/investor/actions.ts
 * Server Actions — Investor
 * Luồng: Client Form → actions.ts (RBAC) → service.ts → DB → revalidatePath()
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import * as service from "./service";
import { createInvestorSchema } from "./schema";
import type { CreateInvestorInput } from "./schema";

export async function createInvestorAction(raw: CreateInvestorInput) {
  await requireAuth();

  const parsed = createInvestorSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await service.create(parsed.data);
    revalidatePath("/admin/investor");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
