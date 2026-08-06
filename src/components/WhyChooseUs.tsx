"use client";

import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const benefits = [
  { title: "Quy Trình Đầu Tư Kỷ Luật", desc: "Mọi cơ hội đều được phân tích thương mại, tài chính, vận hành và quản trị rủi ro chuyên sâu. Sự thận trọng chính là lý do các đối tác đặt trọn niềm tin vào chúng tôi." },
  { title: "Tầm Nhìn Dài Hạn Bền Vững", desc: "Chúng tôi không chạy theo lợi nhuận ngắn hạn mà ưu tiên tối đa giá trị tăng trưởng bền vững qua các chu kỳ kinh tế." },
  { title: "Chuyên Môn Đa Ngành Đa Lĩnh Vực", desc: "Cách tiếp cận đa ngành giúp chúng tôi hiểu rõ đặc thù, dòng tiền và cơ hội của từng ngành công nghiệp để tối ưu danh mục đầu tư." },
  { title: "Đồng Hành Chiến Lược Sâu Rộng", desc: "Không chỉ dừng lại ở nguồn vốn, chúng tôi đóng góp định hướng chiến lược, phát triển kinh doanh, quản trị và mạng lưới đối tác toàn cầu." },
  { title: "Đối Tác Tin Cậy & Minh Bạch", desc: "Chúng tôi xây dựng mối quan hệ dựa trên sự minh bạch, bảo mật thông tin và đôi bên cùng có lợi. Uy tín là tài sản vô giá của Fortress." },
  { title: "Thị Trường Đầy Tiềm Năng", desc: "Đặt trụ sở tại Dubai và mở rộng quốc tế, chúng tôi nằm ở trung tâm giao thoa của dòng vốn thế giới, kết nối các dự án tài sản giá trị cao." },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultWhyData = {
  whyTag: "04 - Tại Sao Chọn Fortress",
  whyTitle: "Nền Tảng Vững Chắc Cho Sự Tăng Trưởng",
  whyBenefits: benefits,
};

export default function WhyChooseUs() {
  const { content } = usePageContent("home", defaultWhyData);
  const benefitList = content.whyBenefits && Array.isArray(content.whyBenefits) ? content.whyBenefits : benefits;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative py-16 md:py-28 overflow-hidden rounded-2xl mx-2 sm:mx-4 my-8 md:my-12"
    >
      <div className="absolute inset-0 bg-fortress-deep" />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12">
        <Stagger>
          <StaggerItem>
            <span className="block text-fortress-gold/50 text-xs tracking-[6px] uppercase mb-6 font-medium">
              {content.whyTag}
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-2xl md:text-4xl font-bold text-fortress-ivory mb-8 md:mb-12 leading-tight">
              {content.whyTitle}
            </h2>
          </StaggerItem>
          <StaggerItem>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
              {benefitList.map((item) => (
                <motion.div
                  key={item.title}
                  className="group cursor-default"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <motion.div
                    className="h-px w-8 bg-fortress-gold/30 mb-4"
                    whileHover={{ width: "3rem", backgroundColor: "rgba(201,162,74,0.7)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <h3 className="text-lg font-bold text-fortress-gold mb-3 transition-colors duration-300 group-hover:text-fortress-champagne">
                    {item.title}
                  </h3>
                  <p className="text-fortress-silver/60 text-sm leading-relaxed transition-colors duration-300 group-hover:text-fortress-silver/80">
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
