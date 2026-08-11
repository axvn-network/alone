import Upload from "@/models/Upload";
import { uploadToCloudinary, deleteFromCloudinary, validateFile } from "@/utils/cloudinary";
import { connectDB } from "@/lib/db";

export async function uploadFile(file: File, folder = "gvi") {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  const result = await uploadToCloudinary(file, folder);

  try {
    await connectDB();
    await Upload.create({
      publicId:     result.publicId,
      secureUrl:    result.secureUrl,
      folder,
      resourceType: result.resourceType,
      fileName:     file.name,
      fileSize:     file.size,
    });
  } catch {
    console.error("Failed to save upload record to DB, but Cloudinary upload succeeded");
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
