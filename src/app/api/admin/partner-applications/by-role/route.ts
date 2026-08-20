import { getCurrentUser } from "@/core/security/auth-utils";
import { listByRole } from "@/modules/partner-applications";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET /api/admin/partner-applications/by-role — all active applications grouped by desiredRole
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    const groups = await listByRole();
    return successResponse(groups);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
