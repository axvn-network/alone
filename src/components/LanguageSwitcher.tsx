"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as "vi" | "en";
    if (saved && (saved === "vi" || saved === "en")) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = (newLang: "vi" | "en") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    document.documentElement.lang = newLang;
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 bg-[#1A2536] border border-gold/30 rounded-full px-2 py-1 text-xs">
      <Globe className="w-3.5 h-3.5 text-fortress-gold" />
      <button
        onClick={() => toggleLanguage("vi")}
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
        onClick={() => toggleLanguage("en")}
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
