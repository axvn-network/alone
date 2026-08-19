import { NextRequest } from "next/server";
import { logger } from "@/shared/utils/logger";
import { errorResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query?: string };
    if (!query?.trim()) return errorResponse("Query is required");

    // Chat corpus not yet configured — return a polite fallback in the
    // format the ChatWidget expects: { answer: string }
    logger.info("Chat API: corpus not configured, returning fallback answer");
    return Response.json({
      success: true,
      answer:
        "Tính năng trợ lý AI đang được cập nhật. Vui lòng liên hệ trực tiếp qua email info@axvn.vn hoặc sử dụng form Liên Hệ để được hỗ trợ.",
    });
  } catch (error) {
    logger.error("Chat API error", error);
    return serverErrorResponse(handleError(error).message);
  }
}
