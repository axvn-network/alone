/**
 * src/constants/api.ts
 *
 * External API endpoints used across services.
 * Import from here rather than hardcoding URLs in service files.
 */

export const API_ENDPOINTS = {
  /** Anthropic Claude — REST completions endpoint */
  ANTHROPIC_MESSAGES: "https://api.anthropic.com/v1/messages",

  /** WhatsApp Business Cloud API */
  WHATSAPP_SEND: (phoneNumberId: string, apiVersion: string) =>
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
} as const;

export const SITE_CONFIG = {
  /** Tên công ty hiển thị */
  NAME: "AXVN Tech Holding",

  /** PM2 / deploy app name — phải khớp với infra/ecosystem.config.js */
  PM2_APP: "AXVN-langding",
} as const;

export const SOCIAL_LINKS = {
  LINKEDIN:
    "https://www.linkedin.com/company/135716850/admin/dashboard/?editPageActiveTab=info",
  INSTAGRAM: "https://www.instagram.com/vnkrdubai/",
  FACEBOOK: "https://www.facebook.com/profile.php?id=61591930895552",
  THREADS: "https://www.threads.com/@vnkrdubai",
  X: "https://x.com/Vnkr",
  YOUTUBE: "https://www.youtube.com/@Vnkr",
} as const;
