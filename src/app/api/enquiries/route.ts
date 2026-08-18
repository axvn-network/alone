import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import * as enquiryService from "@/modules/enquiries";
import { contactEnquirySchema, formatZodErrors } from "@/validators";
import { rateLimit } from "@/utils/rate-limit";
import { sendEnquiryNotification } from "@/shared/utils/email";
import { logger } from "@/shared/utils/logger";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET — admin only: list all enquiries
export async function GET(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const type   = request.nextUrl.searchParams.get("type")   || undefined;
    const page   = parseInt(request.nextUrl.searchParams.get("page")  || "1");
    const limit  = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    return successResponse(await enquiryService.getEnquiries({ status, type, page, limit }));
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// POST — public: submit an enquiry (rate-limited)
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!rateLimit(`enquiry:${ip}`, 5, 60000).allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const parsed = contactEnquirySchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));

    const enquiry = await enquiryService.createEnquiry(parsed.data);
    sendEnquiryNotification(parsed.data).catch((err) => logger.error("Failed to send notification email", err));
    return successResponse(enquiry, "Enquiry submitted successfully", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
