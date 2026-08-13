import Hero from "@/app/(site)/components/public/Hero";
import Introduction from "@/app/(site)/components/public/Introduction";
import WhatWeDo from "@/app/(site)/components/public/WhatWeDo";
import InvestmentSectors from "@/app/(site)/components/public/InvestmentSectors";
import WhyChooseUs from "@/app/(site)/components/public/WhyChooseUs";
import Philosophy from "@/app/(site)/components/public/Philosophy";
import PartnershipCTA from "@/app/(site)/components/public/PartnershipCTA";
import Newsletter from "@/app/(site)/components/public/Newsletter";

import PageTransition from "@/app/(site)/components/animations/PageTransition";
import { FloatingBlobs } from "@/app/(site)/components/animations/AnimatedBackground";
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
