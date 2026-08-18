/**
 * src/modules/media/index.ts
 * Barrel export — import from "@/modules/media"
 *
 * Wraps Cloudinary upload/delete + Upload model tracking.
 * Service lives at: @/shared/services/media.service.ts
 */

export {
  uploadFile,
  deleteFile,
  listUploads,
  getUploadById,
  getUploadByPublicId,
  listByResourceType,
  getUploadStats,
} from "@/shared/services/media.service";
