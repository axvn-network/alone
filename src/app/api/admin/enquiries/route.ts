import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { enquiryService } from "@/services";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — admin only: shaped list for the admin Enquiries page
// Supports optional ?type=contact|submission&status=new|read|archived
export async function GET(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const typeParam = request.nextUrl.searchParams.get("type") || undefined;
    const status    = request.nextUrl.searchParams.get("status") || undefined;

    const type = (typeParam === "contact" || typeParam === "submission")
      ? typeParam
      : undefined;

    return successResponse(await enquiryService.listForAdmin({ type, status }));
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
