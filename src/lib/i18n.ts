import vi from "@/locales/vi.json";

export type LocaleKeys = typeof vi;

export function t(keyPath: string, fallback?: string): string {
  const keys = keyPath.split(".");
  let current: any = vi;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return fallback || keyPath;
    }
  }
  return typeof current === "string" ? current : fallback || keyPath;
}

export default vi;
