import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  publicId: string;
  secureUrl: string;
  folder: string;
  resourceType: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    publicId: { type: String, required: true, unique: true },
    secureUrl: { type: String, required: true },
    folder: { type: String, default: "fortress" },
    resourceType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

UploadSchema.index({ folder: 1 });

const Upload = mongoose.models.Upload || mongoose.model<IUpload>("Upload", UploadSchema);

export default Upload;
