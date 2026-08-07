import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { documentService, DocumentQuery } from "@/services/document.service";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET /api/admin/documents — admin list (all statuses)
export async function GET(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const url = request.nextUrl;
    const category = url.searchParams.get("category") || undefined;
    const yearStr = url.searchParams.get("year");
    const year = yearStr ? parseInt(yearStr) : undefined;
    const search = url.searchParams.get("search") || undefined;
    const status = (url.searchParams.get("status") as "published" | "draft" | undefined) || undefined;

    const query: DocumentQuery = { category: category as DocumentQuery["category"], year, search, status };
    const data = await documentService.list(query);
    const years = await documentService.getYears();
    return successResponse({ ...data, years });
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// POST /api/admin/documents — create
export async function POST(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const body = await request.json();
    if (!body.title || !body.category || !body.fileUrl || !body.publishedDate || !body.year) {
      return errorResponse("title, category, fileUrl, publishedDate and year are required");
    }
    const doc = await documentService.create(body);
    return successResponse(doc, "Document created", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
