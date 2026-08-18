/**
 * src/modules/enquiries/service.ts
 * Enquiry service — re-export shim from canonical service file.
 */

export {
  createEnquiry, getEnquiries, listForAdmin,
  getEnquiryById, updateEnquiryStatus, deleteEnquiry,
  bulkMarkRead, getStats,
} from "@/shared/services/enquiry.service";
export type { EnquiryStats } from "@/shared/services/enquiry.service";
