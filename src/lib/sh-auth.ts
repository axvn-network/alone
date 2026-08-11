/**
 * src/lib/sh-auth.ts
 *
 * Shared helper to resolve the active Shareholder from the session cookie.
 * Avoids code duplication across /api/shareholders/* route handlers.
 */

import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Shareholder from "@/models/Shareholder";
import { parseShareholderToken, SH_COOKIE } from "@/lib/sh-session";

/**
 * Resolve the current shareholder from the HTTP-only session cookie.
 * Returns the lean Mongoose document if valid + active, otherwise null.
 */
export async function getActiveShareholder() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SH_COOKIE)?.value;
    if (!raw) return null;

    const parsed = parseShareholderToken(raw);
    if (!parsed) return null;

    await connectDB();
    const sh = await Shareholder.findById(parsed.id).lean();
    if (!sh || sh.status !== "active") return null;

    return sh;
  } catch {
    return null;
  }
}
