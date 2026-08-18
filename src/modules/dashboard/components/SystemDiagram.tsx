"use client";

import { useState } from "react";
import {
  Building2,
  ChevronRight,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface SystemDiagramNode {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface SystemDiagramProps {
  title: string;
  description: string;
  root: SystemDiagramNode;
  nodes: readonly SystemDiagramNode[];
}

export default function SystemDiagram({
  title,
  description,
  root,
  nodes,
}: SystemDiagramProps) {
  const [selectedId, setSelectedId] = useState(root.id);
  const selected =
    [root, ...nodes].find((node) => node.id === selectedId) ?? root;
  const SelectedIcon = selected.icon;

  return (
    <section
      className="border border-AXVN-gold/15 bg-white p-5 sm:p-7"
      aria-labelledby="system-diagram-title"
    >
      <div className="max-w-2xl">
        <p className="section-tag">Sơ đồ tương tác</p>
        <h2
          id="system-diagram-title"
          className="mt-2 text-2xl font-semibold text-AXVN-navy"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-AXVN-charcoal/70">
          {description}
        </p>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[38rem]">
            <div className="mx-auto flex w-60 justify-center">
              <DiagramButton
                node={root}
                selected={selected.id === root.id}
                onSelect={setSelectedId}
                emphasis
              />
            </div>
            <div
              className="mx-auto h-8 w-px bg-AXVN-gold/40"
              aria-hidden="true"
            />
            <div className="h-px bg-AXVN-gold/35" aria-hidden="true" />
            <div className="grid grid-cols-4 gap-3">
              {nodes.map((node) => (
                <div key={node.id}>
                  <div
                    className="mx-auto h-7 w-px bg-AXVN-gold/35"
                    aria-hidden="true"
                  />
                  <DiagramButton
                    node={node}
                    selected={selected.id === node.id}
                    onSelect={setSelectedId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside
          className="border-l-2 border-AXVN-gold/35 pl-4"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-AXVN-gold">
            <SelectedIcon className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Đang xem
            </span>
          </div>
          <h3 className="mt-3 font-semibold text-AXVN-navy">
            {selected.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-AXVN-charcoal/70">
            {selected.description}
          </p>
          <p className="mt-5 flex items-center gap-2 text-xs text-AXVN-charcoal/55">
            <ShieldCheck
              className="h-4 w-4 text-AXVN-gold"
              aria-hidden="true"
            />
            Sơ đồ khái niệm, không mô tả hạ tầng vận hành.
          </p>
        </aside>
      </div>
    </section>
  );
}

function DiagramButton({
  node,
  selected,
  onSelect,
  emphasis = false,
}: {
  node: SystemDiagramNode;
  selected: boolean;
  onSelect: (id: string) => void;
  emphasis?: boolean;
}) {
  const Icon = node.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-pressed={selected}
      className={`group w-full border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-AXVN-gold ${
        selected
          ? "border-AXVN-gold bg-AXVN-navy text-AXVN-ivory"
          : "border-AXVN-gold/20 bg-white text-AXVN-navy hover:border-AXVN-gold/60"
      } ${emphasis ? "min-h-24" : "min-h-28"}`}
    >
      <Icon
        className={`h-4 w-4 ${selected ? "text-AXVN-gold" : "text-AXVN-gold"}`}
        aria-hidden="true"
      />
      <span className="mt-3 block text-xs font-semibold leading-snug">
        {node.title}
      </span>
      <ChevronRight
        className={`mt-2 h-3.5 w-3.5 transition-transform ${selected ? "translate-x-1 text-AXVN-gold" : "text-AXVN-charcoal/40"}`}
        aria-hidden="true"
      />
    </button>
  );
}

export const DEFAULT_DIAGRAM_ROOT: SystemDiagramNode = {
  id: "holding",
  title: "AXVN Tech Holding",
  description:
    "Điều phối định hướng, quản trị, tuân thủ và phát triển năng lực chung của hệ sinh thái.",
  icon: Building2,
};
