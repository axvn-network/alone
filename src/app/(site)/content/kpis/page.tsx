import { redirect } from "next/navigation";

/**
 * KPI forecasts are not a public disclosure. Retain the legacy URL only to
 * direct visitors to the public-safe strategy overview.
 */
export default function KpisPage() {
  redirect("/strategy");
}
