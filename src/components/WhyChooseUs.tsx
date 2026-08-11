"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const defaultWhyData: {
  whyTag: string;
  whyTitle: string;
  whyBenefits: { title: string; desc: string }[];
} = {
  whyTag: "",
  whyTitle: "",
  whyBenefits: [],
};

export default function WhyChooseUs() {
  const { content } = usePageContent("home", defaultWhyData);
  const { lang } = useLang();

  const whyTag   = content.whyTag   || t("why.tag",   lang);
  const whyTitle = content.whyTitle || t("why.title", lang);

  // Nguồn duy nhất: CMS → i18n benefits — không hardcode ở đây
  const i18nBenefits = (t("why.benefits", lang) as unknown as { title: string; desc: string }[] | string);
  const fallbackBenefits = Array.isArray(i18nBenefits) ? i18nBenefits : [];
  const benefitList = (content.whyBenefits && Array.isArray(content.whyBenefits) && content.whyBenefits.length > 0)
    ? content.whyBenefits
    : fallbackBenefits;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="absolute inset-0 bg-gvi-deep" />
      <div className="relative max-w-[1280px] mx-auto section-px">
        <Stagger>
          <StaggerItem>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-gvi-gold/60" />
              <span className="section-tag">{whyTag}</span>
            </div>
          </StaggerItem>
          <StaggerItem>
            <h2
              className="font-light text-gvi-ivory mb-10 md:mb-14 leading-[1.28] uppercase"
              style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
            >
              {whyTitle}
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-10">
              {benefitList.map((item, i) => (
                <motion.div
                  key={i}
                  className="group cursor-default"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <motion.div
                    className="h-px w-8 bg-gvi-gold/30 mb-4"
                    whileHover={{ width: "3rem", backgroundColor: "rgba(201,162,74,0.7)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <h3
                    className="font-semibold text-gvi-gold mb-3 transition-colors duration-300 group-hover:text-gvi-champagne leading-[1.4]"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-gvi-silver/65 leading-[1.8] transition-colors duration-300 group-hover:text-gvi-silver/85"
                    style={{ fontSize: "var(--text-body)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </StaggerItem>
        </Stagger>
      </div>
      <div className="section-divider mt-16 md:mt-28 max-w-[1280px] mx-auto" />
    </motion.section>
  );
}
