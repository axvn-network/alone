/**
 * src/modules/capital-transactions/schema.ts
 *
 * Zod schemas cho Server Actions và validation đầu vào.
 * Tất cả messages bằng tiếng Việt.
 */

import { z } from "zod";
import type { CapTxType, CapTxStatus } from "./types";

export const capTxTypeEnum = z.enum([
  "capital_call",
  "deposit",
  "payment_confirm",
  "adjustment",
] as [CapTxType, ...CapTxType[]]);

export const capTxStatusEnum = z.enum([
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
] as [CapTxStatus, ...CapTxStatus[]]);

/** Admin tạo capital_call hoặc adjustment */
export const createCapTxSchema = z.object({
  shareholderId: z.string().min(1, "Cổ đông là bắt buộc"),
  type: capTxTypeEnum,
  amount: z
    .number()
    .int("Số tiền phải là số nguyên VNĐ")
    .positive("Số tiền phải lớn hơn 0"),
  description: z.string().max(500).optional().default(""),
  referenceNo: z.string().max(100).optional().default(""),
  adminNote: z.string().max(1000).optional().default(""),
  proofUrl: z.string().optional().default(""),
});

/** Admin xét duyệt (confirm / reject / cancel) */
export const updateCapTxStatusSchema = z.object({
  id: z.string().min(1, "ID giao dịch là bắt buộc"),
  status: z.enum(["confirmed", "rejected", "cancelled"] as [
    "confirmed",
    "rejected",
    "cancelled",
  ]),
  adminNote: z.string().max(1000).optional().default(""),
});

/** Cổ đông gửi deposit */
export const submitDepositSchema = z.object({
  shareholderId: z.string().min(1, "Cổ đông là bắt buộc"),
  amount: z
    .number()
    .int("Số tiền phải là số nguyên VNĐ")
    .positive("Số tiền phải lớn hơn 0"),
  proofUrl: z.string().optional().default(""),
  description: z.string().max(500).optional().default(""),
});

export type CreateCapTxInput = z.infer<typeof createCapTxSchema>;
export type UpdateCapTxStatusInput = z.infer<typeof updateCapTxStatusSchema>;
export type SubmitDepositInput = z.infer<typeof submitDepositSchema>;
