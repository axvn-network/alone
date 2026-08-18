import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import * as partnerApplicationService from "@/modules/partner-applications";
import { partnerApplicationUpdateSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET /api/admin/partner-applications/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const doc = await partnerApplicationService.getApplicationById(id);
    return successResponse(doc);
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// PATCH /api/admin/partner-applications/[id] — update status / adminNotes / desiredRole
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const parsed = partnerApplicationUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));

    const doc = await partnerApplicationService.updateApplication(id, parsed.data, user.id);
    return successResponse(doc, "Application updated");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE /api/admin/partner-applications/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const doc = await partnerApplicationService.deleteApplication(id);
    return successResponse(doc, "Application deleted");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
