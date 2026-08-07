"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const sectors = [
  { title: "Bất Động Sản", desc: "Đầu tư bất động sản nhà ở, thương mại, nghỉ dưỡng và tài sản tạo dòng tiền tại Dubai, UAE và quốc tế.", image: "/1.png", colSpan: "md:col-span-2" },
  { title: "Thâu Tóm Doanh Nghiệp (M&A)", desc: "Doanh nghiệp lâu năm có vận hành ổn định, nhu cầu thị trường cao và cơ hội mở rộng quy mô rõ ràng.", image: "/3.png", colSpan: "md:col-span-1" },
  { title: "Đầu Tư Tư Nhân (Private Equity)", desc: "Đầu tư chiến lược vào các công ty tư nhân có ban lãnh đạo năng lực và mô hình kinh doanh mở rộng.", image: "/4.png", colSpan: "md:col-span-1" },
  { title: "Công Nghệ AI & Đột Phá", desc: "Doanh nghiệp công nghệ, nền tảng số và các giải pháp đổi mới sáng tạo giải quyết bài toán thị trường.", image: "/6.png", colSpan: "md:col-span-2" },
  { title: "Khách Sạn & Nghỉ Dưỡng", desc: "Khách sạn, căn hộ dịch vụ, du lịch, ẩm thực F&B và dịch vụ phong cách sống cao cấp.", image: "/5.png", colSpan: "md:col-span-2" },
  { title: "Tài Sản Số & Blockchain", desc: "Hạ tầng blockchain, nền tảng tài sản số, mã hóa tài sản (tokenization) và công nghệ tài chính Fintech.", image: "/2.png", colSpan: "md:col-span-1" },
  { title: "Năng Lượng & Hàng Hóa", desc: "Đầu tư vào sản phẩm năng lượng, hàng hóa vật chất và mạng lưới cung ứng phân phối toàn cầu.", image: "/7.png", colSpan: "md:col-span-1" },
  { title: "Tài Sản Sang Trọng & Bất Động Sản Hạng Sang", desc: "Bất động sản siêu sang, du thuyền, phi cơ, xe cao cấp và sản phẩm dịch vụ xa xỉ.", image: "/8.png", colSpan: "md:col-span-2" },
  { title: "Quản Lý Đầu Tư Chiến Lược", desc: "Liên doanh, đồng đầu tư và liên minh chiến lược với các đối tác định chế tài chính uy tín.", image: "/9.png", colSpan: "md:col-span-3" },
];

const cardHoverVariants = {
  rest: { y: 0, borderColor: "rgba(201,162,74,0.05)" },
  hover: { y: -6, borderColor: "rgba(201,162,74,0.35)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", transition: { type: "spring", stiffness: 300, damping: 22 } },
} as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultSectorsData = {
  sectorsTag: "03 - Lĩnh Vực Đầu Tư",
  sectorsTitle: "Tầm Nhìn Đầu Tư Đa Ngành",
  sectorsDesc: "Fortress Investment Holdings tập trung vào các lĩnh vực mà nguồn vốn, kinh nghiệm và sự tham gia chiến lược của chúng tôi có thể mang lại những giá trị đo lường được.",
  sectorsList: sectors,
  sectorsBtnText: "XEM TẤT CẢ LĨNH VỰC ĐẦU TƯ",
};

export default function InvestmentSectors() {
  const { content } = usePageContent("home", defaultSectorsData);
  const { lang } = useLang();
  const list = content.sectorsList && Array.isArray(content.sectorsList) ? content.sectorsList : sectors;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden bg-fortress-navy rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="relative max-w-[1400px] mx-auto section-px">
        <Stagger>
          <StaggerItem>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4 md:gap-6">
              <div>
                <span
                  className="block text-fortress-gold uppercase mb-4 font-semibold tracking-[6px]"
                  style={{ fontSize: "clamp(0.625rem, 0.5vw + 0.45rem, 0.75rem)" }}
                >
                  {content.sectorsTag}
                </span>
                <h2
                  className="text-fortress-ivory font-light leading-tight uppercase tracking-tight"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {content.sectorsTitle}
                </h2>
              </div>
              <p
                className="text-fortress-silver/80 leading-relaxed max-w-[500px]"
                style={{ fontSize: "var(--text-body)" }}
              >
                {content.sectorsDesc}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Bento grid: 3 columns on md+, single column stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {list.map((sector, index) => {
                /* On mobile every card is full-width; colSpan applies from md+ */
                const colSpan = (sector as typeof sectors[0]).colSpan ?? "";
                return (
                  <motion.div
                    key={sector.title}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    /* fluid card height: 220px → 380px */
                    className={`group relative overflow-hidden bg-fortress-deep border border-fortress-gold/5 flex flex-col justify-end rounded-sm cursor-default ${colSpan}`}
                    style={{
                      padding: "clamp(1.25rem, 2vw + 0.5rem, 2.5rem)",
                      minHeight: "clamp(13.75rem, 18vw + 4rem, 23.75rem)",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 z-0 overflow-hidden"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Image
                        src={sector.image}
                        alt={sector.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-fortress-navy via-fortress-navy/80 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-90" />

                    <motion.div
                      className="relative z-20"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <span
                        className="text-fortress-gold uppercase font-semibold block mb-2 tracking-[4px]"
                        style={{ fontSize: "clamp(0.5625rem, 0.3vw + 0.45rem, 0.625rem)" }}
                      >
                        {t("sectors.sectorPrefix", lang)} {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="font-semibold text-fortress-ivory mb-3"
                        style={{ fontSize: "var(--text-h3)" }}
                      >
                        {sector.title}
                      </h3>
                      <p
                        className="text-fortress-silver/70 leading-relaxed max-w-md transition-colors duration-300 group-hover:text-fortress-silver"
                        style={{ fontSize: "var(--text-body)" }}
                      >
                        {sector.desc}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
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
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border border-fortress-gold text-fortress-gold hover:bg-fortress-gold hover:text-fortress-navy text-xs sm:text-sm tracking-widest font-semibold transition-colors duration-300 rounded-sm"
                >
                  {content.sectorsBtnText}
                </Link>
              </motion.div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </motion.section>
  );
}
