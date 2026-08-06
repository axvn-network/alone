"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultCTAData = {
  ctaTag: "06 - Hợp Tác Đầu Tư",
  ctaTitle: "Cùng Nhau Kiến Tạo Giá Trị Bền Vững",
  ctaParagraph1: "Chúng tôi luôn chào đón các cơ hội hợp tác từ các chủ doanh nghiệp, nhà khởi nghiệp, nhà đầu tư, nhà phát triển dự án và đối tác chiến lược.",
  ctaParagraph2: "Dù bạn đang tìm kiếm nguồn vốn đầu tư, đề xuất cơ hội M&A thâu tóm doanh nghiệp, hay mong muốn hợp tác liên doanh dài hạn – đội ngũ chuyên gia của chúng tôi sẵn sàng thẩm định với sự bảo mật và chuyên nghiệp tuyệt đối.",
  ctaBtn1Text: "GỬI ĐỀ XUẤT ĐẦU TƯ",
  ctaBtn2Text: "LIÊN HỆ ĐỘI NGŨ CHUYÊN GIA",
};

export default function PartnershipCTA() {
  const { content } = usePageContent("home", defaultCTAData);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative py-20 md:py-32 overflow-hidden bg-fortress-navy border-t border-fortress-gold/10 rounded-2xl mx-2 sm:mx-4 my-8 md:my-12"
    >
      <div className="absolute inset-0 z-0">
        <Image src="/strategy-ideas.jpg" alt="" fill className="object-cover" loading="lazy" sizes="100vw" />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-fortress-navy/95 via-fortress-navy/90 to-fortress-navy/95" />

      <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Stagger>
            <StaggerItem>
              <span className="block text-fortress-gold text-xs tracking-[6px] uppercase mb-6 font-semibold">
                {content.ctaTag}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-2xl md:text-5xl font-light text-fortress-ivory mb-6 uppercase tracking-tight leading-tight">
                {content.ctaTitle}
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/90 text-lg leading-relaxed mb-4 max-w-[700px] mx-auto">
                {content.ctaParagraph1}
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/70 text-sm leading-relaxed mb-8 md:mb-12 max-w-[600px] mx-auto">
                {content.ctaParagraph2}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Link
                    href="/invest-with-fortress"
                    className="block px-8 py-3.5 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-sm tracking-widest shadow-lg rounded-sm hover:opacity-90 transition-opacity"
                  >
                    {content.ctaBtn1Text}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Link
                    href="/contact"
                    className="block px-8 py-3.5 border border-fortress-gold text-fortress-gold text-sm tracking-widest font-semibold hover:bg-fortress-gold/10 transition-all duration-300 rounded-sm"
                  >
                    {content.ctaBtn2Text}
                  </Link>
                </motion.div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
