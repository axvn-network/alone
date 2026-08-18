/**
 * src/modules/auth/sh-auth.ts
 *
 * Shareholder authentication helper.
 * Reads the shareholder session cookie and returns the active shareholder,
 * or null if unauthenticated / session expired / account inactive.
 *
 * Usage:
 *   const sh = await getActiveShareholder();
 *   if (!sh) return unauthorizedResponse("Cổ đông chưa đăng nhập.");
 */

import { cookies } from "next/headers";
import { connectDB } from "@/core/database";
import { parseShareholderToken, SH_COOKIE } from "@/core/security/session";
import Shareholder from "@/modules/shareholders/model";
import type { IShareholder } from "@/modules/shareholders/model";

export type ActiveShareholder = IShareholder & { _id: import("mongoose").Types.ObjectId; name: string; role: string; };

/**
 * Reads the shareholder session cookie, validates the token, and returns the
 * corresponding Shareholder document if active. Returns null on any failure.
 */
export async function getActiveShareholder(): Promise<ActiveShareholder | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SH_COOKIE)?.value;
    if (!raw) return null;

    const parsed = parseShareholderToken(raw);
    if (!parsed) return null;

    await connectDB();
    const sh = await Shareholder.findById(parsed.id).lean<ActiveShareholder>();
    if (!sh || sh.status !== "active") return null;

    return sh;
  } catch {
    return null;
  }
}
