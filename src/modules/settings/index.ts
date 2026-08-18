/**
 * src/modules/settings/index.ts
 * Barrel export — import from "@/modules/settings"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as Settings } from "./model";
export type { ISettings, ISocialLink, IChatButton, ChatButtonType } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export { getSettings, getPublicSettings, updateSettings } from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { settingsSchema, chatButtonSchema } from "./schema";
export type { SettingsInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export { updateSettingsAction } from "./actions";
