/**
 * src/app/api/admin/ai/route.ts
 *
 * HTTP adapter — auth gate + JSON envelope only.
 * All business logic lives in @/modules/ai.
 *
 * Kept as a route (not a Server Action) because the future streaming
 * upgrade (ReadableStream / SSE) requires a Response object.
 */
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from "@/utils/api-response";
import { runAiAction, AiConfigError, AiUpstreamError } from "@/modules/ai";
import type { AiRequest } from "@/modules/ai";

export async function POST(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();

  try {
    const body = (await request.json()) as AiRequest;
    if (!body.action) return errorResponse("action is required");

    const result = await runAiAction(body);
    return successResponse(result);
  } catch (error) {
    if (error instanceof AiConfigError)
      return errorResponse(error.message, 503);
    if (error instanceof AiUpstreamError)
      return errorResponse(error.message, error.status);
    return serverErrorResponse(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
