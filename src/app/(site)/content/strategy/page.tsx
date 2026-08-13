/**
 * src/app/strategy/page.tsx
 *
 * Server Component — chỉ chứa metadata + PageHero (không dùng hooks/framer-motion).
 * Toàn bộ interactive content được đẩy vào StrategyClient (client boundary).
 */

import type { Metadata } from "next";
import PageHero from "@/app/(site)/components/public/PageHero";
import StrategyClient from "./StrategyClient";
import { ROADMAP_META } from "@/data/roadmap";

export const metadata: Metadata = {
  title: "Chiến Lược Tổng Thể 2026–2031",
  description:
    "Lộ trình chiến lược tương tác AXVN Tech Holding giai đoạn 2026–2031: timeline trực quan, KPI tổng quan và nội dung chi tiết có thể mở rộng.",
};

export default function StrategyPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag={`Chiến Lược ${ROADMAP_META.startYear}–${ROADMAP_META.endYear}`}
        heading="Lộ Trình Tổng Thể AXVN Tech Holding"
        description="Tầm nhìn, mô hình vận hành và sáu giai đoạn định hướng được trình bày dưới dạng trực quan tương tác."
      />
      <StrategyClient />
    </main>
  );
}
