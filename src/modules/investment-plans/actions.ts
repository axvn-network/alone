"use server";

/**
 * src/modules/investment-plans/actions.ts
 * Server Actions — Investment Plans / Gói đầu tư
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { investmentPlanSchema, type InvestmentPlanInput } from "@/modules/investment-plans/schema";
import { formatZodErrors } from "@/shared/utils/zod";
import * as planService from "@/modules/investment-plans/service";

export async function createPlanAction(data: InvestmentPlanInput) {
  await requireAuth();

  const parsed = investmentPlanSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const plan = await planService.createPlan(parsed.data);
    revalidatePath("/admin/investment-plans");
    return { success: true as const, data: JSON.parse(JSON.stringify(plan)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function updatePlanAction(id: string, data: Partial<InvestmentPlanInput>) {
  await requireAuth();

  const parsed = investmentPlanSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: formatZodErrors(parsed.error) };
  }

  try {
    const plan = await planService.updatePlan(id, parsed.data);
    revalidatePath("/admin/investment-plans");
    revalidatePath("/investment-plans");
    return { success: true as const, data: JSON.parse(JSON.stringify(plan)) };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function deletePlanAction(id: string) {
  await requireAuth();
  try {
    await planService.deletePlan(id);
    revalidatePath("/admin/investment-plans");
    revalidatePath("/investment-plans");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

export async function reorderPlansAction(orderedIds: string[]) {
  await requireAuth();
  try {
    await planService.reorderPlans(orderedIds);
    revalidatePath("/admin/investment-plans");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
