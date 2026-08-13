import type { Metadata } from "next";
import PageHero from "@/app/(site)/components/public/PageHero";
import GovernanceClient from "./GovernanceClient";

export const metadata: Metadata = {
  title: "Quản Trị Hệ Thống",
  description: "Thông tin quản trị, điều lệ và tài liệu pháp lý của AXVN Tech Holding.",
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
