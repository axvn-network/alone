"use client";

import { Globe } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 bg-[#1A2536] border border-gold/30 rounded-full px-2 py-1 text-xs">
      <Globe className="w-3.5 h-3.5 text-fortress-gold" />
      <button
        onClick={() => setLang("vi")}
        className={`px-2 py-0.5 rounded-full transition-colors ${
          lang === "vi"
            ? "bg-fortress-gold text-fortress-navy font-bold"
            : "text-gray-300 hover:text-white"
        }`}
      >
        VIE
      </button>
      <span className="text-gray-500">|</span>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-0.5 rounded-full transition-colors ${
          lang === "en"
            ? "bg-fortress-gold text-fortress-navy font-bold"
            : "text-gray-300 hover:text-white"
        }`}
      >
        ENG
      </button>
    </div>
  );
}
