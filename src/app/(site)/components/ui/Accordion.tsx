"use client";

/**
 * src/components/ui/Accordion.tsx
 *
 * Accessible accordion dùng AnimatePresence + useReducedMotion.
 * Hỗ trợ:
 *   - Single: chỉ 1 item mở tại 1 thời điểm (mặc định)
 *   - Multiple: nhiều item mở cùng lúc (prop allowMultiple)
 *
 * Export:
 *   - AccordionRoot  — wrapper quản lý state
 *   - AccordionItem  — mỗi item
 *   - Accordion      — shorthand khi có 1 item
 */

import { createContext, useContext, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionCtx {
  openIds: Set<string>;
  toggle: (id: string) => void;
}

const Ctx = createContext<AccordionCtx | null>(null);

function useAccordionCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AccordionItem must be inside AccordionRoot");
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface AccordionRootProps {
  children: React.ReactNode;
  /** Cho phép mở nhiều item cùng lúc. Mặc định: false */
  allowMultiple?: boolean;
  /** ID mở mặc định */
  defaultOpen?: string;
  className?: string;
}

export function AccordionRoot({
  children,
  allowMultiple = false,
  defaultOpen,
  className = "",
}: AccordionRootProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpen ? new Set([defaultOpen]) : new Set()
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ openIds, toggle }}>
      <div className={`divide-y divide-AXVN-gold/10 rounded-xl border border-AXVN-gold/15 overflow-hidden ${className}`}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface AccordionItemProps {
  /** ID duy nhất dùng cho aria-controls */
  id?: string;
  title: React.ReactNode;
  /** Badge text (tùy chọn) */
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ id, title, badge, children, className = "" }: AccordionItemProps) {
  const autoId = useId();
  const itemId = id ?? autoId;
  const panelId = `accordion-panel-${itemId}`;
  const { openIds, toggle } = useAccordionCtx();
  const isOpen = openIds.has(itemId);
  const reduced = useReducedMotion();

  return (
    <div className={className}>
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggle(itemId)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left bg-AXVN-deep hover:bg-AXVN-navy/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-AXVN-gold"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold text-AXVN-ivory leading-snug">{title}</span>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-AXVN-gold/10 text-AXVN-gold shrink-0">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-AXVN-gold" : "text-AXVN-silver/50"
            }`}
          aria-hidden="true"
        />
      </button>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-AXVN-navy/30 text-AXVN-silver/80 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shorthand: single standalone accordion ───────────────────────────────────

interface AccordionProps {
  title: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Shorthand cho trường hợp chỉ có 1 item accordion độc lập.
 * Không cần AccordionRoot.
 */
export function Accordion({ title, badge, children, defaultOpen = false, className }: AccordionProps) {
  return (
    <AccordionRoot defaultOpen={defaultOpen ? "single" : undefined} className={className}>
      <AccordionItem id="single" title={title} badge={badge}>
        {children}
      </AccordionItem>
    </AccordionRoot>
  );
}

export default Accordion;
