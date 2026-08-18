import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  getPage,
  getAllPages,
  updatePage,
  pageContentSchema,
} from "@/modules/content";
import { formatZodErrors } from "@/utils/zod";
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// GET — admin only: list all pages or fetch single by ?slug=
export async function GET(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (slug) return successResponse(await getPage(slug));
    return successResponse(await getAllPages());
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update page content
export async function PUT(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const parsed = pageContentSchema.safeParse(await request.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await updatePage(parsed.data.slug, parsed.data),
      "Page updated successfully",
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
