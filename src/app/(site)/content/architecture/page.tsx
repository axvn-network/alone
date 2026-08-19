import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/modules/dashboard/components/ArchitectureDiagram";
import DocLayout, { DocMain, DocBody, DocHero } from "@/shared/components/layout/DocLayout";
import PageHero from "@/shared/components/blocks/PageHero";
import { ARCH_NODES } from "@/shared/constants/system-architecture";

export const metadata: Metadata = {
  title: "Kiến Trúc Hệ Sinh Thái | AXVN Tech Holding",
  description:
    "Góc nhìn khái niệm về các nhóm vai trò, quan hệ tham chiếu và nguyên tắc điều phối trong hệ sinh thái AXVN Tech Holding.",
};

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-AXVN-navy pb-safe md:pb-0">
      <PageHero
        dark
        tag="Kiến trúc hệ sinh thái"
        heading="Các Vai Trò Trong Hệ Sinh Thái"
        description="Góc nhìn khái niệm về các nhóm vai trò, quan hệ tham chiếu và nguyên tắc điều phối."
      />
      <DocLayout>
        <DocMain>
          <DocHero>
            <ArchitectureDiagram nodes={ARCH_NODES} />
          </DocHero>
          <DocBody>
            <p className="text-AXVN-silver/60 text-sm">
              Xem chi tiết tại{" "}
              <a href="/roadmap" className="text-AXVN-gold underline hover:no-underline">
                Lộ trình chiến lược
              </a>
              .
            </p>
          </DocBody>
        </DocMain>
      </DocLayout>
    </main>
  );
}
