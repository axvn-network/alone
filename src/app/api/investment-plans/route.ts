import { investmentPlanService } from "@/services";
import { successResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET /api/investment-plans — public: active plans only
export async function GET() {
  try {
    const plans = await investmentPlanService.getActivePlans();
    return successResponse(plans);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
