import { requireAdminGuard } from "@/lib/rbac";
import type { Metadata } from "next";
import AdminProviders from "./AdminProviders";

export const metadata: Metadata = {
  title: "Bảng Điều Khiển Quản Trị",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sử dụng RBAC guard — redirect về /admin-login nếu không phải admin/superadmin
  await requireAdminGuard();
  return <AdminProviders>{children}</AdminProviders>;
}
