"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const defaultCTAData = {
  ctaTag: "", ctaTitle: "", ctaParagraph1: "", ctaParagraph2: "", ctaBtn1Text: "", ctaBtn2Text: "",
};

export default function PartnershipCTA() {
  const { content } = usePageContent("home", defaultCTAData);
  const { lang } = useLang();
  const ctaTag = content.ctaTag || t("cta.tag", lang);
  const ctaTitle = content.ctaTitle || t("cta.title", lang);
  const ctaParagraph1 = content.ctaParagraph1 || t("cta.p1", lang);
  const ctaParagraph2 = content.ctaParagraph2 || t("cta.p2", lang);
  const ctaBtn1Text = content.ctaBtn1Text || t("cta.btn1", lang);
  const ctaBtn2Text = content.ctaBtn2Text || t("cta.btn2", lang);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="absolute inset-0 z-0">
        <Image src="/strategy-ideas.jpg" alt="" fill className="object-cover" loading="lazy" sizes="100vw" />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-fortress-navy/95 via-fortress-navy/90 to-fortress-navy/95" />

      <div className="relative z-20 max-w-[1400px] mx-auto section-px">
        <div className="max-w-[900px] mx-auto text-center">
          <Stagger>
            <StaggerItem>
              <span
                className="block text-fortress-gold uppercase mb-6 font-semibold tracking-[6px]"
                style={{ fontSize: "clamp(0.625rem, 0.5vw + 0.45rem, 0.75rem)" }}
              >
                {ctaTag}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2
                className="text-fortress-ivory font-light mb-6 uppercase tracking-tight leading-tight"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {ctaTitle}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p
                className="text-fortress-silver/90 leading-relaxed mb-4 max-w-[700px] mx-auto"
                style={{ fontSize: "var(--text-lead)" }}
              >
                {ctaParagraph1}
              </p>
            </StaggerItem>
            <StaggerItem>
              <p
                className="text-fortress-silver/70 leading-relaxed mb-8 md:mb-12 max-w-[600px] mx-auto"
                style={{ fontSize: "var(--text-body)" }}
              >
                {ctaParagraph2}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Link
                    href="/invest-with-fortress"
                    className="block px-8 py-3.5 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-sm tracking-widest shadow-lg rounded-sm hover:opacity-90 transition-opacity"
                  >
                    {ctaBtn1Text}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Link
                    href="/contact"
                    className="block px-8 py-3.5 border border-fortress-gold text-fortress-gold text-sm tracking-widest font-semibold hover:bg-fortress-gold/10 transition-all duration-300 rounded-sm"
                  >
                    {ctaBtn2Text}
                  </Link>
                </motion.div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
