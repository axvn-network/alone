import type { Metadata } from "next";
import { RiskMatrix } from "@/components/visual/RiskMatrix";
import PageHero from "@/components/public/PageHero";
import { RISKS } from "@/data/risks";

export const metadata: Metadata = {
  title: "Ma Trận Rủi Ro Chiến Lược | GVI Tech Holding",
  description:
    "Tổng hợp các nhóm rủi ro tham chiếu nhằm hỗ trợ rà soát và quản trị có trách nhiệm tại GVI Tech Holding.",
};

export default function RisksPage() {
  return (
    <main className="min-h-screen bg-gvi-navy pb-safe md:pb-0">
      <PageHero
        dark
        tag="Quản trị rủi ro"
        heading="Ma Trận Rủi Ro Chiến Lược"
        description="Tổng hợp các nhóm rủi ro tham chiếu nhằm hỗ trợ rà soát và quản trị có trách nhiệm."
      />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <RiskMatrix risks={RISKS} />
        </div>
      </section>
    </main>
  );
}
