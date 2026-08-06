"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function GlobalNavbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login")) {
    return null;
  }
  return <Navbar />;
}
