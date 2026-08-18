"use client";

/**
 * AdminSessionContext
 *
 * Single source of truth for the currently authenticated admin info within the
 * admin UI.  Both AdminSidebar and AdminNavbar subscribe to this context so we
 * only make ONE fetch("/api/admin/session") per page load instead of two.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

interface AdminSessionContextValue {
  adminInfo: AdminInfo | null;
}

const AdminSessionContext = createContext<AdminSessionContextValue>({
  adminInfo: null,
});

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => { if (d.success) setAdminInfo(d.data as AdminInfo); })
      .catch(() => {});
  }, []);

  return (
    <AdminSessionContext.Provider value={{ adminInfo }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function usePermissions() {
  const { adminInfo } = useContext(AdminSessionContext);
  return {
    can: (_permission: string) => {
      // Logic để kiểm tra permission dựa trên roles/permissions trong adminInfo
      return !!adminInfo && (adminInfo.role === "superadmin" || true); // Placeholder logic
    }
  };
}

export function useAdminSession(): AdminSessionContextValue {
  return useContext(AdminSessionContext);
}
