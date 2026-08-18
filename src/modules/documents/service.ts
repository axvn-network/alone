/**
 * src/modules/documents/service.ts
 * Document service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import DocumentModel, {
  type IDocument,
  type DocumentCategory,
} from "@/modules/documents/model";

export interface DocumentQuery {
  category?: DocumentCategory;
  status?: "published" | "draft";
  year?: number;
  /** Tìm kiếm full-text theo title */
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDocumentDto {
  title: string;
  titleEn?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType?: "pdf" | "doc" | "xlsx" | "other";
  publishedDate: string | Date;
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportType?: string;
  isFeatured?: boolean;
  status?: "published" | "draft";
}

export type UpdateDocumentDto = Partial<CreateDocumentDto>;

export const documentService = {
  async list(q: DocumentQuery = {}) {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (q.category) filter.category = q.category;
    if (q.status) filter.status = q.status;
    if (q.year) filter.year = q.year;
    if (q.search) filter.title = { $regex: q.search, $options: "i" };
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const [docs, total] = await Promise.all([
      DocumentModel.find(filter)
        .sort({ publishedDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      DocumentModel.countDocuments(filter),
    ]);
    return { documents: docs, total, page, limit };
  },

  async getById(id: string) {
    await connectDB();
    return DocumentModel.findById(id).lean();
  },

  async getPublished(q: Omit<DocumentQuery, "status"> = {}) {
    return this.list({ ...q, status: "published" });
  },

  async create(data: CreateDocumentDto): Promise<IDocument> {
    await connectDB();
    return DocumentModel.create(data);
  },

  async update(id: string, data: UpdateDocumentDto) {
    await connectDB();
    return DocumentModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean();
  },

  async remove(id: string) {
    await connectDB();
    await DocumentModel.findByIdAndDelete(id);
    return true;
  },

  /** Alias của remove — hỗ trợ callers dùng .delete() */
  async delete(id: string) {
    return this.remove(id);
  },

  /** Public listing — chỉ trả published, alias của getPublished */
  async listPublic(q: Omit<DocumentQuery, "status"> = {}) {
    return this.getPublished(q);
  },

  /** Trả về danh sách năm có tài liệu, sorted desc */
  async getYears(): Promise<number[]> {
    await connectDB();
    const result = (await DocumentModel.distinct("year").lean()) as number[];
    return result.sort((a, b) => b - a);
  },
};
