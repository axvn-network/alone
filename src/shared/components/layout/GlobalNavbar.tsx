"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/components/layout/Navbar";

export default function GlobalNavbar() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admin-login") ||
    pathname?.startsWith("/auth/admin-login")
  ) {
    return null;
  }
  return <Navbar />;
}
