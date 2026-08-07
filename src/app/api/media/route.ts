import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { mediaService } from "@/services";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// GET — admin only: list uploaded files
export async function GET(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const folder = request.nextUrl.searchParams.get("folder") || undefined;
    return successResponse(await mediaService.listUploads(folder));
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// POST — admin only: upload a file
export async function POST(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "fortress";
    if (!file) return errorResponse("No file provided");
    return successResponse(await mediaService.uploadFile(file, folder), "File uploaded", 201);
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}

// DELETE — admin only: delete a file
export async function DELETE(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const publicId = request.nextUrl.searchParams.get("publicId");
    if (!publicId) return errorResponse("publicId is required");
    await mediaService.deleteFile(publicId);
    return successResponse(null, "File deleted");
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
