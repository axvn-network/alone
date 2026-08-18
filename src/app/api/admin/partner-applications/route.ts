import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  listApplications,
  deleteApplication,
} from "@/modules/partner-applications";
import type { ListApplicationsQuery } from "@/modules/partner-applications";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET /api/admin/partner-applications — list with filters
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    const url = request.nextUrl;
    const query: ListApplicationsQuery = {
      role: (url.searchParams.get("role") ||
        undefined) as ListApplicationsQuery["role"],
      status: (url.searchParams.get("status") ||
        undefined) as ListApplicationsQuery["status"],
      search: url.searchParams.get("search") || undefined,
      page: parseInt(url.searchParams.get("page") || "1"),
      limit: parseInt(url.searchParams.get("limit") || "20"),
    };
    const result = await listApplications(query);
    return successResponse(result);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE /api/admin/partner-applications?id=xxx — delete single
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorizedResponse();
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return errorResponse("id is required");
    const doc = await deleteApplication(id);
    return successResponse(doc, "Application deleted");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
