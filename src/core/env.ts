import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),

    // ── Database ────────────────────────────────────────────────────────────
    MONGODB_URI: z.string().url(),

    // ── Auth / Session ──────────────────────────────────────────────────────
    /** Minimum 64 hex chars — used for HMAC admin/public session tokens */
    SESSION_SECRET: z.string().min(32),
    /**
     * Optional dedicated CSRF signing key.
     * If not set, falls back to SESSION_SECRET + ":csrf" (backward-compatible).
     * Tạo: openssl rand -hex 32
     */
    CSRF_SECRET: z.string().min(32).optional(),
    /**
     * Optional dedicated AES-256 encryption key for PII fields (NĐ 13/2023).
     * If not set, falls back to SHA-256(SESSION_SECRET) (backward-compatible).
     * Tạo: openssl rand -hex 32
     */
    ENCRYPTION_KEY: z.string().min(32).optional(),

    // ── Default superadmin seed ─────────────────────────────────────────────
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(8),
    ADMIN_NAME: z.string().optional().default("AXVN Admin"),

    // ── SMTP (optional — email notifications) ───────────────────────────────
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    /** "from" display name in outgoing system emails */
    SMTP_FROM_NAME: z.string().optional().default("AXVN Tech Holding"),
    SMTP_FROM_EMAIL: z.string().email().optional(),

    // ── Cloudinary (media / document uploads) ───────────────────────────────
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // ── AI Assistant (Anthropic Claude) ─────────────────────────────────────
    ANTHROPIC_API_KEY: z.string().optional(),

    // ── WhatsApp Business Cloud API (optional) ───────────────────────────────
    WHATSAPP_VERIFY_TOKEN: z.string().optional(),
    WHATSAPP_ACCESS_TOKEN: z.string().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    WHATSAPP_API_VERSION: z.string().optional().default("v20.0"),
    WHATSAPP_APP_SECRET: z.string().optional(),

    // ── Logging ─────────────────────────────────────────────────────────────
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional().default("info"),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    CSRF_SECRET: process.env.CSRF_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION,
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
