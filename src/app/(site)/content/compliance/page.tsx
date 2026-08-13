import type { Metadata } from "next";
import PageHero from "@/app/(site)/components/public/PageHero";
import ComplianceClient from "./ComplianceClient";

export const metadata: Metadata = {
  title: "Tuân Thủ & Pháp Lý",
  description: "Theo dõi tiến độ tuân thủ pháp lý và hồ sơ doanh nghiệp của AXVN Tech Holding.",
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
