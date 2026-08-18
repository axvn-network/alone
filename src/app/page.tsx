import Hero from "@/modules/content/components/Hero";
import Introduction from "@/modules/content/components/Introduction";
import WhatWeDo from "@/modules/content/components/WhatWeDo";
import InvestmentSectors from "@/modules/content/components/InvestmentSectors";
import WhyChooseUs from "@/modules/content/components/WhyChooseUs";
import Philosophy from "@/modules/content/components/Philosophy";
import PartnershipCTA from "@/modules/content/components/PartnershipCTA";
import Newsletter from "@/modules/content/components/Newsletter";

import PageTransition from "@/shared/components/animations/PageTransition";
import { FloatingBlobs } from "@/shared/components/animations/AnimatedBackground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "AXVN Tech Holding là tập đoàn đầu tư công nghệ đang xây dựng nền tảng giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam theo NQ 05/2025/NQ-CP.",
  openGraph: {
    title: "Trang chủ | AXVN Tech Holding",
    description:
      "Tập đoàn đầu tư chiến lược hàng đầu chuyên về FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số Việt Nam.",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white relative pb-safe md:pb-0">
        <FloatingBlobs />

        <Hero />
        <Introduction />
        <WhatWeDo />
        <InvestmentSectors />
        <WhyChooseUs />
        <Philosophy />
        <PartnershipCTA />
        <Newsletter />

      </main>
    </PageTransition>
  );
}
