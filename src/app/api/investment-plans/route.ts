import { getActivePlans } from "@/modules/investment-plans";
import { successResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET /api/investment-plans — public: active plans only
export async function GET() {
  try {
    const plans = await getActivePlans();
    return successResponse(plans);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
