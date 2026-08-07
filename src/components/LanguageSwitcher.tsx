"use client";

import { useLang } from "@/contexts/LangContext";

interface LanguageSwitcherProps {
  /** "toggle" = công tắc gạt gọn (mobile), "pills" = dạng pill cũ (desktop) */
  variant?: "toggle" | "pills";
}

export default function LanguageSwitcher({ variant = "pills" }: LanguageSwitcherProps) {
  const { lang, setLang } = useLang();
  const isVI = lang === "vi";

  /* ── Toggle gạt (mobile) ── */
  if (variant === "toggle") {
    return (
      <button
        type="button"
        onClick={() => setLang(isVI ? "en" : "vi")}
        aria-label={isVI ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        className="relative flex items-center select-none focus:outline-none"
      >
        {/*
          Track h-[26px] w-[54px] — chia đôi thành 2 ô 27px
          Thumb tuyệt đối trượt trên z-10, chữ ở z-20 để hiện trên thumb
        */}
        <span
          className={`relative inline-grid grid-cols-2 h-[26px] w-[54px] rounded-full border overflow-hidden transition-colors duration-300 ${
            isVI
              ? "bg-fortress-gold/15 border-fortress-gold/50"
              : "bg-white/10 border-white/20"
          }`}
        >
          {/* Thumb — trượt trái/phải */}
          <span
            className={`absolute inset-y-[2px] w-[25px] rounded-full shadow-sm transition-all duration-300 z-10 ${
              isVI ? "left-[2px] bg-fortress-gold" : "left-[27px] bg-white/80"
            }`}
          />
          {/* Chữ VI — ô trái */}
          <span className={`relative z-20 flex items-center justify-center text-[9px] font-bold tracking-wide transition-colors duration-200 ${isVI ? "text-fortress-navy" : "text-white/35"}`}>
            VI
          </span>
          {/* Chữ EN — ô phải */}
          <span className={`relative z-20 flex items-center justify-center text-[9px] font-bold tracking-wide transition-colors duration-200 ${!isVI ? "text-fortress-navy" : "text-white/35"}`}>
            EN
          </span>
        </span>
      </button>
    );
  }

  /* ── Pills (desktop) ── */
  return (
    <div className="flex items-center gap-0.5 bg-[#1A2536] border border-white/10 rounded-full px-1.5 py-1">
      <button
        onClick={() => setLang("vi")}
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide transition-colors ${
          isVI
            ? "bg-fortress-gold text-fortress-navy"
            : "text-white/50 hover:text-white"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide transition-colors ${
          !isVI
            ? "bg-fortress-gold text-fortress-navy"
            : "text-white/50 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
