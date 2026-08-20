import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import {
  getSettings,
  updateSettings,
  settingsSchema,
} from "@/modules/settings";
import { formatZodErrors } from "@/utils/zod";
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — admin only: read site settings
export async function GET() {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    return successResponse(await getSettings());
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// PUT — admin only: update site settings
export async function PUT(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success)
      return validationErrorResponse(formatZodErrors(parsed.error));
    return successResponse(
      await updateSettings(parsed.data),
      "Settings updated successfully",
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
