"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function GlobalFooter() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admin-login") ||
    pathname?.startsWith("/auth/admin-login")
  ) {
    return null;
  }
  return <Footer />;
}
