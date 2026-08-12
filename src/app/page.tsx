import Hero from "@/components/public/Hero";
import Introduction from "@/components/public/Introduction";
import WhatWeDo from "@/components/public/WhatWeDo";
import InvestmentSectors from "@/components/public/InvestmentSectors";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import Philosophy from "@/components/public/Philosophy";
import PartnershipCTA from "@/components/public/PartnershipCTA";
import Newsletter from "@/components/public/Newsletter";

import PageTransition from "@/components/animations/PageTransition";
import { FloatingBlobs } from "@/components/animations/AnimatedBackground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "GVI Tech Holding là tập đoàn đầu tư công nghệ đang xây dựng nền tảng giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam theo NQ 05/2025/NQ-CP.",
  openGraph: {
    title: "Trang chủ | GVI Tech Holding",
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
