/**
 * src/modules/blog/schema.ts
 * Zod validation schema for Blog/Article.
 */

import { z } from "zod";

const seoObjectSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  keywords: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

export const blogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be 500 characters or fewer")
    .optional()
    .default(""),
  content: z.string().optional().default(""),
  featuredImage: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  readTime: z.string().optional().default("5 min read"),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  publishedAt: z.string().datetime().nullable().optional().default(null),
  seo: seoObjectSchema.optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;
