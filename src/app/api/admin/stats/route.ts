import { getCurrentUser } from "@/core/security/auth-utils";
import * as dashboardService from "@/modules/dashboard";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — admin only: dashboard stats + recent activity
export async function GET() {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    return successResponse(await dashboardService.getDashboardStats());
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
