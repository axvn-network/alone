import type { Metadata } from "next";
import PageHero from "@/shared/components/blocks/PageHero";
import ComplianceClient from "./ComplianceClient";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Tuân Thủ & Pháp Lý",
  description:
    "Theo dõi tiến độ tuân thủ pháp lý và hồ sơ doanh nghiệp của AXVN Tech Holding.",
};

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-AXVN-navy pb-safe md:pb-0">
      <PageHero
        dark
        tag="Tuân thủ"
        heading="Tuân Thủ Pháp Lý & Hồ Sơ"
        description="Theo dõi tiến độ tuân thủ pháp lý và hồ sơ doanh nghiệp của AXVN Tech Holding."
      />
      <ComplianceClient />
    </main>
  );
}
