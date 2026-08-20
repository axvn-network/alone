/**
 * src/modules/enquiries/schema.ts
 * Zod validation schema for Contact/Enquiry.
 */

import { z } from "zod";

export const contactEnquirySchema = z.object({
  type: z.enum([
    "Contact",
    "Investment Opportunity",
    "Business Acquisition",
    "Joint Venture",
    "Strategic Partnership",
  ]),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(1, "Message is required").max(5000),
  document: z.string().optional().default(""),
  /**
   * Personal-data consent — required under Decree 13/2023/NĐ-CP.
   * Must be true; any other value is rejected.
   */
  consentGiven: z
    .boolean()
    .refine(
      (v) => v === true,
      "You must consent to personal data processing to continue",
    ),
  /** ISO timestamp recorded when the user ticked the checkbox — retained for audit trail */
  consentTimestamp: z.string().min(1, "Consent timestamp is required"),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
