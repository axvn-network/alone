"use server";

import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signIn(email: string, password: string) {
  try {
    const auth = await getAuth();
    const headersList = await headers();

    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: headersList,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, message: "Invalid email or password" };
  }
}

export async function signOut() {
  try {
    const auth = await getAuth();
    const headersList = await headers();

    await auth.api.signOut({
      headers: headersList,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, message: "Failed to sign out" };
  }
}

export async function getSession() {
  try {
    const auth = await getAuth();
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}
