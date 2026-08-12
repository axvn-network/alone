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
  newsDescription: "Cập nhật góc nhìn thị trường, phân tích xu hướng đầu tư và tin tức mới nhất từ GVI – gửi tới bạn khi có giá trị thực sự.",
  newsBtnText: "ĐĂNG KÝ",
  newsDisclaimer: "Bằng cách đăng ký, bạn đồng ý nhận các thông tin từ GVI Tech Holding. Bạn có thể hủy đăng ký bất kỳ lúc nào.",
  newsPlaceholder: "Địa chỉ email của bạn",
  newsSuccessTitle: "Cảm ơn bạn đã đăng ký.",
  newsSuccessDesc: "Chúng tôi sẽ gửi tới bạn những góc nhìn chuyên sâu quan trọng nhất.",
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { content } = usePageContent("home", defaultNewsData);
  const { lang } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Contact",
          name: email.split("@")[0],
          email,
          message: "Newsletter subscription",
          subject: "Newsletter Subscription",
          consentGiven: true,
          consentTimestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Best-effort — still show success to user; server logs the error
    } finally {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }
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
      <div className="absolute inset-0 bg-gvi-deep" />
      <div className="section-divider max-w-[1400px] mx-auto" />

      <div className="relative max-w-[1400px] mx-auto section-px">
        <div className="max-w-[600px] mx-auto text-center">
          <Stagger>
            <StaggerItem>
                <h2
                  className="font-light text-gvi-ivory mb-5 uppercase leading-[1.28]"
                  style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
                >
                  {content.newsTitle}
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="text-gvi-silver/65 leading-[1.8] mb-9" style={{ fontSize: "var(--text-body)" }}>
                  {content.newsDescription}
                </p>
              </StaggerItem>
            <StaggerItem>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="py-6 px-8 border border-gvi-gold/30 bg-gvi-gold/5 rounded-sm"
                >
                  <p className="text-gvi-gold font-semibold text-sm tracking-widest uppercase">{content.newsSuccessTitle || t("newsletter.successTitle", lang)}</p>
                  <p className="text-gvi-silver/60 text-xs mt-2">{content.newsSuccessDesc || t("newsletter.successDesc", lang)}</p>
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
                    className="w-full sm:flex-1 px-5 py-3.5 bg-gvi-navy border border-gvi-gold/20 text-gvi-ivory text-sm placeholder:text-gvi-silver/40 focus:outline-none focus:border-gvi-gold/50 transition-colors"
                    whileFocus={{ borderColor: "rgba(201,162,74,0.5)", backgroundColor: "rgba(201,162,74,0.03)" }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gvi-gold text-gvi-navy font-bold text-sm tracking-widest cursor-pointer disabled:opacity-60"
                    whileHover={{ backgroundColor: "#E6C879", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-gvi-navy/30 border-t-gvi-navy rounded-full animate-spin" />
                        {content.newsBtnText}
                      </span>
                    ) : content.newsBtnText}
                  </motion.button>
                </form>
              )}
            </StaggerItem>
            <StaggerItem>
              <p className="text-gvi-silver/30 text-xs mt-4">
                {content.newsDisclaimer}
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </motion.section>
  );
}
