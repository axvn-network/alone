import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { contentService } from "@/services";
import { pageContentSchema, formatZodErrors } from "@/validators";
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
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (slug) return successResponse(await contentService.getPage(slug));
    return successResponse(await contentService.getAllPages());
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update page content
export async function PUT(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const parsed = pageContentSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await contentService.updatePage(parsed.data.slug, parsed.data),
      "Page updated successfully"
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
