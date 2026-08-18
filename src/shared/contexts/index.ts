/**
 * src/contexts/index.ts
 * Barrel — re-exports all React context providers and hooks.
 *
 * Usage:
 *   import { useCsrf, CsrfProvider } from "@/contexts";
 *   import { useLang, LangProvider } from "@/contexts";
 */

export { useCsrf, CsrfProvider } from "./CsrfContext";
export { useLang, LangProvider } from "./LangContext";
export { useAdminSession, AdminSessionProvider } from "./AdminSessionContext";
export type { AdminInfo } from "./AdminSessionContext";
export type { Locale } from "@/shared/i18n";
