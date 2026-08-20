import { redirect } from "next/navigation";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;
/**
 * KPI forecasts are not a public disclosure. Retain the legacy URL only to
 * direct visitors to the public-safe strategy overview.
 */
export default function KpisPage() {
  redirect("/content/strategy");
}
