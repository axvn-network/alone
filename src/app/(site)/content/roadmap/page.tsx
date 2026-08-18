import type { Metadata } from "next";
import PageHero from "@/shared/components/blocks/PageHero";
import RoadmapClient from "./RoadmapClient";
import { ROADMAP_META } from "@/shared/constants/roadmap";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Lộ Trình Chiến Lược",
  description:
    "Tầm nhìn, giá trị cốt lõi, mô hình vận hành và lộ trình định hướng AXVN Tech Holding giai đoạn 2026–2031.",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag={`Chiến Lược ${ROADMAP_META.startYear}–${ROADMAP_META.endYear}`}
        heading="Lộ Trình Phát Triển Hệ Sinh Thái"
        description="Tầm nhìn, giá trị, mô hình vận hành và sáu giai đoạn định hướng tham chiếu của AXVN Tech Holding."
      />
      <RoadmapClient />
    </main>
  );
}
