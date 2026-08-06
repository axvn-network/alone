import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import WhatWeDo from "@/components/WhatWeDo";
import InvestmentSectors from "@/components/InvestmentSectors";
import WhyChooseUs from "@/components/WhyChooseUs";
import Philosophy from "@/components/Philosophy";
import PartnershipCTA from "@/components/PartnershipCTA";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import PageTransition from "@/components/animations/PageTransition";
import { FloatingBlobs } from "@/components/animations/AnimatedBackground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Fortress Investment Holdings là tập đoàn đầu tư uy tín hàng đầu chuyên về bất động sản, đầu tư tư nhân, mua bán doanh nghiệp, công nghệ AI và dịch vụ nghỉ dưỡng cao cấp.",
  openGraph: {
    title: "Trang chủ | Fortress Investment Holdings",
    description:
      "Tập đoàn đầu tư chiến lược hàng đầu chuyên về bất động sản, private equity và thâu tóm doanh nghiệp.",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white relative">
        <FloatingBlobs />
        <Navbar />
        <Hero />
        <Introduction />
        <WhatWeDo />
        <InvestmentSectors />
        <WhyChooseUs />
        <Philosophy />
        <PartnershipCTA />
        <Newsletter />
        <Footer />
      </main>
    </PageTransition>
  );
}
