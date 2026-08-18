import type { Metadata } from "next";
import PageHero from "@/shared/components/blocks/PageHero";
import GovernanceClient from "./GovernanceClient";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Quản Trị Hệ Thống",
  description:
    "Thông tin quản trị, điều lệ và tài liệu pháp lý của AXVN Tech Holding.",
};

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-AXVN-navy pb-safe md:pb-0">
      <PageHero
        dark
        tag="Quản trị"
        heading="Tài Liệu Quản Trị Hệ Thống"
        description="Thông tin quản trị, điều lệ và tài liệu pháp lý của AXVN Tech Holding."
      />
      <GovernanceClient />
    </main>
  );
}
