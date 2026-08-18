/**
 * src/lib/vn/zod-vn.ts
 *
 * Zod schemas for Vietnamese data standards.
 *
 * Usage:
 *   import { zNationalId, zPhone, zTaxIdBusiness } from "@/core/vn-utils/vn-lib/zod-vn";
 *
 * Zod v4: refine() uses string message directly (no factory function).
 */

import { z } from "zod";
import {
  validateCCCD,
  validateMaSoThue,
  validateSDT,
  validateSwiftBic,
  validateBarcodeGS1VN,
  validateSoTienVND,
  validateNgayThang,
} from "./validators";

// ─── National ID (CCCD — Căn cước công dân) ──────────────────────────────────

/**
 * Vietnamese National ID — 12-digit CCCD with valid province code.
 *
 * ⚠️  Never return in API responses (select: false in MongoDB)
 * ⚠️  Must be encrypted AES-256-GCM before storing (roadmap Q1/2026)
 */
export const zNationalId = z
  .string()
  .min(1, "National ID is required")
  .refine(
    (val) => validateCCCD(val).isValid,
    "Invalid national ID (must be 12 digits with a valid province code)",
  )
  .transform((val) => validateCCCD(val).normalized ?? val);

/** Optional National ID */
export const zNationalIdOptional = z
  .string()
  .optional()
  .refine((val) => !val || validateCCCD(val).isValid, "Invalid national ID");

// Backward-compat aliases
export const zCCCD = zNationalId;
export const zCCCDOptional = zNationalIdOptional;

// ─── Tax ID (Mã số thuế) ──────────────────────────────────────────────────────

/** Business / organisation TIN — 10 digits */
export const zTaxIdBusiness = z
  .string()
  .min(1, "Tax ID is required")
  .refine(
    (val) => validateMaSoThue(val, "doanh-nghiep").isValid,
    "Business TIN must be exactly 10 digits (e.g. 0123456789)",
  )
  .transform(
    (val) => validateMaSoThue(val, "doanh-nghiep").normalized ?? val.trim(),
  );

/** Branch / dependent-unit TIN — 10 digits + '-' + 3 digits */
export const zTaxIdBranch = z
  .string()
  .min(1, "Branch tax ID is required")
  .refine(
    (val) => validateMaSoThue(val, "don-vi-phu-thuoc").isValid,
    "Branch TIN must be: 10 digits + '-' + 3 digits (e.g. 0123456789-001)",
  );

/** Individual TIN — same as 12-digit national ID */
export const zTaxIdIndividual = zNationalId;

// Backward-compat aliases
export const zMSTDN = zTaxIdBusiness;
export const zMSTPhuThuoc = zTaxIdBranch;
export const zMSTCaNhan = zTaxIdIndividual;

// ─── Phone number (Vietnamese, E.164) ─────────────────────────────────────────

/**
 * Vietnamese phone number.
 * Normalises to E.164 (+84xxxxxxxxx) for storage.
 * Accepts: 0989123456 / +84989123456 / 84989123456
 */
export const zPhone = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (val) => validateSDT(val).isValid,
    "Invalid Vietnamese phone number (e.g. 0989123456)",
  )
  .transform((val) => validateSDT(val).e164 ?? val);

export const zPhoneOptional = z
  .string()
  .optional()
  .default("")
  .refine(
    (val) => !val || validateSDT(val).isValid,
    "Invalid Vietnamese phone number",
  );

// Backward-compat aliases
export const zSDTVN = zPhone;
export const zSDTVNOptional = zPhoneOptional;

// ─── SWIFT / BIC ──────────────────────────────────────────────────────────────

export const zSwiftBic = z
  .string()
  .min(1, "SWIFT/BIC code is required")
  .refine(
    (val) => validateSwiftBic(val).isValid,
    "Invalid SWIFT/BIC code (must be 8 or 11 characters, e.g. BFTVVNVX)",
  )
  .transform((val) => val.trim().toUpperCase());

export const zSwiftBicOptional = z
  .string()
  .optional()
  .default("")
  .refine(
    (val) => !val || validateSwiftBic(val).isValid,
    "Invalid SWIFT/BIC code",
  );

