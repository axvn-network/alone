import { NextRequest } from "next/server";
import { partnerApplicationService } from "@/services";
import { partnerApplicationSchema, formatZodErrors } from "@/validators";
import { rateLimit } from "@/utils/rate-limit";
import { sanitizeText, sanitizeEmail, sanitizeMessage } from "@/utils/sanitize";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// POST /api/partner-application — public, nộp đơn đăng ký kèm kết quả quiz
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // 2 lần nộp / 10 phút / IP
    const check = rateLimit(`partner-app:${ip}`, 2, 10 * 60_000);
    if (!check.allowed) {
      return errorResponse("Quá nhiều yêu cầu. Vui lòng thử lại sau.", 429);
    }

    const raw = await request.json();

    const normalized = {
      fullName:     sanitizeText(raw.fullName || ""),
      email:        sanitizeEmail(raw.email || ""),
      phone:        sanitizeText(raw.phone || ""),
      company:      sanitizeText(raw.company || ""),
      position:     sanitizeText(raw.position || ""),
      linkedinUrl:  sanitizeText(raw.linkedinUrl || ""),
      quizAnswers:  raw.quizAnswers && typeof raw.quizAnswers === "object" ? raw.quizAnswers : {},
      assessmentScore: raw.assessmentScore ?? { technical: 0, financial: 0, legal: 0, strategic: 0, network: 0 },
      suggestedRole:   raw.suggestedRole || "individual",
      desiredRole:     raw.desiredRole || raw.suggestedRole || "individual",
      capitalRange:    sanitizeText(raw.capitalRange || ""),
      motivation:      sanitizeMessage(raw.motivation || ""),
      capabilities:    sanitizeMessage(raw.capabilities || ""),
      investmentPlan:  sanitizeText(raw.investmentPlan || ""),
      consentGiven:    raw.consentGiven === true,
      consentTimestamp: typeof raw.consentTimestamp === "string" && raw.consentTimestamp
        ? raw.consentTimestamp
        : new Date().toISOString(),
    };

    const parsed = partnerApplicationSchema.safeParse(normalized);
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));

    const doc = await partnerApplicationService.createApplication(parsed.data);

    return successResponse(doc, "Đơn đăng ký đã được gửi thành công", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
