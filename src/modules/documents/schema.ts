/**
 * src/modules/documents/schema.ts
 * Zod validation schema for Document.
 */

import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  titleEn: z.string().optional().default(""),
  category: z.enum([
    "financial_report",
    "disclosure",
    "charter",
    "shareholder_meeting",
    "annual_report",
    "governance_report",
    "press_release",
    "regulatory_filing",
  ]),
  fileUrl: z.string().min(1, "File URL is required"),
  fileType: z.enum(["pdf", "doc", "xlsx", "other"]).optional().default("pdf"),
  publishedDate: z.string().min(1, "Published date is required"),
  year: z.number().int().min(2000).max(2100),
  quarter: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    .optional(),
  reportType: z.string().optional().default(""),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export type DocumentInput = z.infer<typeof documentSchema>;
