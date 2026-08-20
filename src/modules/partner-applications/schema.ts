/**
 * src/modules/partner-applications/schema.ts
 * Zod validation schemas for Partner Applications and Assessment Results.
 */

import { z } from "zod";

const shareholderRoleEnum = z.enum([
  "tech",
  "financial",
  "tech-company",
  "individual",
  "legal",
  "foreign",
]);

export const assessmentResultSchema = z.object({
  technical: z.number().min(0).max(100),
  financial: z.number().min(0).max(100),
  legal: z.number().min(0).max(100),
  strategic: z.number().min(0).max(100),
  network: z.number().min(0).max(100),
});

export const partnerApplicationSchema = z.object({
  // Personal / organisation info
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  position: z.string().optional().default(""),
  linkedinUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .default(""),

  // Quiz
  quizAnswers: z.record(z.string(), z.string()),
  assessmentScore: assessmentResultSchema,
  suggestedRole: shareholderRoleEnum,

  // Formal registration
  desiredRole: shareholderRoleEnum,
  capitalRange: z.string().optional().default(""),
  motivation: z
    .string()
    .min(1, "Please describe your motivation for joining")
    .max(3000),
  capabilities: z
    .string()
    .min(1, "Please describe the capabilities you can contribute")
    .max(3000),
  investmentPlan: z.string().optional().default(""),

  /**
   * Personal-data consent — required under Decree 13/2023/NĐ-CP.
   * Must be true; any other value is rejected.
   */
  consentGiven: z
    .boolean()
    .refine(
      (v) => v === true,
      "You must consent to personal data processing to continue",
    ),
  /** ISO timestamp recorded when the user ticked the checkbox — retained for audit trail */
  consentTimestamp: z.string().min(1, "Consent timestamp is required"),
});

export const partnerApplicationUpdateSchema = z.object({
  status: z
    .enum([
      "draft",
      "submitted",
      "under_review",
      "shortlisted",
      "approved",
      "rejected",
    ])
    .optional(),
  adminNotes: z.string().optional(),
  desiredRole: shareholderRoleEnum.optional(),
});

export type AssessmentResultInput = z.infer<typeof assessmentResultSchema>;
export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>;
export type PartnerApplicationUpdateInput = z.infer<
  typeof partnerApplicationUpdateSchema
>;
