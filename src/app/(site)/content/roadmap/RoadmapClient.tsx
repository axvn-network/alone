"use client";

import { Timeline } from "@/modules/content/components/Timeline";
import { RoadmapAccordion } from "@/modules/content/components/RoadmapAccordion";
import DocLayout, { DocSidebar, DocMain, DocHero, DocBody } from "@/shared/components/layout/DocLayout";
import { ROADMAP_PHASES, ROADMAP_META } from "@/data/roadmap";
import type { TocItem } from "@/shared/components/layout/DocLayout";
import StrategyNotice from "@/modules/content/components/StrategyNotice";

const TOC: readonly TocItem[] = [
  { id: "timeline", label: "Lộ trình", level: 1 },
  { id: "details", label: "Chi tiết", level: 1 },
];

export default function RoadmapClient() {
  return (
    <DocLayout>
      <DocSidebar toc={TOC} />
      <DocMain>
        <DocHero id="timeline">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Lộ Trình Định Hướng {ROADMAP_META.startYear}–{ROADMAP_META.endYear}
          </h2>
          <Timeline />
        </DocHero>

        <DocBody id="details">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-4">
            Chi Tiết Từng Giai Đoạn
          </h2>
          <RoadmapAccordion phases={ROADMAP_PHASES} />
        </DocBody>

        <div className="mt-8">
          <StrategyNotice className="max-w-none" />
        </div>
      </DocMain>
    </DocLayout>
  );
}
