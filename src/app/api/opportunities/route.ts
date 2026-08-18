import { NextRequest } from "next/server";
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
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!rateLimit(`opportunity:${ip}`, 3, 60000).allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const parsed = contactEnquirySchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));

    const enquiry = await enquiryService.createEnquiry(parsed.data);
    sendEnquiryNotification(parsed.data).catch((err) => logger.error("Failed to send notification email", err));
    return successResponse(enquiry, "Investment opportunity submitted successfully", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
