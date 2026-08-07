"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

interface LangContextValue {
  lang: Locale;
  setLang: (l: Locale) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "vi",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Locale | null;
    if (saved === "vi" || saved === "en") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (l: Locale) => {
    setLangState(l);
    localStorage.setItem("app_lang", l);
    document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
