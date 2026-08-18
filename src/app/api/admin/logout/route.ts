import { clearSessionCookie } from "@/core/security/session";
import { successResponse } from "@/utils/api-response";

export async function POST() {
  await clearSessionCookie();
  return successResponse(null, "Logged out");
}
