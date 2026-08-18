/**
 * src/modules/shareholders/schema.ts
 * Zod validation schema for Shareholder.
 */

import { z } from "zod";

export const shareholderSchema = z.object({
  name: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  phone: z.string().optional().default(""),
  role: z.enum([
    "tech",
    "financial",
    "tech-company",
    "individual",
    "legal",
    "foreign",
  ]),
  status: z
    .enum(["pending", "active", "suspended"])
    .optional()
    .default("pending"),
  equityPercent: z.number().min(0).max(100).optional().default(0),
  capitalCommitted: z.number().min(0).optional().default(0),
  capitalPaid: z.number().min(0).optional().default(0),
  notes: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
});

export type ShareholderInput = z.infer<typeof shareholderSchema>;
