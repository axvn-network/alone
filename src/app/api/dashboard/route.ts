import { getCurrentUser } from "@/lib/auth-utils";
import { dashboardService } from "@/services";
import { successResponse, unauthorizedResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    const stats = await dashboardService.getDashboardStats();
    return successResponse(stats);
  } catch (error) {
    const { message } = handleError(error);
    return serverErrorResponse(message);
  }
}
