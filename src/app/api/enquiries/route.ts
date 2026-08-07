import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { enquiryService } from "@/services";
import { contactEnquirySchema, formatZodErrors } from "@/validators";
import { rateLimit } from "@/utils/rate-limit";
import { sendEnquiryNotification } from "@/lib/email";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

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
    sendEnquiryNotification(parsed.data).catch(console.error);
    return successResponse(enquiry, "Enquiry submitted successfully", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
