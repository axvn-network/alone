"use client";

import { motion } from "framer-motion";
import Stagger from "@/shared/components/animations/Stagger";
import StaggerItem from "@/shared/components/animations/StaggerItem";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/shared/i18n";
import { usePageContent } from "@/hooks/usePageContent";

const cardVariants = {
  rest: {
    y: 0,
    borderColor: "rgba(201,162,74,0.10)",
    boxShadow: "0 0px 0px rgba(201,162,74,0)",
  },
  hover: {
    y: -6,
    borderColor: "rgba(201,162,74,0.35)",
    boxShadow: "0 20px 40px rgba(201,162,74,0.08)",
    transition: { type: "spring" as const, stiffness: 350, damping: 22 },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const defaultWhatWeDoData: {
  whatTag: string;
  whatTitle: string;
  whatSubtitle: string;
  whatDesc1: string;
  whatDesc2: string;
  whatCards: { title: string; desc: string }[];
} = {
  whatTag: "",
  whatTitle: "",
  whatSubtitle: "",
  whatDesc1: "",
  whatDesc2: "",
  whatCards: [],
};

export default function WhatWeDo() {
  const { content } = usePageContent("home", defaultWhatWeDoData);
  const { lang } = useLang();

  const tag = content.whatTag || t("whatWeDo.tag", lang);
  const title = content.whatTitle || t("whatWeDo.title", lang);
  const subtitle = content.whatSubtitle || t("whatWeDo.subtitle", lang);
  const desc1 = content.whatDesc1 || t("whatWeDo.desc1", lang);
  const desc2 = content.whatDesc2 || t("whatWeDo.desc2", lang);

  // Nguồn duy nhất: CMS → i18n cards — không hardcode ở đây
  const i18nCards = t("whatWeDo.cards", lang) as unknown as
    { title: string; desc: string }[] | string;
  const fallbackCards = Array.isArray(i18nCards) ? i18nCards : [];
  const cardList =
    content.whatCards &&
    Array.isArray(content.whatCards) &&
    content.whatCards.length > 0
      ? content.whatCards
      : fallbackCards;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-AXVN-navy border-t border-AXVN-gold/10 rounded-2xl section-mx section-my"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <Stagger>
          <StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 mb-8 md:mb-14">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-AXVN-gold/60" />
                  <span className="section-tag">{tag}</span>
                </div>
                <h2
                  className="text-AXVN-ivory font-light leading-[1.28] uppercase"
                  style={{
                    fontSize: "var(--text-h2)",
                    letterSpacing: "var(--tracking-heading)",
                  }}
                >
                  {title}
                </h2>
                <p
                  className="text-AXVN-gold/90 font-medium mt-4 leading-[1.8]"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {subtitle}
                </p>
              </div>
              <div className="space-y-5 lg:self-end">
                <p
                  className="text-AXVN-silver/80 leading-[1.8]"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {desc1}
                </p>
                <p
                  className="text-AXVN-silver/75 leading-[1.8]"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {desc2}
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardList.map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  className="group border bg-AXVN-deep cursor-pointer rounded-sm flex flex-col"
                  style={{ padding: "var(--card-padding)" }}
                >
                  <div className="flex-1 flex flex-col">
                    <span
                      className="text-AXVN-gold/45 uppercase font-semibold block mb-2"
                      style={{
                        fontSize: "var(--text-caption)",
                        letterSpacing: "var(--tracking-tag)",
                      }}
                    >
                      {t("whatWeDo.focusPrefix", lang)}{" "}
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-semibold text-AXVN-ivory mb-3 leading-[1.4]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-AXVN-silver/70 leading-[1.8] flex-1"
                      style={{ fontSize: "var(--text-body)" }}
                    >
                      {item.desc}
                    </p>
                    <motion.div
                      className="h-px bg-gradient-to-r from-AXVN-gold/60 to-transparent mt-6"
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </motion.section>
  );
}
