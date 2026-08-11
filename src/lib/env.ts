import { z } from "zod";

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().default("587"),
  SMTP_SECURE: z.string().optional().transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().email().default("admin@vnkr.vn"),

  // WhatsApp
  WHATSAPP_VERIFY_TOKEN: z.string().default("gvi_webhook_2026"),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_API_VERSION: z.string().default("v20.0"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Auth / Session
  SESSION_SECRET: z.string().min(32),
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_NAME: z.string().default("Admin"),

  // General
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://vnkr.vn"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GEMINI_API_KEY: z.string().optional(),

  // Analytics — optional, chỉ inject script khi có giá trị thực
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
