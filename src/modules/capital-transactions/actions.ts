"use server";

/**
 * src/modules/capital-transactions/actions.ts
 *
 * Server Actions cho giao dịch vốn cổ đông.
 *
 * Luồng write:
 *   Client Form → actions.ts (RBAC check) → service.ts → DB → revalidatePath()
 *
 * Không đi qua API route — direct server-to-server function call.
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/core/security/auth-utils";
import { handleError } from "@/utils/errors";
import { logAudit } from "@/modules/audit-log";
import * as service from "./service";
import {
  createCapTxSchema,
  updateCapTxStatusSchema,
  submitDepositSchema,
} from "./schema";
import type { CreateCapTxInput, UpdateCapTxStatusInput, SubmitDepositInput } from "./schema";

// ─── Admin: Tạo giao dịch (capital_call / adjustment) ────────────────────────

export async function createCapTxAction(raw: CreateCapTxInput) {
  const user = await requireAuth();

  const parsed = createCapTxSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const tx = await service.create(parsed.data);

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     "capitalTransaction.create",
      collection: "capitaltransactions",
      id:         tx._id,
      delta:      { type: tx.type, amount: tx.amount, shareholderId: tx.shareholderId },
      ip:         "",
    });

    revalidatePath("/admin/capital-transactions");
    return { success: true as const, data: tx };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

// ─── Admin: Xét duyệt deposit (confirm / reject / cancel) ────────────────────

export async function updateCapTxStatusAction(raw: UpdateCapTxStatusInput) {
  const user = await requireAuth();

  const parsed = updateCapTxStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  const { id, status, adminNote } = parsed.data;

  try {
    const tx = await service.updateStatus({
      id,
      status,
      adminNote,
      processedBy: user.id,
    });

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     `capitalTransaction.${status}`,
      collection: "capitaltransactions",
      id,
      delta:      { status, adminNote },
      ip:         "",
    });

    revalidatePath("/admin/capital-transactions");
    return { success: true as const, data: tx };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}

// ─── Cổ đông: Gửi deposit ─────────────────────────────────────────────────────

export async function submitDepositAction(raw: SubmitDepositInput) {
  const user = await requireAuth();

  const parsed = submitDepositSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const tx = await service.submitDeposit(
      parsed.data.shareholderId,
      parsed.data.amount,
      parsed.data.proofUrl,
      parsed.data.description,
    );

    await logAudit({
      actor:      { id: user.id, name: user.name, email: user.email },
      action:     "capitalTransaction.deposit.submit",
      collection: "capitaltransactions",
      id:         tx._id,
      delta:      { amount: tx.amount, proofUrl: tx.proofUrl },
      ip:         "",
    });

    revalidatePath("/admin/capital-transactions");
    revalidatePath("/portals/shareholders/dashboard");
    return { success: true as const, data: tx };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
