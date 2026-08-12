"use server";

import { getCurrentUser, logoutAdmin } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";

export async function signIn(_email: string, _password: string) {
  // Sign-in is handled directly by /api/admin/login route
  return { success: false, message: "Use /api/admin/login" };
}

export async function signOut() {
  try {
    await logoutAdmin();
    return { success: true };
  } catch (error) {
    logger.error("Sign out error:", error);
    return { success: false, message: "Failed to sign out" };
  }
}

export async function getSession() {
  try {
    return await getCurrentUser();
  } catch (error) {
    logger.error("Get session error:", error);
    return null;
  }
}
