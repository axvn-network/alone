"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  /** Eyebrow tag text, e.g. "Về Chúng Tôi" */
  tag: string;
  /** Main heading — supports JSX for gradient spans */
  heading: ReactNode;
  /** Optional sub-text below heading */
  description?: string;
  /** Optional extra content (CTA buttons, etc.) */
  children?: ReactNode;
  /** Dark variant (navy bg, light text) — default false (white bg, navy text) */
  dark?: boolean;
}

export default function PageHero({
  tag,
  heading,
  description,
  children,
  dark = false,
}: PageHeroProps) {
  return (
    <section
      className={`relative text-center overflow-hidden ${dark ? "bg-AXVN-navy border-b border-AXVN-gold/10" : "bg-white"}`}
      style={{
        paddingTop: "clamp(6rem, 8vw + 1.5rem, 9rem)",
        paddingBottom: "clamp(2.5rem, 4vw + 0.5rem, 5rem)",
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
      }}
    >
      {/* Subtle dot grid for dark variant */}
      {dark && (
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      )}
      {/* Ambient corner glows */}
      {dark && (
        <>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-AXVN-gold/8 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-AXVN-champagne/6 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </>
      )}

      <div className="relative max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div
                className={`w-5 h-px ${dark ? "bg-AXVN-gold/60" : "bg-AXVN-gold/50"}`}
              />
              <span className="section-tag">{tag}</span>
              <div
                className={`w-5 h-px ${dark ? "bg-AXVN-gold/60" : "bg-AXVN-gold/50"}`}
              />
            </div>

            {/* Heading */}
            <h1
              className={`font-light leading-[1.22] uppercase mb-5 ${dark ? "text-AXVN-ivory" : "text-AXVN-navy"}`}
              style={{
                fontSize: "var(--text-display)",
                letterSpacing: "var(--tracking-display)",
              }}
            >
              {heading}
            </h1>

            {/* Gold rule */}
            <motion.div
              initial={false}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.35,
              }}
              className={`w-10 h-px mx-auto mb-6 origin-center ${dark ? "bg-AXVN-gold/50" : "bg-AXVN-gold/40"}`}
            />

            {/* Description */}
            {description && (
              <p
                className={`leading-[1.8] max-w-2xl mx-auto ${dark ? "text-AXVN-silver/80" : "text-AXVN-charcoal/65"}`}
                style={{ fontSize: "var(--text-lead)" }}
              >
                {description}
              </p>
            )}

            {/* Optional children (CTA buttons, etc.) */}
            {children && <div className="mt-8 md:mt-10">{children}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
