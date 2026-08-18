import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  getBlogs,
  getBlogBySlug,
  getBlogCategories,
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
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    const search = request.nextUrl.searchParams.get("search") || undefined;
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (request.nextUrl.searchParams.has("categories")) {
      return successResponse(await getBlogCategories());
    }
    if (slug) return successResponse(await getBlogBySlug(slug));

    const result = await getBlogs({
      status: "published",
      category,
      search,
      page,
      limit,
    });
    return successResponse(result);
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

export async function POST(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const parsed = blogSchema.safeParse(await request.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await createBlog(parsed.data),
      "Blog post created",
      201,
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

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
      "Blog post updated",
    );
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return errorResponse("Slug is required");
    await deleteBlog(slug);
    return successResponse(null, "Blog post deleted");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
