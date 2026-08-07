"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const cardVariants = {
  rest: { y: 0, borderColor: "rgba(201,162,74,0.10)", boxShadow: "0 0px 0px rgba(201,162,74,0)" },
  hover: { y: -6, borderColor: "rgba(201,162,74,0.35)", boxShadow: "0 20px 40px rgba(201,162,74,0.08)", transition: { type: "spring" as const, stiffness: 350, damping: 22 } },
};

const cards = [
  { title: "Phân Bổ Đầu Tư Đa Dạng", desc: "Phân bổ nguồn vốn tối ưu trên nhiều lĩnh vực tiềm năng nhằm kiến tạo một danh mục đầu tư cân bằng và bền vững." },
  { title: "Cơ Hội Tạo Dòng Tiền Đều Đặn", desc: "Tập trung tìm kiếm các cơ hội đầu tư mang lại nguồn thu nhập định kỳ và phân phối lợi nhuận cấu trúc minh bạch." },
  { title: "Đầu Tư Tăng Trưởng Vốn", desc: "Đầu tư vào các doanh nghiệp, dự án và tài sản có nền tảng thương mại vững chắc với tiềm năng tăng giá trị lâu dài." },
  { title: "Cơ Hội Thị Trường Tư Nhân", desc: "Mở ra quyền truy cập vào các cơ hội đầu tư độc quyền trên thị trường tư nhân đã qua thẩm định kỹ lưỡng." },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultWhatWeDoData: {
  whatTag: string;
  whatTitle: string;
  whatSubtitle: string;
  whatDesc1: string;
  whatDesc2: string;
  whatCards: { title: string; desc: string }[];
} = {
  whatTag: "02 - Năng Lực Cốt Lõi",
  whatTitle: "Quản Lý Đầu Tư Chiến Lược",
  whatSubtitle: "Kỷ Luật Phân Bổ Vốn. Kiến Tạo Giá Trị Bền Vững.",
  whatDesc1: "Chúng tôi xác định và quản lý các cơ hội đầu tư được lựa chọn kỹ lưỡng trên nhiều lĩnh vực, chú trọng kiểm soát rủi ro, tối ưu hóa dòng tiền và tăng trưởng vốn dài hạn.",
  whatDesc2: "Phương pháp tiếp cận được thiết kế dành cho các nhà đầu tư tìm kiếm sự tham gia chuyên nghiệp vào các doanh nghiệp, dự án và tài sản cao cấp tại UAE và toàn cầu.",
  whatCards: cards,
};

export default function WhatWeDo() {
  const { content } = usePageContent("home", defaultWhatWeDoData);
  const { lang } = useLang();
  const cardList = content.whatCards && Array.isArray(content.whatCards) ? content.whatCards : cards;

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
        <Stagger>
          <StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-10 md:mb-16">
              <div>
                <span
                  className="block text-fortress-gold uppercase mb-4 font-semibold tracking-[6px]"
                  style={{ fontSize: "clamp(0.625rem, 0.5vw + 0.45rem, 0.75rem)" }}
                >
                  {content.whatTag}
                </span>
                <h2
                  className="text-fortress-ivory font-light leading-tight uppercase tracking-tight"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {content.whatTitle}
                </h2>
                <p className="text-fortress-gold font-medium mt-3" style={{ fontSize: "var(--text-body)" }}>
                  {content.whatSubtitle}
                </p>
              </div>
              <div className="space-y-4 lg:self-end">
                <p className="text-fortress-silver/80 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
                  {content.whatDesc1}
                </p>
                <p className="text-fortress-silver/80 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
                  {content.whatDesc2}
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {cardList.map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  className="group border bg-fortress-deep cursor-pointer rounded-sm flex flex-col"
                  style={{ padding: "clamp(1.25rem, 2vw + 0.5rem, 2.5rem)" }}
                >
                  <div className="flex-1 flex flex-col">
                    <span
                      className="text-fortress-gold/45 uppercase font-semibold block mb-2 tracking-[4px]"
                      style={{ fontSize: "clamp(0.5625rem, 0.3vw + 0.45rem, 0.625rem)" }}
                    >
                      {t("whatWeDo.focusPrefix", lang)} {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-semibold text-fortress-ivory mb-3"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-fortress-silver/70 leading-relaxed flex-1" style={{ fontSize: "var(--text-body)" }}>
                      {item.desc}
                    </p>
                    <motion.div
                      className="h-px bg-gradient-to-r from-fortress-gold/60 to-transparent mt-6"
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