// ─── Amount in VND ────────────────────────────────────────────────────────────

/**
 * VND monetary amount — stored as a non-negative integer (no decimals).
 */
export const zAmountVND = z
  .union([z.number(), z.string()])
  .refine(
    (val) => validateSoTienVND(val).isValid,
    "Invalid VND amount (must be a non-negative integer)",
  )
  .transform((val) => validateSoTienVND(val).integer ?? 0);

export const zAmountVNDOptional = z
  .union([z.number(), z.string()])
  .optional()
  .default(0)
  .refine(
    (val) => val === undefined || val === 0 || validateSoTienVND(val).isValid,
    "Invalid VND amount",
  );

// Backward-compat aliases
export const zSoTienVND = zAmountVND;
export const zSoTienVNDOptional = zAmountVNDOptional;

// ─── GS1 Barcode (Vietnam prefix 893) ────────────────────────────────────────

export const zBarcodeGS1 = z
  .string()
  .min(1, "Barcode is required")
  .refine(
    (val) => validateBarcodeGS1VN(val).isValid,
    "Invalid GS1 Vietnam barcode (EAN-13, prefix 893)",
  );

// Backward-compat alias
export const zBarcodeGS1VN = zBarcodeGS1;

// ─── Date (ISO 8601) ──────────────────────────────────────────────────────────

export const zDate = z
  .string()
  .min(1, "Date is required")
  .refine(
    (val) => validateNgayThang(val).isValid,
    "Invalid date (accepted formats: dd/mm/yyyy or YYYY-MM-DD)",
  )
  .transform((val) => validateNgayThang(val).isoString ?? val);

export const zDateOptional = z
  .string()
  .nullable()
  .optional()
  .default(null)
  .refine((val) => !val || validateNgayThang(val).isValid, "Invalid date");

// Backward-compat aliases
export const zNgayThang = zDate;
export const zNgayThangOptional = zDateOptional;

// ─── Address (Vietnam — structured) ──────────────────────────────────────────

/**
 * Structured Vietnamese address.
 * Stores each component separately for geo-filtering and search.
 *
 * ⚠️  Ward/district names may change after administrative mergers.
 */
export const zAddress = z.object({
  streetNumber: z.string().optional().default(""), // Số nhà
  alley: z.string().optional().default(""), // Ngõ / Hẻm
  street: z.string().optional().default(""), // Tên đường
  ward: z.string().optional().default(""), // Phường / Xã / Thị trấn
  district: z.string().optional().default(""), // Quận / Huyện
  city: z.string().min(1, "City / Province is required"),
  countryCode: z.string().optional().default("VN"), // ISO 3166-1 alpha-2
});

export type AddressInput = z.infer<typeof zAddress>;

// Backward-compat aliases
export const zDiaChiVN = zAddress;
export type DiaChiVNInput = AddressInput;

// ─── KYC — Vietnam standard ───────────────────────────────────────────────────

/**
 * Full KYC schema — Vietnam standard.
 * Integrates national ID, phone, SWIFT and structured address validation.
 *
 * Used by: /api/shareholders/kyc (POST)
 */
export const zKyc = z.object({
  // National ID — required; encrypt AES-256-GCM before storing (Q1/2026)
  nationalId: zNationalId,
  nationalIdIssuedDate: zDateOptional,
  nationalIdIssuedPlace: z.string().optional().default(""),

  // Address
  permanentAddress: z
    .string()
    .min(5, "Permanent address must be at least 5 characters"),
  structuredAddress: zAddress.optional(),

  // Source of funds — AML standard
  sourceOfFunds: z.enum(
    ["salary", "investment", "inheritance", "savings", "loan", "other"],
    { error: "Invalid source of funds" },
  ),

  // Banking (optional)
  swiftCode: zSwiftBicOptional,
  taxId: z.string().optional().default(""),

  // Phone (optional, normalised to E.164)
  phone: zPhoneOptional,

  // AML flags (Law 14/2022)
  isPEP: z.boolean().default(false),
  isSanctioned: z.boolean().default(false),
});

export type KycInput = z.infer<typeof zKyc>;

// Backward-compat aliases
export const zKycVN = zKyc;
export type KycVNInput = KycInput;
