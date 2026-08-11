"use client";

import { useState } from "react";
import { Building2, Code2, Landmark, Scale, Sparkles, WalletCards } from "lucide-react";
import PageHero from "@/components/PageHero";
import StrategyNotice from "@/components/StrategyNotice";
import DocumentExplorer, { type ExplorerDocument } from "@/components/visual/DocumentExplorer";
import SystemDiagram, { DEFAULT_DIAGRAM_ROOT, type SystemDiagramNode } from "@/components/visual/SystemDiagram";
import VisualTimeline, { type VisualTimelineItem } from "@/components/visual/VisualTimeline";
import { CORE_VALUES, SUBSIDIARIES } from "@/constants/strategy";
import { ROADMAP_PHASES } from "@/data/roadmap";

const TIMELINE_ITEMS: readonly VisualTimelineItem[] = ROADMAP_PHASES.map((phase) => ({
  id: phase.year,
  label: phase.year,
  title: phase.title,
  description: phase.detail,
  highlights: phase.highlights,
}));

const ECOSYSTEM_NODES: readonly SystemDiagramNode[] = [
  { id: "financial", title: "Tài chính số", description: "Nghiên cứu sản phẩm, tuân thủ và quản trị rủi ro trong các điều kiện phù hợp.", icon: Landmark },
  { id: "payment", title: "Thanh toán & thương mại", description: "Nghiên cứu trải nghiệm thanh toán, thương mại và hợp tác hệ sinh thái.", icon: WalletCards },
  { id: "experience", title: "Trải nghiệm số", description: "Khám phá nội dung, Web3 và trải nghiệm số có trách nhiệm.", icon: Sparkles },
  { id: "infrastructure", title: "R&D & hạ tầng", description: "Phát triển năng lực nghiên cứu, kiến trúc, an toàn thông tin và vận hành.", icon: Code2 },
];

const EXPLORER_DOCUMENTS: readonly ExplorerDocument[] = [
  { id: "roadmap", group: "Lộ trình", title: "Lộ trình chiến lược 2026–2031", summary: "Sáu giai đoạn tham chiếu, trình bày như các định hướng có điều kiện.", href: "/roadmap" },
  { id: "model", group: "Mô hình", title: "Mô hình vận hành GVI Group", summary: "Tổng quan bốn mảng năng lực và vai trò điều phối ở mức công khai.", href: "/roadmap" },
  { id: "principles", group: "Nguyên tắc", title: "Khung giá trị định hướng", summary: "Chủ quyền số, tuân thủ, minh bạch, đổi mới và tiếp cận có trách nhiệm.", href: "/roadmap" },
  { id: "library", group: "Tài liệu", title: "Thư viện tài liệu chiến lược", summary: "Tìm tóm tắt công khai theo nhóm chiến lược, pháp lý và vận hành.", href: "/strategy-documents" },
];

export default function ProjectDashboardContent() {
  const [selectedYear, setSelectedYear] = useState(TIMELINE_ITEMS[0]?.id ?? "");

  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        dark
        tag="Project Dashboard"
        heading="Đọc Định Hướng Bằng Trực Quan"
        description="Một lớp điều hướng giúp theo dõi lộ trình, mô hình năng lực và tài liệu tham chiếu mà không cần đi qua các bảng dữ liệu dày đặc."
      >
        <a href="#timeline" className="inline-flex border border-gvi-gold bg-gvi-gold px-5 py-3 text-sm font-semibold text-gvi-navy transition-colors hover:bg-gvi-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gvi-ivory">Khám phá lộ trình</a>
      </PageHero>

      <section className="bg-gvi-navy px-5 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-5xl"><StrategyNotice dark /></div>
      </section>

      <section id="timeline" className="bg-gvi-navy px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="section-tag">01 · Lộ trình</p>
          <h2 className="mt-2 text-3xl font-semibold text-gvi-ivory">Chọn một mốc, xem đúng trọng tâm</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gvi-silver/75">Các mốc thể hiện thứ tự đọc của sáu giai đoạn định hướng; không phải chỉ báo tiến độ hoặc xác nhận hoàn thành.</p>
          <div className="mt-8"><VisualTimeline items={TIMELINE_ITEMS} selectedId={selectedYear} onSelect={setSelectedYear} /></div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="section-tag">02 · Mô hình</p>
          <h2 className="mt-2 text-3xl font-semibold text-gvi-navy">Chạm vào một năng lực để xem vai trò</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gvi-charcoal/70">Sơ đồ thay thế mô tả ASCII, tập trung vào quan hệ khái niệm thay vì hạ tầng, endpoint hoặc quy trình nội bộ.</p>
          <div className="mt-8"><SystemDiagram title="Hệ sinh thái định hướng GVI Group" description="GVI Tech Holding điều phối bốn nhóm năng lực được nghiên cứu và phát triển theo từng điều kiện phù hợp." root={DEFAULT_DIAGRAM_ROOT} nodes={ECOSYSTEM_NODES} /></div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="section-tag">03 · Chỉ mục thông minh</p>
          <h2 className="mt-2 text-3xl font-semibold text-gvi-navy">Từ câu hỏi đến tóm tắt phù hợp</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gvi-charcoal/70">Lọc theo chủ đề trước khi chuyển đến trang đọc chi tiết. Không hiển thị toàn văn tài liệu nội bộ hoặc dữ liệu vector.</p>
          <div className="mt-8"><DocumentExplorer documents={EXPLORER_DOCUMENTS} /></div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="section-tag">04 · Hệ quy chiếu</p>
          <h2 className="mt-2 text-3xl font-semibold text-gvi-navy">Năm nguyên tắc, bốn mảng năng lực</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="border border-gvi-gold/15 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 text-gvi-gold"><Scale className="h-4 w-4" aria-hidden="true" /><h3 className="text-sm font-semibold uppercase tracking-wider">Nguyên tắc định hướng</h3></div>
              <ul className="mt-5 space-y-3">{CORE_VALUES.map((value) => <li key={value.id} className="border-b border-gvi-gold/10 pb-3 last:border-0"><p className="text-sm font-semibold text-gvi-navy">{value.title}</p><p className="mt-1 text-xs leading-relaxed text-gvi-charcoal/65">{value.description}</p></li>)}</ul>
            </div>
            <div className="border border-gvi-gold/15 bg-gvi-navy p-5 sm:p-6">
              <div className="flex items-center gap-2 text-gvi-gold"><Building2 className="h-4 w-4" aria-hidden="true" /><h3 className="text-sm font-semibold uppercase tracking-wider">Mảng năng lực</h3></div>
              <ul className="mt-5 space-y-3">{SUBSIDIARIES.map((unit) => <li key={unit.id} className="border-b border-white/10 pb-3 last:border-0"><p className="text-sm font-semibold text-gvi-ivory">{unit.name}</p><p className="mt-1 text-xs leading-relaxed text-gvi-silver/70">{unit.description}</p></li>)}</ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
