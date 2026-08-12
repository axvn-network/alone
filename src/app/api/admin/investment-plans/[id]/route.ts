import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { investmentPlanService } from "@/services";
import { investmentPlanSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/admin/investment-plans/[id]
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const parsed = investmentPlanSchema.partial().safeParse(await req.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    const plan = await investmentPlanService.updatePlan(id, parsed.data);
    if (!plan) return notFoundResponse("Không tìm thấy hạng mục hợp tác");
    return successResponse(plan, "Cập nhật thành công");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE /api/admin/investment-plans/[id]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const plan = await investmentPlanService.deletePlan(id);
    if (!plan) return notFoundResponse("Không tìm thấy hạng mục hợp tác");
    return successResponse(null, "Đã xóa hạng mục hợp tác");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
