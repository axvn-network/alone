import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  getBlogBySlug,
  listForAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  blogSchema,
} from "@/modules/blog";
import { formatZodErrors } from "@/utils/zod";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// GET — admin only
//   ?slug=  → full article (for editor)
//   (none)  → lightweight list for card grid
export async function GET(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug") || undefined;
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const search = request.nextUrl.searchParams.get("search") || undefined;

    if (slug) return successResponse(await getBlogBySlug(slug));

    return successResponse(
      await listForAdmin({
        status:
          status === "draft" || status === "published" ? status : undefined,
        category,
        search,
      }),
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// POST — admin only: create new article
export async function POST(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const parsed = blogSchema.safeParse(await request.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await createBlog(parsed.data),
      "Article created",
      201,
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update article by ?slug=
export async function PUT(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return errorResponse("Slug is required");
    const parsed = blogSchema.partial().safeParse(await request.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await updateBlog(slug, parsed.data),
      "Article updated",
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE — admin only: delete article by ?slug=
export async function DELETE(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return errorResponse("Slug is required");
    await deleteBlog(slug);
    return successResponse(null, "Article deleted");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
