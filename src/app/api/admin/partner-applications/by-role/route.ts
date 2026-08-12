import { getCurrentUser } from "@/lib/auth-utils";
import { partnerApplicationService } from "@/services";
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
    const groups = await partnerApplicationService.listByRole();
    return successResponse(groups);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
