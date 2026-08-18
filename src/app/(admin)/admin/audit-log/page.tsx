/**
 * src/app/(admin)/admin/audit-log/page.tsx
 *
 * Server Component — Nhật Ký Hoạt Động.
 * Luồng đọc: Server Component → queryLogs() → DB trực tiếp.
 * Filter/pagination: Client Component pushes searchParams → Server re-renders.
 */

import { Suspense } from "react";
import AdminSidebar from "@/shared/components/admin/AdminSidebar";
import AdminNavbar from "@/shared/components/admin/AdminNavbar";
import { requireAuth } from "@/core/security/auth-utils";
import { queryLogs } from "@/modules/audit-log";
import { AuditLogClient } from "./AuditLogClient";

export const metadata = { title: "Nhật Ký | AXVN Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    action?: string;
    actorId?: string;
    collection?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AuditLogPage({ searchParams }: PageProps) {
  await requireAuth();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const limit = 50;

  const result = await queryLogs({
    page,
    limit,
    action: sp.action || undefined,
    actorId: sp.actorId || undefined,
    collection: sp.collection || undefined,
    from: sp.from || undefined,
    to: sp.to || undefined,
  });

  return (
    <div className="min-h-screen bg-[#03080e] flex font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <AdminNavbar title="Nhật Ký Hoạt Động" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Suspense fallback={null}>
            <AuditLogClient
              logs={result.logs}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
