/**
 * src/modules/media/service.ts
 * Media/upload service — canonical implementation.
 * uploadFile nhận trực tiếp File object (Web API) và folder string.
 */
import { connectDB } from "@/core/database";
import Upload, { type IUpload } from "@/modules/media/model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/shared/utils/cloudinary";

/**
 * Upload file lên Cloudinary và lưu metadata vào DB.
 * @param file   - File object (Web API)
 * @param folder - Cloudinary folder, mặc định "AXVN"
 */
export async function uploadFile(
  file: File,
  folder = "AXVN",
): Promise<IUpload> {
  await connectDB();
  const result = await uploadToCloudinary(file, folder);
  return Upload.create({
    publicId: result.publicId,
    secureUrl: result.secureUrl,
    folder,
    resourceType: result.resourceType,
    fileName: file.name,
    fileSize: file.size,
  });
}

export async function deleteFile(publicId: string) {
  await connectDB();
  await deleteFromCloudinary(publicId);
  await Upload.deleteOne({ publicId });
  return true;
}

export async function listUploads(folder?: string) {
  await connectDB();
  const filter = folder ? { folder } : {};
  return Upload.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getUploadById(id: string) {
  await connectDB();
  return Upload.findById(id).lean();
}

export async function getUploadByPublicId(publicId: string) {
  await connectDB();
  return Upload.findOne({ publicId }).lean();
}

export async function listByResourceType(resourceType: string) {
  await connectDB();
  return Upload.find({ resourceType }).sort({ createdAt: -1 }).lean();
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
