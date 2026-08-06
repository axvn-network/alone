"use client";

import { useEffect, useState } from "react";

export function usePageContent<T>(slug: string, defaultContent: T): { content: T; loading: boolean; error: boolean } {
  const [content, setContent] = useState<T>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/content/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch page content");
        return res.json();
      })
      .then((resData) => {
        if (isMounted && resData.success && resData.data?.data) {
          // Merge custom data over default content
          setContent((prev) => ({
            ...prev,
            ...resData.data.data,
          }));
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

  return { content, loading, error };
}
