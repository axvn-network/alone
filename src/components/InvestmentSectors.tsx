"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const sectors = [
  { title: "Bất Động Sản", desc: "Đầu tư bất động sản nhà ở, thương mại, nghỉ dưỡng và tài sản tạo dòng tiền tại Dubai, UAE và quốc tế.", image: "/1.png", className: "md:col-span-2 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Thâu Tóm Doanh Nghiệp (M&A)", desc: "Doanh nghiệp lâu năm có vận hành ổn định, nhu cầu thị trường cao và cơ hội mở rộng quy mô rõ ràng.", image: "/3.png", className: "md:col-span-1 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Đầu Tư Tư Nhân (Private Equity)", desc: "Đầu tư chiến lược vào các công ty tư nhân có ban lãnh đạo năng lực và mô hình kinh doanh mở rộng.", image: "/4.png", className: "md:col-span-1 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Công Nghệ AI & Đột Phá", desc: "Doanh nghiệp công nghệ, nền tảng số và các giải pháp đổi mới sáng tạo giải quyết bài toán thị trường.", image: "/6.png", className: "md:col-span-2 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Khách Sạn & Nghỉ Dưỡng", desc: "Khách sạn, căn hộ dịch vụ, du lịch, ẩm thực F&B và dịch vụ phong cách sống cao cấp.", image: "/5.png", className: "md:col-span-2 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Tài Sản Số & Blockchain", desc: "Hạ tầng blockchain, nền tảng tài sản số, mã hóa tài sản (tokenization) và công nghệ tài chính Fintech.", image: "/2.png", className: "md:col-span-1 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Năng Lượng & Hàng Hóa", desc: "Đầu tư vào sản phẩm năng lượng, hàng hóa vật chất và mạng lưới cung ứng phân phối toàn cầu.", image: "/7.png", className: "md:col-span-1 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Tài Sản Sang Trọng & Bất Động Sản Hạng Sang", desc: "Bất động sản siêu sang, du thuyền, phi cơ, xe cao cấp và sản phẩm dịch vụ xa xỉ.", image: "/8.png", className: "md:col-span-2 h-[220px] sm:h-[280px] md:h-[380px]" },
  { title: "Quản Lý Đầu Tư Chiến Lược", desc: "Liên doanh, đồng đầu tư và liên minh chiến lược với các đối tác định chế tài chính uy tín.", image: "/9.png", className: "md:col-span-3 h-[220px] sm:h-[280px] md:h-[380px]" },
];

const cardHoverVariants = {
  rest: { y: 0, borderColor: "rgba(201,162,74,0.05)" },
  hover: { y: -6, borderColor: "rgba(201,162,74,0.35)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", transition: { type: "spring", stiffness: 300, damping: 22 } },
} as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function InvestmentSectors() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative py-16 md:py-28 overflow-hidden bg-fortress-navy rounded-2xl mx-4 my-8"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <Stagger>
          <StaggerItem>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
              <div>
                <span className="block text-fortress-gold text-xs tracking-[6px] uppercase mb-4 font-semibold">
                  03 - Lĩnh Vực Đầu Tư
                </span>
                <h2 className="text-2xl md:text-5xl font-light text-fortress-ivory leading-tight uppercase tracking-tight">
                  Tầm Nhìn Đầu Tư Đa Ngành
                </h2>
              </div>
              <p className="text-fortress-silver/80 text-base md:text-lg leading-relaxed max-w-[500px]">
                Fortress Investment Holdings tập trung vào các lĩnh vực mà nguồn vốn, kinh nghiệm và sự tham gia chiến lược của chúng tôi có thể mang lại giá trị đo lường được.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sectors.map((sector, index) => (
                <motion.div
                  key={sector.title}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className={`group relative overflow-hidden bg-fortress-deep border border-fortress-gold/5 flex flex-col justify-end p-6 md:p-10 rounded-sm cursor-default ${sector.className}`}
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
                    <span className="text-fortress-gold text-[10px] tracking-[4px] uppercase font-semibold block mb-2">
                      Lĩnh vực {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold text-fortress-ivory mb-3">
                      {sector.title}
                    </h3>
                    <p className="text-fortress-silver/70 text-sm leading-relaxed max-w-md transition-colors duration-300 group-hover:text-fortress-silver">
                      {sector.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-12 flex justify-center">
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
                  XEM TẤT CẢ LĨNH VỰC ĐẦU TƯ
                </Link>
              </motion.div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </motion.section>
  );
}
