"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

import { usePageContent } from "@/hooks/usePageContent";

const defaultNewsData = {
  newsTitle: "Đăng Ký Nhận Bản Tin Chuyên Sâu",
  newsDescription: "Cập nhật góc nhìn thị trường, phân tích xu hướng đầu tư và tin tức mới nhất từ Fortress – gửi tới bạn khi có giá trị thực sự.",
  newsBtnText: "ĐĂNG KÝ",
  newsDisclaimer: "Bằng cách đăng ký, bạn đồng ý nhận các thông tin từ Fortress Investment Holdings. Bạn có thể hủy đăng ký bất kỳ lúc nào.",
  newsPlaceholder: "Địa chỉ email của bạn",
  newsSuccessTitle: "Cảm ơn bạn đã đăng ký.",
  newsSuccessDesc: "Chúng tôi sẽ gửi tới bạn những góc nhìn chuyên sâu quan trọng nhất.",
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { content } = usePageContent("home", defaultNewsData);
  const { lang } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionReveal}
      className="relative overflow-hidden rounded-2xl section-mx section-my"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="absolute inset-0 bg-fortress-deep" />
      <div className="section-divider max-w-[1280px] mx-auto" />

      <div className="relative max-w-[1280px] mx-auto section-px">
        <div className="max-w-[600px] mx-auto text-center">
          <Stagger>
            <StaggerItem>
                <h2
                  className="font-light text-fortress-ivory mb-5 uppercase leading-[1.28]"
                  style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
                >
                  {content.newsTitle}
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="text-fortress-silver/65 leading-[1.8] mb-9" style={{ fontSize: "var(--text-body)" }}>
                  {content.newsDescription}
                </p>
              </StaggerItem>
            <StaggerItem>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="py-6 px-8 border border-fortress-gold/30 bg-fortress-gold/5 rounded-sm"
                >
                  <p className="text-fortress-gold font-semibold text-sm tracking-widest uppercase">{content.newsSuccessTitle || t("newsletter.successTitle", lang)}</p>
                  <p className="text-fortress-silver/60 text-xs mt-2">{content.newsSuccessDesc || t("newsletter.successDesc", lang)}</p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row"
                >
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.newsPlaceholder || t("newsletter.placeholder", lang)}
                    required
                    className="w-full sm:flex-1 px-5 py-3.5 bg-fortress-navy border border-fortress-gold/20 text-fortress-ivory text-sm placeholder:text-fortress-silver/40 focus:outline-none focus:border-fortress-gold/50 transition-colors"
                    whileFocus={{ borderColor: "rgba(201,162,74,0.5)", backgroundColor: "rgba(201,162,74,0.03)" }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-fortress-gold text-fortress-navy font-bold text-sm tracking-widest cursor-pointer"
                    whileHover={{ backgroundColor: "#E6C879", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {content.newsBtnText}
                  </motion.button>
                </form>
              )}
            </StaggerItem>
            <StaggerItem>
              <p className="text-fortress-silver/30 text-xs mt-4">
                {content.newsDisclaimer}
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
