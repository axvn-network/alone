"use client";

import { CalendarRange, Building2, ShieldCheck } from "lucide-react";
import { KpiDashboard } from "@/modules/dashboard";
import { Timeline } from "@/shared/components/blocks/Timeline";
import { RoadmapAccordion } from "@/shared/components/blocks/RoadmapAccordion";
import StrategyNotice from "@/shared/components/blocks/StrategyNotice";
import DocLayout, {
  DocSidebar,
  DocMain,
  DocHero,
  DocBody,
} from "@/shared/components/layout/DocLayout";
import { ROADMAP_PHASES, ROADMAP_META } from "@/shared/constants/roadmap";
import type { TocItem } from "@/shared/components/layout/DocLayout";

const TOC: readonly TocItem[] = [
  { id: "kpi", label: "Tổng quan", level: 1 },
  { id: "timeline", label: "Lộ trình", level: 1 },
  { id: "details", label: "Chi tiết giai đoạn", level: 1 },
];

const KPI_ITEMS = [
  {
    value: ROADMAP_PHASES.length,
    label: "giai đoạn",
    description: `Trải từ ${ROADMAP_META.startYear} đến ${ROADMAP_META.endYear}.`,
    icon: CalendarRange,
  },
  {
    value: 4,
    label: "mảng năng lực",
    description: "Mô hình điều phối định hướng của AXVN Group.",
    icon: Building2,
  },
  {
    value: 5,
    label: "nguyên tắc",
    description: "Khung điều phối chiến lược.",
    icon: ShieldCheck,
  },
];

export default function StrategyClient() {
  return (
    <DocLayout>
      <DocSidebar toc={TOC} />
      <DocMain>
        <section id="kpi" aria-labelledby="kpi-heading" className="mb-12">
          <p
            id="kpi-heading"
            className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-4"
          >
            Tổng Quan
          </p>
          <KpiDashboard items={KPI_ITEMS} columns={3} />
        </section>

        <DocHero id="timeline">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Lộ Trình Tương Tác
          </p>
          <Timeline />
        </DocHero>

        <DocBody id="details">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-4">
            Chi Tiết Từng Giai Đoạn
          </p>
          <RoadmapAccordion phases={ROADMAP_PHASES} />
        </DocBody>

        <div className="mt-8">
          <StrategyNotice className="max-w-none" />
        </div>
      </DocMain>
    </DocLayout>
  );
}
