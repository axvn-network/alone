/**
 * src/app/(admin)/admin/capital-transactions/page.tsx
 *
 * Server Component — Quản lý giao dịch vốn cổ đông.
 *
 * Luồng đọc dữ liệu (App Router Local-first):
 *   Server Component
 *     → await service.list()   — query DB trực tiếp, render HTML gửi về client
 *     → await Shareholder.find() — shareholder list cho Capital Call form
 *   Không đi qua HTTP /api/... — zero serialisation overhead.
 *
 * Luồng ghi (mutations):
 *   Client Form → Server Action (actions.ts) → service.ts → DB → revalidatePath()
 *   Next.js tự cập nhật UI — không cần reload trang hay manual refetch.
 *
 * searchParams: page, status, type, shareholderId — driven by CapTxTable.
 */

import { Suspense } from "react";
import { connectDB } from "@/core/database";
import { requireAuth } from "@/core/security/auth-utils";
import { ShareholderModel as Shareholder } from "@/modules/shareholders";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { ADMIN_PAGE_CLS } from "@/constants/admin";
import { service as capTxService } from "@/modules/capital-transactions";
import { CapTxTable } from "@/modules/capital-transactions/components/CapTxTable";
import type { CapTxStatus, CapTxType } from "@/modules/capital-transactions/types";

const LIMIT = 20;

interface PageProps {
  searchParams: Promise<{
    page?:           string;
    status?:         string;
    type?:           string;
    shareholderId?:  string;
  }>;
}

export const metadata = {
  title: "Giao Dịch Vốn | AXVN Admin",
};

export default async function CapitalTransactionsPage({ searchParams }: PageProps) {
  // Auth guard — redirects to /admin-login if unauthenticated
  await requireAuth();

  const sp = await searchParams;
  const page          = Math.max(1, Number(sp.page  ?? 1));
  const filterStatus  = (sp.status ?? "") as CapTxStatus | "";
  const filterType    = (sp.type   ?? "") as CapTxType   | "";
  const shareholderId = sp.shareholderId ?? "";

  // ── Read — direct DB calls, no HTTP round-trip ────────────────────────────
  await connectDB();

  const [result, shareholderDocs] = await Promise.all([
    capTxService.list({
      page,
      limit:  LIMIT,
      ...(filterStatus  ? { status:        filterStatus  } : {}),
      ...(filterType    ? { type:          filterType    } : {}),
      ...(shareholderId ? { shareholderId              } : {}),
    }),
    Shareholder
      .find({ status: "active" }, { _id: 1, name: 1, email: 1 })
      .sort({ name: 1 })
      .limit(300)
      .lean(),
  ]);

  const shareholders = shareholderDocs.map((sh) => ({
    _id:   sh._id.toString(),
    name:  sh.name,
    email: sh.email,
  }));

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));

  return (
    <div className={ADMIN_PAGE_CLS}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <AdminNavbar title="Giao Dịch Vốn" />

        <div className="p-5 md:p-8 space-y-6">
          <Suspense fallback={null}>
            <CapTxTable
              txs={result.docs}
              total={result.total}
              page={page}
              totalPages={totalPages}
              shareholders={shareholders}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
