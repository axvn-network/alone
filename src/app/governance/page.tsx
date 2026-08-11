import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GovernanceClient from "./GovernanceClient";

export const metadata: Metadata = {
  title: "Quản Trị Hệ Thống",
  description: "Thông tin quản trị, điều lệ và tài liệu pháp lý của GVI Tech Holding.",
};

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-gvi-navy pb-safe md:pb-0">
      <PageHero
        dark
        tag="Quản trị"
        heading="Tài Liệu Quản Trị Hệ Thống"
        description="Thông tin quản trị, điều lệ và tài liệu pháp lý của GVI Tech Holding."
      />
      <GovernanceClient />
    </main>
  );
}
