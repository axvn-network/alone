"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

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

export default function WhatWeDo() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative py-16 md:py-28 overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 mx-2 sm:mx-4 my-8 md:my-12 rounded-2xl"
    >
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <Stagger>
          <StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-12 md:mb-20">
              <div>
                <span className="block text-fortress-gold text-xs tracking-[6px] uppercase mb-4 font-semibold">
                  02 - Năng Lực Cốt Lõi
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-fortress-ivory leading-tight uppercase tracking-tight">
                  Quản Lý Đầu Tư Chiến Lược
                </h2>
                <p className="text-fortress-gold text-sm sm:text-base md:text-lg font-medium mt-3">
                  Kỷ Luật Phân Bổ Vốn. Kiến Tạo Giá Trị Bền Vững.
                </p>
              </div>
              <div className="space-y-4 lg:self-end">
                <p className="text-fortress-silver/80 text-sm sm:text-base md:text-lg leading-relaxed">
                  Chúng tôi xác định và quản lý các cơ hội đầu tư được lựa chọn kỹ lưỡng trên nhiều lĩnh vực, chú trọng kiểm soát rủi ro, tối ưu hóa dòng tiền và tăng trưởng vốn dài hạn.
                </p>
                <p className="text-fortress-silver/80 text-sm sm:text-base md:text-lg leading-relaxed">
                  Phương pháp tiếp cận được thiết kế dành cho các nhà đầu tư tìm kiếm sự tham gia chuyên nghiệp vào các doanh nghiệp, dự án và tài sản cao cấp tại UAE và toàn cầu.
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {cards.map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  className="group p-6 sm:p-8 md:p-10 border bg-fortress-deep cursor-pointer rounded-sm flex flex-col"
                >
                  <div className="flex-1 flex flex-col">
                    <span className="text-fortress-gold/45 text-[10px] tracking-[4px] uppercase font-semibold block mb-2">
                      Trọng Tâm {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-fortress-ivory mb-3">
                      {item.title}
                    </h3>
                    <p className="text-fortress-silver/70 text-sm sm:text-base leading-relaxed flex-1">
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
