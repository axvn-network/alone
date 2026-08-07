"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";

export function usePageContent<T>(slug: string, defaultContent: T): { content: T; loading: boolean; error: boolean } {
  const [rawData, setRawData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/content/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch page content");
        return res.json();
      })
      .then((resData) => {
        if (isMounted && resData.success && resData.data?.data) {
          setRawData(resData.data.data);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // When lang === "en", prefer `key_en` values over plain `key` values.
  // This allows the Visual Editor to save EN overrides under `key_en` keys.
  const resolved: Record<string, unknown> = { ...rawData };
  if (lang === "en") {
    for (const k of Object.keys(rawData)) {
      if (k.endsWith("_en")) {
        const base = k.slice(0, -3);
        resolved[base] = rawData[k];
      }
    }
  }

  const content: T = { ...defaultContent, ...resolved };
  return { content, loading, error };
}
