"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Target,
  Handshake,
  Newspaper,
  TrendingUp,
  FileText,
  LayoutGrid,
  X,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navVariants } from "@/shared/utils/animation";
import LanguageSwitcher from "@/shared/components/blocks/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/shared/i18n";

const linkVariants = {
  rest: { color: "rgba(255,255,255,0.8)" },
  hover: { color: "#C9A24A" },
};

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => (
  <motion.div initial="rest" whileHover="hover" className="group">
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
    >
      <motion.div variants={linkVariants} transition={{ duration: 0.3 }}>
        <Icon className="w-4 h-4" />
      </motion.div>
      <motion.span variants={linkVariants} transition={{ duration: 0.3 }}>
        {label}
      </motion.span>
    </Link>
    <motion.div
      className="h-px bg-AXVN-gold mt-0.5"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ transformOrigin: "left" }}
    />
  </motion.div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { lang } = useLang();

  // All nav items
  const navItems = [
    { label: t("nav.about", lang), href: "/about", icon: User },
    {
      label: t("nav.investmentFocus", lang),
      href: "/investment-focus",
      icon: Target,
    },
    { label: t("nav.approach", lang), href: "/our-approach", icon: Handshake },
    {
      label: t("nav.investWithUs", lang),
      href: "/invest-with-axvn",
      icon: TrendingUp,
    },
    {
      label: t("nav.partnershipPlans", lang),
      href: "/invest-with-axvn/plans",
      icon: Handshake,
    },
    { label: t("nav.insights", lang), href: "/insights", icon: Newspaper },
    { label: t("nav.documents", lang), href: "/documents", icon: FileText },
  ];

  // Mobile bottom bar: first 4 tabs + "More" button
  const BOTTOM_TABS = 4;
  const primaryTabs = navItems.slice(0, BOTTOM_TABS);
  const overflowItems = navItems.slice(BOTTOM_TABS); // items inside the drawer

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const bgClass = "bg-[#07111D]/95 backdrop-blur-md border-b border-white/5";

  return (
    <>
      <motion.header
        ref={headerRef}
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 inset-x-0 z-50 h-24 flex items-start px-0"
      >
        {/* Left wing */}
        <div className={`flex-1 min-w-0 h-10 ${bgClass} z-20 relative`}>
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-AXVN-silver"
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-AXVN-silver"
            />
          </svg>
        </div>

        {/* Center pill — giới hạn max-width để không tràn viewport */}
        <div className="flex h-24 relative z-10 shrink-0 max-w-[calc(100vw-4rem)] xl:max-w-[1400px] -ml-px">
          <div className="w-[50px] h-full relative shrink-0">
            <div
              className={`absolute inset-0 ${bgClass}`}
              style={{ clipPath: "path('M0 0 H50 V96 C25 96 25 40 0 40 Z')" }}
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 50 96"
            >
              <path
                d="M0 39.5 C25 39.5 25 95.5 50 95.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
                className="text-AXVN-silver"
              />
              <path
                d="M0 36.5 C25 36.5 25 91 50 91"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
                className="text-AXVN-silver"
              />
            </svg>
          </div>

          <div className="flex-1 h-full relative min-w-0 -ml-px">
            <div className={`absolute inset-0 ${bgClass}`}>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 96"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="95.5"
                  x2="100%"
                  y2="95.5"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={0.5}
                  className="text-AXVN-silver"
                />
                <line
                  x1="0"
                  y1="91"
                  x2="100%"
                  y2="91"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={0.5}
                  className="text-AXVN-silver"
                />
              </svg>
            </div>

            {/* ── Desktop layout: flex justify-between ── */}
            <div className="relative w-full h-full hidden md:flex items-center justify-between px-4 lg:px-8 gap-2">
              {/* Left nav — ẩn 1 item trên md để nhường chỗ */}
              <nav className="flex gap-2 lg:gap-4 xl:gap-6 shrink-0">
                {navItems.slice(0, 4).map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>

              {/* Logo — giới hạn chiều cao, không để tràn */}
              <div className="flex justify-center shrink-0 mx-2 lg:mx-4">
                <Link href="/" className="flex items-center group">
                  <Image
                    src="/large-logo1.png"
                    alt="AXVN Tech Holding"
                    width={320}
                    height={96}
                    className="h-16 lg:h-24 w-auto object-contain max-w-[180px] lg:max-w-[280px] xl:max-w-none"
                    priority
                  />
                </Link>
              </div>

              {/* Right nav */}
              <nav className="flex gap-2 lg:gap-4 xl:gap-5 items-center shrink-0">
                {navItems.slice(4, 7).map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
                <div
                  className={`flex gap-2 lg:gap-4 pl-3 lg:pl-4 shrink-0 items-center border-l ${scrolled ? "border-AXVN-gold/20" : "border-white/10"}`}
                >
                  <LanguageSwitcher variant="pills" />
                  <motion.div
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Link
                      href="/contact"
                      className="block px-3 lg:px-4 py-1.5 text-sm font-medium text-AXVN-navy bg-AXVN-gold hover:bg-AXVN-champagne transition-colors whitespace-nowrap shadow-sm"
                    >
                      {t("nav.contact", lang)}
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </div>

            {/* ── Mobile layout: grid 3 cột — toggle | logo (center) | mail ── */}
            <div className="relative w-full h-full md:hidden grid grid-cols-3 items-center px-4">
              {/* Cột trái: toggle ngôn ngữ */}
              <div className="flex items-center justify-start">
                <LanguageSwitcher variant="toggle" />
              </div>

              {/* Cột giữa: logo luôn căn giữa */}
              <div className="flex items-center justify-center">
                <Link
                  href="/"
                  className="flex items-center active:scale-95 transition-transform duration-150"
                >
                  <Image
                    src="/phone-logo.png"
                    alt="AXVN Tech Holding"
                    width={240}
                    height={72}
                    className="h-16 w-auto object-contain"
                    style={{
                      filter:
                        "drop-shadow(0 0 6px rgba(201,162,74,0.55)) drop-shadow(0 2px 14px rgba(201,162,74,0.30)) drop-shadow(0 -1px 4px rgba(255,255,255,0.08))",
                    }}
                    priority
                  />
                </Link>
              </div>

              {/* Cột phải: nút liên hệ */}
              <div className="flex items-center justify-end">
                <Link
                  href="/contact"
                  className="text-AXVN-gold p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors shadow-sm active:scale-95"
                  aria-label="Liên hệ"
                >
                  <Phone className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            <div
              className={`absolute inset-0 ${bgClass}`}
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 96 0 96 Z')" }}
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 50 96"
            >
              <path
                d="M0 95.5 C25 95.5 25 39.5 50 39.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
                className="text-AXVN-silver"
              />
              <path
                d="M0 91 C25 91 25 36.5 50 36.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
                className="text-AXVN-silver"
              />
            </svg>
          </div>
        </div>

        {/* Right wing */}
        <div className={`flex-1 min-w-0 h-10 ${bgClass} z-20 relative -ml-px`}>
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-AXVN-silver"
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-AXVN-silver"
            />
          </svg>
        </div>
      </motion.header>

      {/* ── Mobile Bottom Navigation (max 5 slots) ── */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#07111D]/98 backdrop-blur-xl border-t border-white/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <nav className="flex justify-around items-center h-[64px] px-1">
          {/* Slots 1–4: primary tabs */}
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${isActive ? "bg-AXVN-gold/15" : ""}`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-AXVN-gold" : "text-AXVN-silver/55"}`}
                  />
                </div>
                <span
                  className={`text-[9.5px] font-medium transition-colors text-center leading-tight px-0.5 ${isActive ? "text-AXVN-gold" : "text-white/45"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Slot 5: Menu button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
          >
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${menuOpen ? "bg-AXVN-gold/15" : ""}`}
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-AXVN-gold" />
              ) : (
                <LayoutGrid
                  className={`w-5 h-5 transition-colors ${overflowItems.some((i) => pathname.startsWith(i.href)) ? "text-AXVN-gold" : "text-AXVN-silver/55"}`}
                />
              )}
            </div>
            <span
              className={`text-[9.5px] font-medium transition-colors ${menuOpen || overflowItems.some((i) => pathname.startsWith(i.href)) ? "text-AXVN-gold" : "text-white/45"}`}
            >
              {menuOpen ? "Đóng" : "Menu"}
            </span>
          </button>
        </nav>
      </div>

      {/* ── Mobile Menu Drawer (slide up from bottom) ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 36,
                mass: 0.9,
              }}
              className="fixed bottom-[64px] inset-x-0 z-40 md:hidden bg-[#07111D] border-t border-AXVN-gold/20 rounded-t-2xl overflow-hidden"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/15 rounded-full" />
              </div>

              {/* Header row */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-white/6">
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-AXVN-gold/70">
                  Điều Hướng
                </span>
                <LanguageSwitcher variant="toggle" />
              </div>

              {/* Overflow nav items */}
              <div className="px-4 py-3 space-y-1">
                {overflowItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 active:scale-[0.98] ${
                        isActive
                          ? "bg-AXVN-gold/12 border border-AXVN-gold/25"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${isActive ? "bg-AXVN-gold/15" : "bg-white/5"}`}
                      >
                        <Icon
                          className={`w-4.5 h-4.5 ${isActive ? "text-AXVN-gold" : "text-AXVN-silver/70"}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isActive ? "text-AXVN-gold" : "text-AXVN-ivory/80"}`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-AXVN-gold shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Contact CTA at bottom of drawer */}
              <div className="px-4 pb-5 pt-1">
                <div className="h-px bg-white/6 mb-4" />
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-AXVN-gold hover:bg-AXVN-champagne active:scale-[0.98] text-AXVN-navy font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all duration-150"
                >
                  <Phone className="w-4 h-4" />
                  {t("nav.contact", lang)}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
