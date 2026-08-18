import Upload from "@/core/models/Upload";
import { uploadToCloudinary, deleteFromCloudinary, validateFile } from "@/utils/cloudinary";
import { connectDB } from "@/core/database/db";
import { logger } from "@/shared/utils/logger";

export async function uploadFile(file: File, folder = "AXVN") {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  const result = await uploadToCloudinary(file, folder);

  try {
    await connectDB();
    await Upload.create({
      publicId: result.publicId,
      secureUrl: result.secureUrl,
      folder,
      resourceType: result.resourceType,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (dbErr) {
    // DB save thất bại — rollback Cloudinary để tránh orphan file
    await deleteFromCloudinary(result.publicId).catch(() => {
      // Rollback thất bại — log để admin xử lý thủ công
      logger.error("[media.service] Cloudinary rollback failed for:", result.publicId, dbErr);
    });
    throw new Error("Lỗi lưu trữ file. Vui lòng thử lại.");
  }

  return { ...result, _id: "" };
}

export async function deleteFile(publicId: string) {
  await deleteFromCloudinary(publicId);

  await connectDB();
  const record = await Upload.findOneAndDelete({ publicId }).lean();
  return record;
}

export async function listUploads(folder?: string) {
  await connectDB();
  const query = folder ? { folder } : {};
  return Upload.find(query).sort({ createdAt: -1 }).lean();
}

export async function getUploadById(id: string) {
  await connectDB();
  const record = await Upload.findById(id).lean();
  if (!record) throw new Error("Upload not found");
  return record;
}

export async function getUploadByPublicId(publicId: string) {
  await connectDB();
  return Upload.findOne({ publicId }).lean();
}

export async function listByResourceType(resourceType: "image" | "raw" | "video", folder?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { resourceType };
  if (folder) filter.folder = folder;
  return Upload.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getUploadStats() {
  await connectDB();
  const [total, images, documents] = await Promise.all([
    Upload.countDocuments(),
    Upload.countDocuments({ resourceType: "image" }),
    Upload.countDocuments({ resourceType: "raw" }),
  ]);
  return { total, images, documents };
}
