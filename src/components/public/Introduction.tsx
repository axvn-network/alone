"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const goldenDivider = {
  hidden: { scaleX: 0, transformOrigin: "left" as const },
  visible: { scaleX: 1, transformOrigin: "left" as const, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 } },
};

const imageVariant = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 } },
};

import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const defaultIntroData = {
  introTag: "", introTitle: "", introParagraph1: "", introParagraph2: "", introParagraph3: "",
};

export default function Introduction() {
  const { content } = usePageContent("home", defaultIntroData);
  const { lang } = useLang();
  const introTag = content.introTag || t("intro.tag", lang);
  const introTitle = content.introTitle || t("intro.title", lang);
  const introParagraph1 = content.introParagraph1 || t("intro.p1", lang);
  const introParagraph2 = content.introParagraph2 || t("intro.p2", lang);
  const introParagraph3 = content.introParagraph3 || t("intro.p3", lang);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-gvi-navy border-t border-gvi-gold/10 rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <Stagger>
            <StaggerItem>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-gvi-gold/60" />
                  <span className="section-tag">{introTag}</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <h2
                  className="text-gvi-ivory font-light leading-[1.28] uppercase mt-5"
                  style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
                >
                  {introTitle}
                </h2>
              </StaggerItem>
              <StaggerItem>
                <motion.div variants={goldenDivider} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-px w-10 bg-gvi-gold/40 my-7" />
              </StaggerItem>
              <StaggerItem>
                <p className="text-gvi-silver/85 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                  {introParagraph1}
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-gvi-silver/85 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                  {introParagraph2}
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-gvi-silver/70 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                  {introParagraph3}
                </p>
              </StaggerItem>
          </Stagger>

          <motion.div
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-sm border border-gvi-gold/10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <Image
                src="/website image.png"
                alt="GVI Tech Holding leadership"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gvi-navy/20" />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gvi-gold/60" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gvi-gold/60" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
