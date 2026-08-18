/**
 * src/modules/settings/schema.ts
 * Zod validation schemas for Site Settings.
 */

import { z } from "zod";

export const chatButtonSchema = z.object({
  type: z.enum(["whatsapp", "telegram", "zalo", "livechat"]),
  enabled: z.boolean().default(true),
  value: z.string().default(""),
  messageVi: z.string().optional().default(""),
  messageEn: z.string().optional().default(""),
});

export const settingsSchema = z.object({
  companyName: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  googleMap: z.string().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  googleAnalyticsId: z.string().optional(),
  metaPixelId: z.string().optional(),
  footer: z.string().optional(),
  chatButtons: z.array(chatButtonSchema).optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
