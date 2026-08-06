"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export function useAuth() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    session,
    user: session?.user || null,
    isPending,
    isAuthenticated: !!session,
    error,
  };
}
