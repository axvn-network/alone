/**
 * src/modules/content/schema.ts
 * Zod validation schemas for Page Content and SEO.
 */

import { z } from "zod";

const seoObjectSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  keywords: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

export const pageContentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  hero: z.record(z.string(), z.unknown()).optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.string(),
        content: z.string(),
        image: z.string().optional(),
        order: z.number(),
      }),
    )
    .optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  seo: seoObjectSchema.optional(),
});

export const seoSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  title: z
    .string()
    .max(70, "SEO title must be 70 characters or fewer")
    .optional(),
  description: z
    .string()
    .max(160, "Meta description must be 160 characters or fewer")
    .optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;
export type SEOInput = z.infer<typeof seoSchema>;
