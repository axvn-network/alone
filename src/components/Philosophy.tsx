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

export default function Philosophy() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative py-16 md:py-28 overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 rounded-2xl mx-4 my-8"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-[900px] mx-auto">
          <Stagger>
            <StaggerItem>
              <span className="block text-center text-fortress-gold text-xs tracking-[6px] uppercase mb-6 font-semibold">
                05 - Phương Pháp Tiếp Cận
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-2xl md:text-5xl font-light text-fortress-ivory text-center mb-6 md:mb-8 uppercase tracking-tight leading-tight">
                Trụ Cột Kiến Tạo Giá Trị
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/80 text-lg leading-relaxed text-center max-w-[700px] mx-auto mb-10 md:mb-16">
                Chúng tôi kiến tạo giá trị dài hạn thông qua chiến lược kỷ luật, mối quan hệ đối tác tin cậy và quyết định mang tầm vóc định chế.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="grid md:grid-cols-3 gap-8">
                {commitments.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                    className="text-center p-6 md:p-8 border bg-fortress-deep rounded-sm cursor-default"
                  >
                    <motion.span
                      className="text-fortress-gold/40 text-5xl font-light block mb-5 leading-none"
                      whileHover={{ color: "rgba(201,162,74,0.75)", scale: 1.05 }}
                      transition={{ duration: 0.25 }}
                    >
                      {item.number}
                    </motion.span>
                    <h3 className="text-xl font-semibold text-fortress-ivory mb-4">{item.title}</h3>
                    <p className="text-fortress-silver/70 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/50 text-sm leading-relaxed text-center max-w-[600px] mx-auto mt-8 md:mt-12 italic">
                "Nếu không thể tạo thêm giá trị thực tiễn vượt trên nguồn vốn, đó không phải là cơ hội dành cho Fortress."
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
