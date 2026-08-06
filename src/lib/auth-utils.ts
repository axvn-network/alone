import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import Admin from "@/models/Admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("admin_email")?.value;
    if (!sessionEmail) return null;

    await connectDB();
    const admin = await Admin.findOne({ email: sessionEmail }).lean();
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

export function unauthorizedResponse() {
  return Response.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_email");
}

