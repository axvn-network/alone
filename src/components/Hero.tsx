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
      className="relative flex flex-col items-center justify-center overflow-hidden bg-fortress-navy"
      style={{
        /* Fluid min-height: 85vh mobile → 100vh desktop */
        minHeight: "clamp(85vh, 92vw, 100vh)",
        /* Fluid vertical padding: 80px top → 112px; 48px bottom → 64px */
        paddingTop: "clamp(5rem, 8vw + 1rem, 7rem)",
        paddingBottom: "clamp(3rem, 4vw + 0.5rem, 4rem)",
        /* Fluid horizontal padding */
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
      }}
    >
      {/* Background image with layered gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero-Background.png"
          alt="Fortress Investment Holdings"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-fortress-navy/80 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-fortress-navy/95 via-fortress-navy/85 md:via-fortress-navy/80 to-fortress-navy/60 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-fortress-navy/80 via-transparent to-fortress-navy/30" />
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
        className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center text-center md:items-start md:text-left"
      >
        <motion.span
          variants={heroItemVariants}
          className="block text-fortress-gold uppercase font-semibold mb-4 md:mb-6"
          style={{
            fontSize: "clamp(0.625rem, 0.5vw + 0.45rem, 0.875rem)",
            letterSpacing: "clamp(0.2em, 0.4vw + 0.1em, 0.45em)",
          }}
        >
          {heroSubtitle}
        </motion.span>

        <motion.h1
          variants={heroItemVariants}
          className="text-white font-light leading-[1.18] uppercase tracking-tight mb-4 md:mb-8 w-full md:max-w-4xl"
          style={{ fontSize: "var(--text-display)" }}
        >
          {heroTitleLine1}<br />
          <span className="font-semibold bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
            {heroTitleLine2}
          </span>
        </motion.h1>

        <motion.p
          variants={heroItemVariants}
          className="text-fortress-silver/90 w-full md:max-w-3xl leading-relaxed mb-6 md:mb-10 font-light"
          style={{ fontSize: "var(--text-lead)" }}
        >
          {heroDescription}
        </motion.p>

        <motion.div variants={heroButtonVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href="/investment-focus"
              className="block w-full sm:w-auto px-6 sm:px-8 py-3.5 md:py-4 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-xs sm:text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm shadow-lg text-center"
            >
              {heroBtn1Text}
            </Link>
          </motion.div>
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href="/invest-with-fortress"
              className="block w-full sm:w-auto px-6 sm:px-8 py-3.5 md:py-4 border border-fortress-silver/40 text-white font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-white transition-all rounded-sm backdrop-blur-sm text-center"
            >
              {heroBtn2Text}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated decorative gold line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fortress-gold/40 to-transparent z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 1.2 }}
      />
    </motion.section>
  );
}
