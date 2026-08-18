import { NextRequest } from "next/server";
import { logger } from "@/shared/utils/logger";
import { errorResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query?: string };
    if (!query?.trim()) return errorResponse("Query is required");
    logger.warn("Chat API: corpus not available");
    return errorResponse("Tính năng chat tạm thời không khả dụng.");
  } catch (error) {
    logger.error("Chat API error", error);
    return serverErrorResponse(handleError(error).message);
  }
}
