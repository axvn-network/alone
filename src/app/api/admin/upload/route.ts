import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import * as mediaService from "@/modules/media";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// POST — admin only: upload a file (blog images, etc.)
export async function POST(request: NextRequest) {
  if (!(await getCurrentUser())) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return errorResponse("No file provided");
    const result = await mediaService.uploadFile(file, "AXVN/blog");
    return successResponse(
      { url: result.secureUrl, publicId: result.publicId },
      "File uploaded",
      201,
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
