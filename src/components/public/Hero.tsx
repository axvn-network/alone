"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const heroContainerVariants = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const heroChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.6 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const heroButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

import { usePageContent } from "@/hooks/usePageContent";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const defaultHeroData = {
  heroSubtitle: "",
  heroTitleLine1: "",
  heroTitleLine2: "",
  heroDescription: "",
  heroBtn1Text: "",
  heroBtn2Text: "",
};

export default function Hero() {
  const { content } = usePageContent("home", defaultHeroData);
  const { lang } = useLang();
  const heroSubtitle = content.heroSubtitle || t("hero.subtitle", lang);
  const heroTitleLine1 = content.heroTitleLine1 || t("hero.titleLine1", lang);
  const heroTitleLine2 = content.heroTitleLine2 || t("hero.titleLine2", lang);
  const heroDescription = content.heroDescription || t("hero.description", lang);
  const heroBtn1Text = content.heroBtn1Text || t("hero.btn1", lang);
  const heroBtn2Text = content.heroBtn2Text || t("hero.btn2", lang);

  return (
    <motion.section
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center justify-center overflow-hidden bg-gvi-navy"
      style={{
        minHeight: "var(--hero-min-height)",
        paddingTop: "var(--hero-pt)",
        paddingBottom: "var(--hero-pb)",
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
      }}
    >
      {/* Background image with layered gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero-Background.png"
          alt="GVI Tech Holding"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gvi-navy/80 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gvi-navy/95 via-gvi-navy/85 md:via-gvi-navy/80 to-gvi-navy/60 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gvi-navy/80 via-transparent to-gvi-navy/30" />
      </div>

      {/* Subtle animated grain texture overlay */}
      <motion.div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content centred on mobile, left-aligned on md+ */}
      <motion.div
        variants={heroChildrenVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center md:items-start md:text-left"
      >
        {/* Eyebrow tag */}
        <motion.div variants={heroItemVariants} className="flex items-center gap-3 mb-5 md:mb-7">
          <div className="w-6 h-px bg-gvi-gold/70" />
          <span
            className="section-tag"
            style={{ letterSpacing: "var(--tracking-tag)" }}
          >
            {heroSubtitle}
          </span>
        </motion.div>

        <motion.h1
          variants={heroItemVariants}
          className="text-white font-light leading-[1.22] uppercase mb-5 md:mb-9 w-full md:max-w-[900px]"
          style={{
            fontSize: "var(--text-display)",
            letterSpacing: "var(--tracking-display)",
          }}
        >
          {heroTitleLine1}<br />
          <span className="font-bold bg-gradient-to-r from-gvi-gold via-gvi-champagne to-gvi-gold bg-clip-text text-transparent bg-[length:200%_100%]"
            style={{ backgroundPosition: "0% 50%" }}
          >
            {heroTitleLine2}
          </span>
        </motion.h1>

        {/* Thin gold rule under heading */}
        <motion.div
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.9 } } }}
          className="w-16 h-px bg-gradient-to-r from-gvi-gold to-transparent mb-5 md:mb-8 origin-left"
        />

        <motion.p
          variants={heroItemVariants}
          className="text-gvi-silver/85 w-full md:max-w-2xl leading-[1.75] mb-8 md:mb-11 font-light"
          style={{ fontSize: "var(--text-lead)" }}
        >
          {heroDescription}
        </motion.p>

        <motion.div variants={heroButtonVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Link
              href="/investment-focus"
              className="block w-full sm:w-auto px-7 sm:px-9 py-4 md:py-4.5 bg-gradient-to-r from-gvi-gold to-gvi-champagne text-gvi-navy font-bold text-xs uppercase hover:opacity-90 transition-opacity shadow-lg shadow-gvi-gold/20 text-center"
              style={{ letterSpacing: "var(--tracking-btn)" }}
            >
              {heroBtn1Text}
            </Link>
          </motion.div>
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Link
              href="/invest-with-gvi"
              className="block w-full sm:w-auto px-7 sm:px-9 py-4 md:py-4.5 border border-gvi-silver/35 text-gvi-ivory font-semibold text-xs uppercase hover:bg-white/8 hover:border-gvi-silver/70 transition-all backdrop-blur-sm text-center"
              style={{ letterSpacing: "var(--tracking-btn)" }}
            >
              {heroBtn2Text}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated decorative gold line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gvi-gold/40 to-transparent z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 1.2 }}
      />
    </motion.section>
  );
}
