"use client";

import { createContext, useContext, useEffect, useRef, useCallback } from "react";

interface CsrfContextValue {
  /** Performs a fetch() with x-csrf-token injected on mutating methods */
  csrfFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const CsrfContext = createContext<CsrfContextValue>({
  csrfFetch: (input, init) => fetch(input, init),
});

export function useCsrf() {
  return useContext(CsrfContext);
}

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = useRef<string>("");

  // Fetch and cache the CSRF token on mount (and refresh every 3.5 h)
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/csrf");
      const data = await res.json();
      if (data.token) tokenRef.current = data.token;
    } catch {
      // non-fatal — token stays stale; middleware will reject if it expired
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3.5 * 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const csrfFetch = useCallback<typeof fetch>(
    async (input, init = {}) => {
      const method = (init.method || "GET").toUpperCase();
      const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
      if (mutating) {
        // If token not yet available, try to fetch it now (blocks once on first mutation)
        if (!tokenRef.current) await refresh();
        const headers = new Headers(init.headers);
        if (tokenRef.current) headers.set("x-csrf-token", tokenRef.current);
        return fetch(input, { ...init, headers });
      }
      return fetch(input, init);
    },
    [refresh]
  );

  return (
    <CsrfContext.Provider value={{ csrfFetch }}>
      {children}
    </CsrfContext.Provider>
  );
}
