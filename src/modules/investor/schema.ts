/**
 * src/modules/investor/schema.ts
 * Zod validation schemas — messages tiếng Việt
 */

import { z } from "zod";

export const createInvestorSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  company: z.string().min(2, "Tên công ty quá ngắn"),
  capitalCommitted: z.number().min(0, "Vốn phải lớn hơn 0"),
});

export const updateInvestorSchema = createInvestorSchema.partial();

export type CreateInvestorInput = z.infer<typeof createInvestorSchema>;
export type UpdateInvestorInput = z.infer<typeof updateInvestorSchema>;
