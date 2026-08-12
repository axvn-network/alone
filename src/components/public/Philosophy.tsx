"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const cardVariants = {
  rest: { y: 0, borderColor: "rgba(201,162,74,0.10)" },
  hover: {
    y: -8,
    borderColor: "rgba(201,162,74,0.40)",
    boxShadow: "0 24px 48px rgba(201,162,74,0.07)",
    transition: { type: "spring" as const, stiffness: 320, damping: 20 },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const defaultPhilData: {
  philTag: string;
  philTitle: string;
  philDesc: string;
  philQuote: string;
  philCommitments: { title: string; desc: string; number: string }[];
} = {
  philTag: "", philTitle: "", philDesc: "", philQuote: "", philCommitments: [],
};

export default function Philosophy() {
  const { content } = usePageContent("home", defaultPhilData);
  const { lang } = useLang();

  const philTag   = content.philTag   || t("philosophy.tag",   lang);
  const philTitle = content.philTitle || t("philosophy.title", lang);
  const philDesc  = content.philDesc  || t("philosophy.desc",  lang);
  const philQuote = content.philQuote || t("philosophy.quote", lang);

  // Nguồn duy nhất: CMS → i18n commitments — không hardcode ở đây
  const i18nCommitments = (t("philosophy.commitments", lang) as unknown as { title: string; desc: string; number: string }[] | string);
  const fallbackCommitments = Array.isArray(i18nCommitments) ? i18nCommitments : [];
  const commitmentList = (content.philCommitments && Array.isArray(content.philCommitments) && content.philCommitments.length > 0)
    ? content.philCommitments
    : fallbackCommitments;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-gvi-navy border-t border-gvi-gold/10 rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <div className="max-w-[900px] mx-auto">
          <Stagger>
            <StaggerItem>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-px bg-gvi-gold/60" />
                <span className="section-tag">{philTag}</span>
                <div className="w-6 h-px bg-gvi-gold/60" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h2
                className="text-gvi-ivory text-center font-light mb-7 md:mb-9 uppercase leading-[1.28]"
                style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
              >
                {philTitle}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p
                className="text-gvi-silver/80 leading-[1.8] text-center max-w-[680px] mx-auto mb-12 md:mb-16"
                style={{ fontSize: "var(--text-lead)" }}
              >
                {philDesc}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {commitmentList.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                    className="text-center border bg-gvi-deep rounded-sm cursor-default"
                    style={{ padding: "var(--card-padding)" }}
                  >
                    <motion.span
                      className="text-gvi-gold/30 font-thin block mb-5 leading-none tracking-tight"
                      style={{ fontSize: "var(--text-display-num)" }}
                      whileHover={{ color: "rgba(201,162,74,0.7)", scale: 1.04 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.number}
                    </motion.span>
                    <h3
                      className="font-semibold text-gvi-ivory mb-4 leading-[1.4]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gvi-silver/70 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-10 md:mt-14 flex justify-center">
                <p
                  className="text-gvi-silver/45 leading-[1.8] text-center max-w-[560px] italic border-t border-gvi-gold/10 pt-8"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {philQuote}
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
