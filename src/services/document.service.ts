import { connectDB } from "@/lib/db";
import DocumentModel, { DocumentCategory, IDocument } from "@/models/Document";
import { NotFoundError } from "@/utils/errors";
import { paginate } from "@/utils/pagination";
import { buildSearchFilter } from "@/utils/search";

export interface DocumentQuery {
  category?: DocumentCategory;
  year?: number;
  status?: "published" | "draft";
  search?: string;
  limit?: number;
  page?: number;
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

function toPlain(doc: IDocument) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: String(obj._id),
    publishedDate: obj.publishedDate ? new Date(obj.publishedDate).toISOString() : null,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
  };
}

export const documentService = {
  async list(query: DocumentQuery = {}) {
    await connectDB();
    const filter: Record<string, unknown> = {
      ...(query.status   ? { status:   query.status }   : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.year     ? { year:     query.year }     : {}),
      ...buildSearchFilter(query.search, ["title", "titleEn"]),
    };

    const { page, limit, skip } = paginate(query, { limit: 50, maxLimit: 100 });

    const [docs, total] = await Promise.all([
      DocumentModel.find(filter).sort({ publishedDate: -1, year: -1 }).skip(skip).limit(limit).lean(),
      DocumentModel.countDocuments(filter),
    ]);

    return { documents: docs.map((d) => ({ ...d, _id: String(d._id) })), total, page, limit };
  },

  /** Public: only status=published */
  async listPublic(query: Omit<DocumentQuery, "status"> = {}) {
    return documentService.list({ ...query, status: "published" });
  },

  async getById(id: string) {
    await connectDB();
    const doc = await DocumentModel.findById(id);
    if (!doc) throw new NotFoundError("Document not found");
    return toPlain(doc);
  },

  async create(data: CreateDocumentDto) {
    await connectDB();
    const doc = await DocumentModel.create({
      ...data,
      publishedDate: new Date(data.publishedDate),
    });
    return toPlain(doc);
  },

  async update(id: string, data: UpdateDocumentDto) {
    await connectDB();
    const update: Record<string, unknown> = { ...data };
    if (data.publishedDate) update.publishedDate = new Date(data.publishedDate);
    const doc = await DocumentModel.findByIdAndUpdate(
      id, { $set: update }, { new: true, runValidators: true }
    );
    if (!doc) throw new NotFoundError("Document not found");
    return toPlain(doc);
  },

  async delete(id: string) {
    await connectDB();
    const doc = await DocumentModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundError("Document not found");
    return true;
  },

  async getYears(): Promise<number[]> {
    await connectDB();
    const years = await DocumentModel.distinct("year", { status: "published" });
    return (years as number[]).sort((a, b) => b - a);
  },

  /** Distinct categories that have at least one published document */
  async getCategories(): Promise<DocumentCategory[]> {
    await connectDB();
    const cats = await DocumentModel.distinct("category", { status: "published" });
    return cats as DocumentCategory[];
  },

  async getStats() {
    await connectDB();
    const [total, published, draft] = await Promise.all([
      DocumentModel.countDocuments(),
      DocumentModel.countDocuments({ status: "published" }),
      DocumentModel.countDocuments({ status: "draft" }),
    ]);
    return { total, published, draft };
  },
};
