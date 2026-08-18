import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { documentService, DocumentQuery } from "@/modules/documents";
import { documentSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  validationErrorResponse,
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
    const parsed = documentSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    const doc = await documentService.create(parsed.data);
    return successResponse(doc, "Document created", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
