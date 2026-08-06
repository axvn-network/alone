"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const goldenDivider = {
  hidden: { scaleX: 0, transformOrigin: "left" as const },
  visible: { scaleX: 1, transformOrigin: "left" as const, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 } },
};

const imageVariant = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultIntroData = {
  introTag: "01 - Giới thiệu",
  introTitle: "Nền Tảng Vững Chắc Cho Mọi Khoản Đầu Tư",
  introParagraph1: "Một doanh nghiệp vĩ đại hiếm khi được xây dựng chỉ bằng nguồn vốn đơn thuần. Nó được kiến tạo bởi những con người biết kết hợp nguồn lực với sự nhạy bén, kiên nhẫn và cam kết dài lâu.",
  introParagraph2: "Đó chính là triết lý cốt lõi của Fortress Investment Holdings.",
  introParagraph3: "Chúng tôi được thành lập nhằm tạo dựng một nền tảng đầu tư, thâu tóm và tăng trưởng bền vững tại UAE và các thị trường quốc tế chiến lược. Mỗi khoản đầu tư của chúng tôi không chỉ nhận được nguồn vốn dồi dào mà còn là sự đồng hành chiến lược cùng mạng lưới đối tác toàn cầu.",
};

export default function Introduction() {
  const { content } = usePageContent("home", defaultIntroData);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-16 md:py-28 overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 mx-2 sm:mx-4 my-8 md:my-12 rounded-2xl"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Stagger>
            <StaggerItem>
              <span className="block text-fortress-gold text-xs tracking-[6px] uppercase font-semibold">
                {content.introTag}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-2xl md:text-5xl font-light text-fortress-ivory leading-tight uppercase tracking-tight mt-4">
                {content.introTitle}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <motion.div variants={goldenDivider} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-0.5 w-12 bg-fortress-gold/30 my-6" />
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/90 text-base md:text-lg leading-relaxed mb-4">
                {content.introParagraph1}
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/90 text-base md:text-lg leading-relaxed mb-4">
                {content.introParagraph2}
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/80 text-base leading-relaxed">
                {content.introParagraph3}
              </p>
            </StaggerItem>
          </Stagger>

          <motion.div
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-fortress-gold/10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <Image
                src="/website image.png"
                alt="Fortress Investment Holdings leadership"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-fortress-navy/20" />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-fortress-gold/60" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-fortress-gold/60" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
