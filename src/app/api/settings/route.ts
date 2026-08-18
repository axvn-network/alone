import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import * as settingsService from "@/modules/settings";
import { settingsSchema, formatZodErrors } from "@/validators";
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

// GET — public: read site settings (used by frontend)
export async function GET() {
  try {
    return successResponse(await settingsService.getSettings());
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update site settings
export async function PUT(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await settingsService.updateSettings(parsed.data),
      "Settings updated successfully"
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
