/**
 * src/lib/i18n.ts
 *
 * Minimal i18n helper for server-side components.
 * Usage:  import { t } from "@/lib/i18n";
 *         const label = t("footer.contact", lang);
 *
 * Client-side components use the LangContext hook instead.
 */

import vi from "@/locales/vi.json";
import en from "@/locales/en.json";

export type Locale = "vi" | "en";
export type LocaleKeys = typeof vi;

type DictType = Record<string, unknown>;

const dictionaries: Record<Locale, DictType> = {
  vi: vi as unknown as DictType,
  en: en as unknown as DictType,
};

export function t(keyPath: string, locale: Locale = "vi", fallback?: string): string {
  const keys = keyPath.split(".");
  let current: unknown = dictionaries[locale] || vi;
  for (const k of keys) {
    if (current && typeof current === "object" && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return fallback || keyPath;
    }
  }
  return typeof current === "string" ? current : fallback || keyPath;
}

export { vi, en };
export default dictionaries;
