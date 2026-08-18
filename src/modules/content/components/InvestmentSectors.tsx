"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Stagger from "@/shared/components/animations/Stagger";
import StaggerItem from "@/shared/components/animations/StaggerItem";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/shared/i18n";
import { usePageContent } from "@/hooks/usePageContent";

// colSpan layout cho bento grid — theo thứ tự cố định, không phụ thuộc nội dung
const COL_SPANS = [
  "md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2",
  "md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2",
  "md:col-span-3",
];

const cardHoverVariants = {
  rest: { y: 0, borderColor: "rgba(201,162,74,0.05)" },
  hover: { y: -6, borderColor: "rgba(201,162,74,0.35)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", transition: { type: "spring", stiffness: 300, damping: 22 } },
} as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

// images map theo index — tách khỏi nội dung text
const SECTOR_IMAGES = ["/1.png", "/3.png", "/4.png", "/6.png", "/5.png", "/2.png", "/7.png", "/8.png", "/9.png"];

const defaultSectorsData: {
  sectorsTag: string;
  sectorsTitle: string;
  sectorsDesc: string;
  sectorsList: { title: string; desc: string }[];
  sectorsBtnText: string;
} = {
  sectorsTag: "",
  sectorsTitle: "",
  sectorsDesc: "",
  sectorsList: [],
  sectorsBtnText: "",
};

export default function InvestmentSectors() {
  const { content } = usePageContent("home", defaultSectorsData);
  const { lang } = useLang();

  const tag = content.sectorsTag || t("sectors.tag", lang);
  const title = content.sectorsTitle || t("sectors.title", lang);
  const desc = content.sectorsDesc || t("sectors.desc", lang);
  const btnText = content.sectorsBtnText || t("sectors.btnText", lang);

  // Nguồn duy nhất: CMS → i18n list — không hardcode ở đây
  const i18nList = (t("sectors.list", lang) as unknown as { title: string; desc: string }[] | string);
  const fallbackList = Array.isArray(i18nList) ? i18nList : [];
  const list = (content.sectorsList && Array.isArray(content.sectorsList) && content.sectorsList.length > 0)
    ? content.sectorsList
    : fallbackList;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-AXVN-navy rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <Stagger>
          <StaggerItem>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4 md:gap-6">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-AXVN-gold/60" />
                  <span className="section-tag">{tag}</span>
                </div>
                <h2
                  className="text-AXVN-ivory font-light leading-[1.28] uppercase"
                  style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
                >
                  {title}
                </h2>
              </div>
              <p
                className="text-AXVN-silver/78 leading-[1.8] max-w-[480px]"
                style={{ fontSize: "var(--text-body)" }}
              >
                {desc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {list.map((sector, index) => (
                <motion.div
                  key={index}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className={`group relative overflow-hidden bg-AXVN-deep border border-AXVN-gold/5 flex flex-col justify-end rounded-sm cursor-default ${COL_SPANS[index] ?? ""}`}
                  style={{
                    padding: "var(--card-padding)",
                    minHeight: "var(--card-min-height)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 z-0 overflow-hidden"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Image
                      src={SECTOR_IMAGES[index] ?? "/1.png"}
                      alt={sector.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </motion.div>
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-AXVN-navy via-AXVN-navy/80 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-90" />

                  <motion.div
                    className="relative z-20"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span
                      className="text-AXVN-gold uppercase font-semibold block mb-2"
                      style={{ fontSize: "var(--text-caption)", letterSpacing: "var(--tracking-tag)" }}
                    >
                      {t("sectors.sectorPrefix", lang)} {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-semibold text-AXVN-ivory mb-3 leading-[1.4]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {sector.title}
                    </h3>
                    <p
                      className="text-AXVN-silver/70 leading-[1.8] max-w-md transition-colors duration-300 group-hover:text-AXVN-silver"
                      style={{ fontSize: "var(--text-body)" }}
                    >
                      {sector.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 md:mt-12 flex justify-center">
              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <Link
                  href="/investment-focus"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border border-AXVN-gold text-AXVN-gold hover:bg-AXVN-gold hover:text-AXVN-navy text-xs sm:text-sm font-semibold transition-colors duration-300 rounded-sm"
                  style={{ letterSpacing: "var(--tracking-btn)" }}
                >
                  {btnText}
                </Link>
              </motion.div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </motion.section>
  );
}
