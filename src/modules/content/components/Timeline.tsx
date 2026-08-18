"use client";

/**
 * src/components/visual/Timeline.tsx
 *
 * Interactive roadmap timeline. Nhận mảng RoadmapPhase từ src/data/roadmap.ts.
 * Mặc định dùng toàn bộ ROADMAP_PHASES nhưng chấp nhận prop để test riêng.
 *
 * Pattern: data-driven — không có nội dung hardcode bên trong component.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, Compass, Map, Milestone } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ROADMAP_PHASES, ROADMAP_META, type RoadmapPhase } from "@/data/roadmap";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimelineProps {
  phases?: readonly RoadmapPhase[];
  /** Năm được mở mặc định khi mount. Mặc định: phase đầu tiên */
  defaultOpen?: string;
}

// ─── Stat card nhỏ phía trên ─────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-AXVN-navy/70 p-4">
      <div className="flex items-center gap-2 text-AXVN-gold">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-3 text-xl font-semibold text-AXVN-ivory">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-AXVN-silver/60">{description}</p>
    </div>
  );
}

// ─── Phase item ───────────────────────────────────────────────────────────────

function PhaseItem({
  phase,
  isOpen,
  isReference,
  isEarlier,
  onToggle,
}: {
  phase: RoadmapPhase;
  isOpen: boolean;
  isReference: boolean;
  isEarlier: boolean;
  onToggle: (year: string) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <li className="relative flex items-start gap-5 sm:gap-7">
      {/* Year bubble */}
      <div className="relative z-10 flex flex-col items-center shrink-0 mt-1">
        <span
          className={`w-12 h-12 bg-AXVN-navy border rounded-full flex items-center justify-center text-xs font-semibold ${isReference
              ? "border-AXVN-gold bg-AXVN-gold/15 text-AXVN-gold"
              : isEarlier
                ? "border-AXVN-silver/25 text-AXVN-silver/65"
                : "border-AXVN-gold/40 text-AXVN-gold"
            }`}
        >
          {phase.year}
        </span>
      </div>

      {/* Card */}
      <article
        className={`flex-1 rounded-xl border bg-AXVN-deep transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 ${isReference
            ? "border-AXVN-gold/45 shadow-lg shadow-AXVN-gold/5"
            : "border-AXVN-gold/15 hover:border-AXVN-gold/35"
          }`}
      >
        {/* Header button */}
        <button
          type="button"
          className="w-full p-5 text-left cursor-pointer"
          onClick={() => onToggle(phase.year)}
          aria-expanded={isOpen}
          aria-controls={`timeline-phase-${phase.year}`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-AXVN-silver/55 text-[10px] font-mono font-bold tracking-widest">
                GIAI ĐOẠN {phase.sequence} · {phase.year}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-AXVN-gold/10 text-AXVN-gold">
                {phase.theme}
              </span>
              {isReference && (
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-AXVN-gold text-AXVN-navy">
                  Mốc tham chiếu
                </span>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-AXVN-ivory text-sm mb-1.5">{phase.title}</h3>
              <p className="text-AXVN-silver/70 text-xs leading-relaxed">{phase.detail}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180 text-AXVN-gold" : "text-AXVN-silver/50"
                }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Expandable highlights */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`timeline-phase-${phase.year}`}
              key="content"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t border-white/8">
                <ul className="mt-4 space-y-3">
                  {phase.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 mt-0.5 text-AXVN-gold"
                        aria-hidden="true"
                      />
                      <span className="text-AXVN-silver/75 text-xs leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Timeline({ phases = ROADMAP_PHASES, defaultOpen }: TimelineProps) {
  const [openYear, setOpenYear] = useState<string | null>(
    defaultOpen ?? phases[0]?.year ?? null
  );

  const toggle = (year: string) =>
    setOpenYear((cur) => (cur === year ? null : year));

  const selectedPhase = phases.find((p) => p.year === openYear) ?? phases[0];
  const refYear = ROADMAP_META.referenceYear;
  const refIndex = phases.findIndex((p) => p.yearNum === refYear);
  const refPosition = refIndex >= 0 ? refIndex + 1 : 1;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* ── Summary bar ─────────────────────────────────────────────── */}
      <section
        className="mb-8 rounded-xl border border-AXVN-gold/15 bg-AXVN-deep/80 p-4 sm:p-5"
        aria-label="Tóm tắt lộ trình"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={Compass}
            label="Năm tham chiếu"
            value={String(refYear)}
            description="Dùng để định vị khi đọc lộ trình phiên bản 1.0.0."
          />
          <StatCard
            icon={Milestone}
            label="Mốc đang xem"
            value={selectedPhase?.year ?? "—"}
            description={selectedPhase?.title ?? "Chọn một giai đoạn để xem trọng tâm."}
          />
          <StatCard
            icon={Map}
            label="Phạm vi đọc"
            value={`${phases[0]?.year}–${phases.at(-1)?.year}`}
            description={`${phases.length} giai đoạn định hướng được trình bày theo thứ tự.`}
          />
        </div>

        {/* Progress bar + year buttons */}
        <div className="mt-5" aria-label={`Trình tự ${phases.length} giai đoạn tham chiếu`}>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${Math.max(phases.length, 1)}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {phases.map((phase, index) => (
              <span
                key={phase.year}
                className={`h-1.5 rounded-full transition-colors duration-300 ${index < refPosition ? "bg-AXVN-gold/70" : "bg-AXVN-silver/20"
                  }`}
              />
            ))}
          </div>
          <div
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
            aria-label="Chọn giai đoạn lộ trình"
          >
            {phases.map((phase) => {
              const isActive = openYear === phase.year;
              return (
                <button
                  key={phase.year}
                  type="button"
                  onClick={() => toggle(phase.year)}
                  aria-pressed={isActive}
                  aria-controls={`timeline-phase-${phase.year}`}
                  className={`min-w-16 rounded-md border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-AXVN-gold ${isActive
                      ? "border-AXVN-gold bg-AXVN-gold text-AXVN-navy"
                      : "border-AXVN-gold/20 bg-AXVN-navy text-AXVN-silver hover:border-AXVN-gold/50"
                    }`}
                >
                  {phase.year}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vertical guide line ─────────────────────────────────────── */}
      <div className="absolute left-6 top-[27rem] bottom-8 w-px bg-gradient-to-b from-AXVN-gold/50 via-AXVN-gold/30 to-AXVN-silver/10 hidden sm:block" />

      {/* ── Phase list ──────────────────────────────────────────────── */}
      <ol className="space-y-4">
        {phases.map((phase) => (
          <PhaseItem
            key={phase.year}
            phase={phase}
            isOpen={openYear === phase.year}
            isReference={phase.yearNum === refYear}
            isEarlier={phase.yearNum < refYear}
            onToggle={toggle}
          />
        ))}
      </ol>
    </div>
  );
}

export default Timeline;
