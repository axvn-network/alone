/**
 * src/modules/auth/auth-utils.ts
 *
 * Admin authentication helpers for server-side use:
 *   - getCurrentUser()  — resolve session → Admin document
 *   - requireAuth()     — redirect to /admin-login if unauthenticated
 *   - requireAdmin()    — like requireAuth but checks role
 *   - logoutAdmin()     — clear session cookie
 */

import { redirect } from "next/navigation";
import { getSessionEmail, clearSessionCookie } from "@/core/security/session";
import { connectDB } from "@/core/database";
import Admin from "@/core/models/Admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const email = await getSessionEmail();
    if (!email) return null;

    await connectDB();
    const admin = await Admin.findOne({ email }).lean();
    if (!admin) return null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin-login");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "superadmin") {
    redirect("/admin-login");
  }
  return user;
}

export async function logoutAdmin(): Promise<void> {
  await clearSessionCookie();
}
