"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export interface VisualTimelineItem {
  id: string;
  label: string;
  title: string;
  description: string;
  highlights: readonly string[];
}

interface VisualTimelineProps {
  items: readonly VisualTimelineItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function VisualTimeline({ items, selectedId, onSelect }: VisualTimelineProps) {
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  if (!selected) return null;

  return (
    <section aria-label="Dòng thời gian định hướng">
      <div className="flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Chọn giai đoạn">
        {items.map((item, index) => {
          const active = item.id === selected.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`visual-timeline-${item.id}`}
              onClick={() => onSelect(item.id)}
              className={`min-w-28 border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-AXVN-gold ${active
                  ? "border-AXVN-gold bg-AXVN-gold text-AXVN-navy"
                  : "border-white/15 bg-white/5 text-AXVN-silver hover:border-AXVN-gold/50"
                }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Mốc {index + 1}</span>
              <span className="mt-1 block text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>

      <motion.article
        key={selected.id}
        id={`visual-timeline-${selected.id}`}
        role="tabpanel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="border border-AXVN-gold/25 bg-AXVN-deep p-5 sm:p-7"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-AXVN-gold">{selected.label}</p>
            <h3 className="mt-2 text-xl font-semibold text-AXVN-ivory">{selected.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-AXVN-silver/75">{selected.description}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-AXVN-gold" aria-hidden="true" />
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {selected.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 border-t border-white/10 pt-3 text-xs leading-relaxed text-AXVN-silver/75">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-AXVN-gold" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </motion.article>
    </section>
  );
}
