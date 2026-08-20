import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  getAllPlans,
  createPlan,
  investmentPlanSchema,
} from "@/modules/investment-plans";
import { formatZodErrors } from "@/utils/zod";
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET /api/admin/investment-plans — admin: all plans (any status)
export async function GET(req: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const status = req.nextUrl.searchParams.get("status") as
      "active" | "draft" | "closed" | undefined;
    const plans = await getAllPlans(status ? { status } : undefined);
    return successResponse(plans);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// POST /api/admin/investment-plans — admin: create plan
export async function POST(req: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const parsed = investmentPlanSchema.safeParse(await req.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    const plan = await createPlan(parsed.data);
    return successResponse(
      plan,
      "Hạng mục hợp tác đã được tạo thành công",
      201,
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
