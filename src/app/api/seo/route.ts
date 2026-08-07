import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { contentService } from "@/services";
import { seoSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError, NotFoundError } from "@/utils/errors";

// GET — public: read SEO for a page
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return successResponse({ message: "Provide a ?slug= parameter" });
    const page = await contentService.getPage(slug);
    return successResponse({ slug: page.slug, seo: page.seo || {} });
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update SEO metadata
export async function PUT(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const parsed = seoSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    const { pageSlug, ...seoData } = parsed.data;
    const page = await contentService.updatePage(pageSlug, {
      seo: {
        title: seoData.title || "",
        description: seoData.description || "",
        keywords: seoData.keywords || "",
        ogImage: seoData.ogImage || "",
        canonicalUrl: seoData.canonicalUrl || "",
      },
    });
    return successResponse(page, "SEO updated successfully");
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return serverErrorResponse(handleError(error).message);
  }
}
