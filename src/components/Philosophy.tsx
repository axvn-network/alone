"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const commitments = [
  { title: "Nhận Diện Cơ Hội", desc: "Tìm kiếm và sàng lọc các cơ hội tiềm năng nhất thuộc các ngành trọng điểm.", number: "01" },
  { title: "Thẩm Định Chuyên Sâu", desc: "Đánh giá chi tiết rủi ro, sức mạnh thị trường và tiềm năng tạo giá trị.", number: "02" },
  { title: "Đột Phá Tăng Trưởng", desc: "Thúc đẩy giá trị vốn và dòng tiền dài hạn thông qua quản trị và nguồn lực.", number: "03" },
];

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

import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const defaultPhilData: {
  philTag: string; philTitle: string; philDesc: string; philQuote: string;
  philCommitments: { title: string; desc: string; number: string }[];
} = {
  philTag: "", philTitle: "", philDesc: "", philQuote: "", philCommitments: commitments,
};

export default function Philosophy() {
  const { content } = usePageContent("home", defaultPhilData);
  const { lang } = useLang();
  const philTag = content.philTag || t("philosophy.tag", lang);
  const philTitle = content.philTitle || t("philosophy.title", lang);
  const philDesc = content.philDesc || t("philosophy.desc", lang);
  const philQuote = content.philQuote || t("philosophy.quote", lang);
  const commitmentList = content.philCommitments && Array.isArray(content.philCommitments) ? content.philCommitments : commitments;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <div className="max-w-[900px] mx-auto">
          <Stagger>
            <StaggerItem>
              <span
                className="block text-center text-fortress-gold uppercase mb-6 font-semibold tracking-[6px]"
                style={{ fontSize: "clamp(0.625rem, 0.5vw + 0.45rem, 0.75rem)" }}
              >
                {philTag}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2
                className="text-fortress-ivory text-center font-light mb-6 md:mb-8 uppercase tracking-tight leading-tight"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {philTitle}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p
                className="text-fortress-silver/80 leading-relaxed text-center max-w-[700px] mx-auto mb-10 md:mb-14"
                style={{ fontSize: "var(--text-lead)" }}
              >
                {philDesc}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {commitmentList.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                    className="text-center border bg-fortress-deep rounded-sm cursor-default"
                    style={{ padding: "clamp(1.25rem, 2vw + 0.5rem, 2rem)" }}
                  >
                    <motion.span
                      className="text-fortress-gold/40 font-light block mb-5 leading-none"
                      style={{ fontSize: "clamp(2.5rem, 3vw + 1rem, 3.5rem)" }}
                      whileHover={{ color: "rgba(201,162,74,0.75)", scale: 1.05 }}
                      transition={{ duration: 0.25 }}
                    >
                      {item.number}
                    </motion.span>
                    <h3
                      className="font-semibold text-fortress-ivory mb-4"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-fortress-silver/70 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <p
                className="text-fortress-silver/50 leading-relaxed text-center max-w-[600px] mx-auto mt-8 md:mt-12 italic"
                style={{ fontSize: "var(--text-body)" }}
              >
                {philQuote}
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
