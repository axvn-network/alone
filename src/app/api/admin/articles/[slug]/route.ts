import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import * as blogService from "@/modules/blog";
import { blogSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// GET — admin only: fetch article by slug path param
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const { slug } = await params;
    return successResponse(await blogService.getBlogBySlug(slug));
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update article by slug path param
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const { slug } = await params;
    const parsed = blogSchema.partial().safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(await blogService.updateBlog(slug, parsed.data), "Article updated");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE — admin only: delete article by slug path param
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const { slug } = await params;
    await blogService.deleteBlog(slug);
    return successResponse(null, "Article deleted");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
