import { NextRequest } from "next/server";
import { createEnquiry, contactEnquirySchema } from "@/modules/enquiries";
import { formatZodErrors } from "@/utils/zod";
import { rateLimit } from "@/utils/rate-limit";
import { sendEnquiryNotification } from "@/shared/utils/email";
import { logger } from "@/shared/utils/logger";
import { sanitizeText, sanitizeEmail, sanitizeMessage } from "@/utils/sanitize";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const check = rateLimit(`contact:${ip}`, 5, 5 * 60_000);
    if (!check.allowed)
      return errorResponse("Too many requests. Please try again later.", 429);

    const raw = await request.json();
    const sanitized = {
      ...raw,
      name: sanitizeText(raw.name),
      email: sanitizeEmail(raw.email),
      phone: sanitizeText(raw.phone),
      company: sanitizeText(raw.company),
      subject: sanitizeText(raw.subject),
      message: sanitizeMessage(raw.message),
    };

    const parsed = contactEnquirySchema.safeParse(sanitized);
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));

    const enquiry = await createEnquiry(parsed.data);
    sendEnquiryNotification(parsed.data).catch((err) =>
      logger.error("Failed to send notification email", err),
    );
    return successResponse(enquiry, "Enquiry submitted successfully", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
