"use client";

import { Toaster } from "sonner";
import { CsrfProvider } from "@/contexts/CsrfContext";
import { AdminSessionProvider } from "@/contexts/AdminSessionContext";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <CsrfProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A1628",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#E8E0D0",
              fontSize: "14px",
            },
          }}
        />
      </CsrfProvider>
    </AdminSessionProvider>
  );
}
