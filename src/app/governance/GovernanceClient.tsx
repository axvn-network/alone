"use client";

import { GovernanceCards } from "@/components/visual/gov/GovernanceCards";
import { ShareholderTable } from "@/components/visual/gov/ShareholderTable";
import { AdvisorCards } from "@/components/visual/gov/AdvisorCards";
import DocLayout, { DocSidebar, DocMain, DocHero, DocBody } from "@/components/layouts/DocLayout";
import { GOVERNANCE_DOCS, SHAREHOLDERS, ADVISORS } from "@/data/gov/governance";
import type { TocItem } from "@/components/layouts/DocLayout";

const TOC: readonly TocItem[] = [
  { id: "docs", label: "Tài liệu quản trị", level: 1 },
  { id: "shareholders", label: "Cổ đông sáng lập", level: 1 },
  { id: "advisors", label: "Hội đồng cố vấn", level: 1 },
];

export default function GovernanceClient() {
  return (
    <DocLayout>
      <DocSidebar toc={TOC} />
      <DocMain>
        <DocHero id="docs">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gvi-gold mb-6">
            Tài Liệu Quản Trị Hệ Thống
          </h2>
          <GovernanceCards docs={GOVERNANCE_DOCS} />
        </DocHero>

        <DocBody id="shareholders">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gvi-gold mb-6">
            Cổ Đông Sáng Lập & Vốn Góp
          </h2>
          <ShareholderTable shareholders={SHAREHOLDERS} />
        </DocBody>

        <DocBody id="advisors">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gvi-gold mb-6">
            Cơ Cấu Hội Đồng Cố Vấn
          </h2>
          <AdvisorCards advisors={ADVISORS} />
        </DocBody>
      </DocMain>
    </DocLayout>
  );
}
