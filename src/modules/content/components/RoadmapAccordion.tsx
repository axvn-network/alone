'use client';

import { AccordionRoot, AccordionItem } from "@/shared/components/ui/Accordion";
import { type RoadmapPhase } from "@/data/roadmap";

interface RoadmapAccordionProps {
  phases: readonly RoadmapPhase[];
  className?: string;
}

export function RoadmapAccordion({ phases, className = "bg-AXVN-deep" }: RoadmapAccordionProps) {
  return (
    <AccordionRoot allowMultiple className={className}>
      {phases.map((phase) => (
        <AccordionItem
          key={phase.year}
          id={`phase-${phase.year}`}
          title={`${phase.year} — ${phase.title}`}
          badge={phase.theme}
        >
          <p className="mb-3">{phase.detail}</p>
          <ul className="space-y-1.5">
            {phase.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-AXVN-silver/70">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-AXVN-gold/60 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}
