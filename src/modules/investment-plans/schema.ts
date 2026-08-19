/**
 * src/modules/investment-plans/schema.ts
 * Zod validation schema for InvestmentPlan.
 */

import { z } from "zod";

export const investmentPlanSchema = z.object({
  tier: z.enum(["seed", "growth", "expansion", "strategic", "anchor"]),
  name: z.string().min(1, "Name (VI) is required").max(200),
  nameEn: z.string().min(1, "Name (EN) is required").max(200),
  tagline: z.string().optional().default(""),
  taglineEn: z.string().optional().default(""),
  minCommitment: z.number().min(0, "Minimum commitment must be >= 0"),
  maxCommitment: z.number().min(0).optional().default(0),
  minimumEquity: z.number().min(0).optional().default(0),
  currency: z.string().optional().default("VND"),
  duration: z.string().optional().default(""),
  durationEn: z.string().optional().default(""),
  equityRange: z.string().optional().default(""),
  equityRangeEn: z.string().optional().default(""),
  benefits: z.array(z.string()).optional().default([]),
  benefitsEn: z.array(z.string()).optional().default([]),
  conditions: z.array(z.string()).optional().default([]),
  conditionsEn: z.array(z.string()).optional().default([]),
  rights: z.array(z.string()).optional().default([]),
  obligations: z.array(z.string()).optional().default([]),
  documents: z.array(z.string()).optional().default([]),
  shareholderType: z.string().optional().default(""),
  highlighted: z.boolean().optional().default(false),
  badge: z.string().optional().default(""),
  badgeEn: z.string().optional().default(""),
  order: z.number().optional().default(0),
  status: z.enum(["active", "draft", "closed"]).optional().default("draft"),
});

export type InvestmentPlanInput = z.infer<typeof investmentPlanSchema>;
