import vi from "@/locales/vi.json";
import en from "@/locales/en.json";

export type Locale = "vi" | "en";
export type LocaleKeys = typeof vi;

const dictionaries: Record<Locale, any> = { vi, en };

export function t(keyPath: string, locale: Locale = "vi", fallback?: string): string {
  const keys = keyPath.split(".");
  let current: any = dictionaries[locale] || vi;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return fallback || keyPath;
    }
  }
  return typeof current === "string" ? current : fallback || keyPath;
}

export { vi, en };
export default dictionaries;
