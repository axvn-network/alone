import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  contactEnquirySchema,
} from "@/modules/enquiries";
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
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET — admin only: list all enquiries
export async function GET(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const type = request.nextUrl.searchParams.get("type") || undefined;
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    return successResponse(await getEnquiries({ status, type, page, limit }));
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// POST — public: submit an enquiry (rate-limited + sanitized)
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(`enquiry:${ip}`, 5, 60000).allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }
    const raw = await request.json();
    // Sanitize before Zod validation — defence-in-depth against XSS
    const sanitized = {
      ...raw,
      name:    sanitizeText(raw.name),
      email:   sanitizeEmail(raw.email),
      phone:   sanitizeText(raw.phone),
      company: sanitizeText(raw.company),
      subject: sanitizeText(raw.subject),
      message: sanitizeMessage(raw.message),
    };
    const parsed = contactEnquirySchema.safeParse(sanitized);
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    const enquiry = await createEnquiry(parsed.data, {
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? "",
    });
    sendEnquiryNotification(parsed.data).catch((err) =>
      logger.error("Failed to send notification email", err),
    );
    return successResponse(enquiry, "Enquiry submitted successfully", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// PATCH — admin only: update enquiry status
export async function PATCH(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const { id, status } = await request.json();
    if (!id) return errorResponse("id is required");
    if (!status || !["new", "read", "archived"].includes(status)) {
      return errorResponse("Invalid status. Must be: new, read, or archived");
    }
    return successResponse(await updateEnquiryStatus(id, status));
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE — admin only: delete enquiry (?id=xxx)
export async function DELETE(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return errorResponse("id is required");
    await deleteEnquiry(id);
    return successResponse(null, "Enquiry deleted");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
