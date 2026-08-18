/**
 * src/modules/enquiries/index.ts
 * Barrel export — import from "@/modules/enquiries"
 */

// ── Model ─────────────────────────────────────────────────────────────────────
export { default as EnquiryModel } from "./model";
export type { IEnquiry, EnquiryType, EnquiryStatus } from "./model";

// ── Service ───────────────────────────────────────────────────────────────────
export {
  createEnquiry,
  getEnquiries,
  listForAdmin,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  bulkMarkRead,
  getStats,
} from "./service";
export type { EnquiryStats } from "./service";

// ── Schema ────────────────────────────────────────────────────────────────────
export { contactEnquirySchema } from "./schema";
export type { ContactEnquiryInput } from "./schema";

// ── Actions ───────────────────────────────────────────────────────────────────
export {
  markEnquiryReadAction,
  archiveEnquiryAction,
  deleteEnquiryAction,
} from "./actions";
