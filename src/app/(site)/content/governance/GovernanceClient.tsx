"use client";

import { GovernanceCards } from "@/modules/governance/components/GovernanceCards";
import { ShareholderTable } from "@/modules/shareholders/components/ShareholderTable";
import { AdvisorCards } from "@/modules/governance/components/AdvisorCards";
import DocLayout, {
  DocSidebar,
  DocMain,
  DocHero,
  DocBody,
} from "@/shared/components/layout/DocLayout";
import {
  GOVERNANCE_DOCS,
  SHAREHOLDERS,
  ADVISORS,
} from "@/shared/constants/governance";
import type { TocItem } from "@/shared/components/layout/DocLayout";

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
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Tài Liệu Quản Trị Hệ Thống
          </p>
          <GovernanceCards docs={GOVERNANCE_DOCS} />
        </DocHero>

        <DocBody id="shareholders">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Cổ Đông Sáng Lập & Vốn Góp
          </p>
          <ShareholderTable shareholders={SHAREHOLDERS} />
        </DocBody>

        <DocBody id="advisors">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Cơ Cấu Hội Đồng Cố Vấn
          </p>
          <AdvisorCards advisors={ADVISORS} />
        </DocBody>
      </DocMain>
    </DocLayout>
  );
}
