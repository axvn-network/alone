import { getCurrentUser } from "@/core/security/auth-utils";
import { getDashboardStats } from "@/modules/dashboard/service";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — admin only: dashboard stats + recent activity
export async function GET() {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    return successResponse(await getDashboardStats());
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
