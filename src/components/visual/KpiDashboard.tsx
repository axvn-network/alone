"use client";

/**
 * src/components/visual/KpiDashboard.tsx
 *
 * Strategy overview pattern: nhận mảng KpiItem và render thành grid card có
 * Framer Motion counter animation + Lucide icon.
 *
 * Không có dữ liệu hardcode — caller truyền items vào.
 * Xem ví dụ sử dụng ở cuối file.
 */

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KpiItem {
  /** Giá trị hiển thị — số nguyên để animate đếm, hoặc string tĩnh */
  value: number | string;
  /** Đơn vị hậu tố, ví dụ: "+", "%", " tỷ" */
  unit?: string;
  /** Label ngắn dưới value */
  label: string;
  /** Mô tả 1-2 câu */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Màu accent — tailwind text class, mặc định text-gvi-gold */
  accentColor?: string;
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, unit = "" }: { target: number; unit?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!inView || reduced) {
      motionVal.set(target);
      return;
    }
    const controls = animate(motionVal, target, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [inView, target, motionVal, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {unit}
    </span>
  );
}

// ─── Single card ─────────────────────────────────────────────────────────────

function KpiCard({ item, index }: { item: KpiItem; index: number }) {
  const reduced = useReducedMotion();
  const accent = item.accentColor ?? "text-gvi-gold";
  const Icon = item.icon;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className="group rounded-xl border border-gvi-gold/15 bg-gvi-deep p-5 hover:border-gvi-gold/30 hover:shadow-lg hover:shadow-gvi-gold/5 transition-colors duration-300"
    >
      {/* Icon + value row */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gvi-gold/10 ${accent} group-hover:bg-gvi-gold/20 transition-colors`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <dd className={`text-2xl font-semibold leading-none ${accent}`}>
            {typeof item.value === "number" ? (
              <AnimatedNumber target={item.value} unit={item.unit} />
            ) : (
              <span>{item.value}{item.unit}</span>
            )}
          </dd>
          <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-gvi-silver/70">
            {item.label}
          </dt>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-gvi-silver/65">{item.description}</p>

      {/* Bottom accent bar */}
      <div className="mt-4 h-px bg-gradient-to-r from-gvi-gold/30 to-transparent group-hover:from-gvi-gold/60 transition-colors duration-300" />
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface KpiDashboardProps {
  items: readonly KpiItem[];
  /** Số cột tối đa ở desktop. Mặc định: tự động theo số items */
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KpiDashboard({ items, columns, className = "" }: KpiDashboardProps) {
  const cols = columns ?? Math.min(items.length, 4);
  const gridCols: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <dl
      className={`grid gap-4 ${gridCols[cols] ?? "sm:grid-cols-3"} ${className}`}
      aria-label="Tổng quan KPI"
    >
      {items.map((item, i) => (
        <KpiCard key={item.label} item={item} index={i} />
      ))}
    </dl>
  );
}

export default KpiDashboard;
