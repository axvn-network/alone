/**
 * src/modules/documents/index.ts
 * Barrel export — import from "@/modules/documents"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as DocumentModel } from "./model";
export type { IDocument, DocumentCategory } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export { documentService } from "./service";
export type { DocumentQuery, CreateDocumentDto, UpdateDocumentDto } from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { documentSchema } from "./schema";
export type { DocumentInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export {
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
} from "./actions";
