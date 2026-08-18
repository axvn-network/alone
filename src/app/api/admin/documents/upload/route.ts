import { NextRequest } from "next/server";
import { getCurrentUser } from "@/core/security/auth-utils";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/utils/api-response";
import { handleError } from "@/utils/errors";

// POST /api/admin/documents/upload — upload a document file to Cloudinary
export async function POST(request: NextRequest) {
  if (!await getCurrentUser()) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return errorResponse("No file provided");

    // Allow PDF, DOC, DOCX, XLSX, XLS + images — up to 50MB for documents
    const ALLOWED_TYPES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg", "image/png", "image/webp",
    ];
    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Loại file không được hỗ trợ. Chấp nhận: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WebP");
    }
    if (file.size > MAX_SIZE) {
      return errorResponse("File quá lớn. Tối đa 50MB.");
    }

    const result = await uploadToCloudinary(file, "AXVN/documents");
    return successResponse(
      { url: result.secureUrl, publicId: result.publicId, resourceType: result.resourceType },
      "File uploaded successfully",
      201
    );
  } catch (error) {
    return serverErrorResponse(handleError(error).message);
  }
}
