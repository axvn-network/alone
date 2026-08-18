import { NextRequest } from "next/server";
import { documentService } from "@/modules/documents";
import type { DocumentQuery } from "@/modules/documents";
import { successResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET /api/documents — public
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const category = url.searchParams.get("category") || undefined;
    const yearStr = url.searchParams.get("year");
    const year = yearStr ? parseInt(yearStr) : undefined;
    const search = url.searchParams.get("search") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");

    const query: DocumentQuery = {
      category: category as DocumentQuery["category"],
      year,
      search,
      limit,
      page,
      status: "published",
    };
    const data = await documentService.list(query);
    const years = await documentService.getYears();
    return successResponse({ ...data, years });
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
