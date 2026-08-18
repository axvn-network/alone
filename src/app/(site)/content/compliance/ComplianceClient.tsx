"use client";

import { ComplianceTracker } from "@/modules/compliance/components/ComplianceTracker";
import DocLayout, {
  DocSidebar,
  DocMain,
  DocHero,
  DocBody,
} from "@/shared/components/layout/DocLayout";
import { COMPLIANCE_TASKS } from "@/shared/constants/compliance";
import type { TocItem } from "@/shared/components/layout/DocLayout";

const TOC: readonly TocItem[] = [
  { id: "tracker", label: "Tiến độ tuân thủ", level: 1 },
];

export default function ComplianceClient() {
  return (
    <DocLayout>
      <DocSidebar toc={TOC} />
      <DocMain>
        <DocHero id="tracker">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-6">
            Tiến Độ Tuân Thủ Pháp Lý
          </p>
          <ComplianceTracker tasks={COMPLIANCE_TASKS} />
        </DocHero>

        <DocBody>
          <p className="text-AXVN-silver/60 text-sm">
            Hệ thống theo dõi tiến độ các đầu việc pháp lý và tuân thủ định kỳ.
          </p>
        </DocBody>
      </DocMain>
    </DocLayout>
  );
}
