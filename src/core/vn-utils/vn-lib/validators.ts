/**
 * src/core/vn-utils/vn-lib/validators.ts
 *
 * Low-level validation functions for Vietnamese data standards.
 * Each function returns a typed result object with both the primary
 * English fields and backward-compatible Vietnamese aliases.
 *
 * Dependencies: libphonenumber-js
 */

import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from "libphonenumber-js";

import { MA_TINH_HOP_LE } from "./hanh-chinh";
import { SWIFT_MAP } from "./swift-ngan-hang";

// ─── Province code registry (CCCD) ───────────────────────────────────────────
// Source: Circular 59/2021/TT-BCA (Ministry of Public Security)
// ⚠️  Single Source of Truth: See @/core/vn-utils/vn-lib/hanh-chinh.ts to update.

const VALID_PROVINCE_CODES = MA_TINH_HOP_LE;

// ─── Result interfaces ────────────────────────────────────────────────────────

export interface ValidationResult<T = string> {
  isValid: boolean;
  error?: string;
  normalized?: T;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: T;
}

export interface CCCDResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
  /** Province code — first 3 digits of the national ID */
  provinceCode?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
  /** @deprecated Use provinceCode */ maTinh?: string;
}

export interface PhoneResult {
  isValid: boolean;
  error?: string;
  /** E.164 format: +84xxxxxxxxx */
  e164?: string;
  /** Local format: 0xxxxxxxxx */
  localFormat?: string;
  normalized?: string;
  /** @deprecated Use localFormat */ noiDia?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
}

export interface SwiftResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
  bankName?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
  /** @deprecated Use bankName */ nganHang?: string;
}

export interface DateResult {
  isValid: boolean;
  error?: string;
  /** ISO 8601 string (UTC) */
  isoString?: string;
  /** Vietnamese display format: dd/MM/yyyy */
  displayVN?: string;
  normalized?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
}

export interface TaxCodeResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
}

export interface AmountResult {
  isValid: boolean;
  error?: string;
  /** Amount as a non-negative integer (đồng) */
  integer?: number;
  normalized?: string;
  /** @deprecated Use integer */ soNguyen?: number;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
}

export interface BarcodeResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
}

export interface AddressResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
  /** @deprecated Use isValid */ hopLe?: boolean;
  /** @deprecated Use error */ loi?: string;
  /** @deprecated Use normalized */ chuanHoa?: string;
}

// Backward-compat type aliases
export type SDTResult = PhoneResult;
export type NgayResult = DateResult;
export type MSTResult = TaxCodeResult;
export type SoTienResult = AmountResult;
export type DiaChiResult = AddressResult;

/** Tax ID type selector */
export type MSTLoai = "doanh-nghiep" | "don-vi-phu-thuoc" | "ca-nhan";

/** Structured address input — each administrative level as a separate field. */
export interface AddressComponents {
  streetNumber?: string; // Số nhà
  alley?: string; // Ngõ / Hẻm
  street?: string; // Tên đường
  ward?: string; // Phường / Xã / Thị trấn
  district?: string; // Quận / Huyện
  city?: string; // Tỉnh / Thành phố
  countryCode?: string; // ISO 3166-1 alpha-2 (default: "VN")
}

/** @deprecated Use AddressComponents */
export type DiaChiInput = {
  soNha?: string;
  ngoHem?: string;
  tenDuong?: string;
  phuongXa?: string;
  quanHuyen?: string;
  tinhThanhPho?: string;
  maQuocGia?: string;
};

// ─── Validation functions ─────────────────────────────────────────────────────

/**
 * Validate a Vietnamese National ID (CCCD).
 * Rules: exactly 12 digits; first 3 digits must be a valid province code
 * per Circular 59/2021/TT-BCA.
 */
export function validateCCCD(raw: string): CCCDResult {
  const s = raw.replace(/[\s-]/g, "").trim();
  if (!/^\d{12}$/.test(s)) {
    const msg = "National ID must be exactly 12 digits.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  const provinceCode = s.slice(0, 3);
  if (!VALID_PROVINCE_CODES.has(provinceCode)) {
    const msg = `Province code "${provinceCode}" is not valid per Circular 59/2021/TT-BCA.`;
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  return {
    isValid: true,
    hopLe: true,
    normalized: s,
    chuanHoa: s,
    provinceCode,
    maTinh: provinceCode,
  };
}

/**
 * Validate a Vietnamese Tax Identification Number (MST).
 * - Business/organisation: 10 digits
 * - Branch/dependent unit: 10 digits + "-" + 3 digits (e.g. 0123456789-001)
 * - Individual: same as national ID (12 digits)
 */
export function validateMaSoThue(
  raw: string,
  loai: MSTLoai = "doanh-nghiep",
): TaxCodeResult {
  const s = raw.replace(/\s/g, "").trim();
  if (loai === "don-vi-phu-thuoc") {
    if (!/^\d{10}-\d{3}$/.test(s)) {
      const msg =
        "Branch TIN must be: 10 digits + '-' + 3 digits (e.g. 0123456789-001).";
      return { isValid: false, hopLe: false, error: msg, loi: msg };
    }
    return { isValid: true, hopLe: true, normalized: s, chuanHoa: s };
  }
  if (!/^\d{10}$/.test(s)) {
    const msg = "Business TIN must be exactly 10 digits.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  return { isValid: true, hopLe: true, normalized: s, chuanHoa: s };
}

/**
 * Validate a Vietnamese phone number and normalise to E.164.
 * Accepts: 0989123456, +84989123456, 84989123456
 */
export function validateSDT(raw: string): PhoneResult {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  const phone = parsePhoneNumberFromString(cleaned, "VN");
  if (phone && isValidPhoneNumber(phone.number, "VN")) {
    const e164 = phone.format("E.164");
    const localFormat = "0" + e164.slice(3);
    return {
      isValid: true,
      hopLe: true,
      e164,
      localFormat,
      noiDia: localFormat,
      normalized: e164,
      chuanHoa: e164,
    };
  }
  const msg = "Invalid Vietnamese phone number.";
  return { isValid: false, hopLe: false, error: msg, loi: msg };
}

/** Normalise a phone string to E.164, returning the original if invalid. */
export function normalizePhone(raw: string): string {
  const phone = parsePhoneNumberFromString(raw.replace(/[\s\-().]/g, ""), "VN");
  return phone ? phone.format("E.164") : raw;
}

/** Strip whitespace and hyphens from a national ID string. */
export function normalizeNationalId(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

/**
 * Validate a SWIFT/BIC code.
 * Format: 6 letters + 2 alphanumeric + optional 3 alphanumeric (8 or 11 total).
 * If the 8-character prefix matches a known Vietnamese bank, bankName is populated.
 */
export function validateSwiftBic(raw: string): SwiftResult {
  const s = raw.toUpperCase().replace(/\s/g, "");
  if (s.length !== 8 && s.length !== 11) {
    const msg = "SWIFT/BIC must be 8 or 11 characters.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(s)) {
    const msg = "SWIFT/BIC contains invalid characters.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  // Look up by 8-char prefix (branch codes strip the last 3 chars)
  const lookup = SWIFT_MAP.get(s.slice(0, 8));
  const bankName = lookup?.shortName;
  return {
    isValid: true,
    hopLe: true,
    normalized: s,
    chuanHoa: s,
    ...(bankName ? { bankName, nganHang: bankName } : {}),
  };
}

/**
 * Validate and parse a date string.
 * Accepts: dd/mm/yyyy (with optional HH:mm:ss) and any ISO 8601 string.
 * Returns the normalised ISO 8601 string and the Vietnamese display format.
 */
export function validateNgayThang(raw: string): DateResult {
  if (!raw?.trim()) {
    const msg = "Date must not be empty.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  let date: Date | null = null;
  const vnMatch = raw
    .trim()
    .match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}:\d{2}:\d{2}))?$/);
  if (vnMatch) {
    const iso = `${vnMatch[3]}-${vnMatch[2]}-${vnMatch[1]}${vnMatch[4] ? "T" + vnMatch[4] : ""}`;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) date = d;
  } else {
    const d = new Date(raw.trim());
    if (!isNaN(d.getTime())) date = d;
  }
  if (!date) {
    const msg = "Invalid date format.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  const isoString = date.toISOString();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const displayVN = `${dd}/${mm}/${date.getFullYear()}`;
  return {
    isValid: true,
    hopLe: true,
    isoString,
    displayVN,
    normalized: isoString,
    chuanHoa: isoString,
  };
}

/**
 * Validate a GS1 Vietnam EAN-13 barcode.
 * Must be exactly 13 digits, start with prefix 893, and pass checksum.
 */
export function validateBarcodeGS1VN(raw: string): BarcodeResult {
  const s = raw.replace(/\s/g, "");
  if (!/^\d{13}$/.test(s)) {
    const msg = "Barcode must be exactly 13 digits.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  if (!s.startsWith("893")) {
    const msg = "GS1 Vietnam barcodes must start with prefix 893.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(s[i]) * (i % 2 === 0 ? 1 : 3);
  const check = (10 - (sum % 10)) % 10;
  if (check !== parseInt(s[12])) {
    const msg = `Checksum mismatch (expected ${check}, got ${s[12]}).`;
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  return { isValid: true, hopLe: true, normalized: s, chuanHoa: s };
}

/**
 * Validate a VND monetary amount.
 * Accepts: number or formatted string ("1.000.000 ₫", "1,000,000 VND", "1000000").
 * Returns the value as a non-negative integer.
 */
export function validateSoTienVND(raw: number | string): AmountResult {
  let num: number;
  if (typeof raw === "number") {
    num = Math.floor(raw);
  } else {
    num = Math.floor(
      parseFloat(
        String(raw)
          .replace(/[\u20abVND\s.]/g, "")
          .replace(/,/g, ""),
      ),
    );
  }
  if (isNaN(num)) {
    const msg = "Invalid amount.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  if (num < 0) {
    const msg = "Amount must not be negative.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  return {
    isValid: true,
    hopLe: true,
    integer: num,
    soNguyen: num,
    normalized: num.toLocaleString("vi-VN") + " ₫",
  };
}

/**
 * Validate a structured Vietnamese address.
 * Only city/province is required.
 */
export function validateDiaChi(
  input: AddressComponents | DiaChiInput,
): AddressResult {
  const city =
    (input as AddressComponents).city ?? (input as DiaChiInput).tinhThanhPho;
  if (!city?.trim()) {
    const msg = "City / Province is required.";
    return { isValid: false, hopLe: false, error: msg, loi: msg };
  }
  const c = input as AddressComponents;
  const d = input as DiaChiInput;
  const parts = [
    c.streetNumber ?? d.soNha,
    c.alley ?? d.ngoHem,
    c.street ?? d.tenDuong,
    c.ward ?? d.phuongXa,
    c.district ?? d.quanHuyen,
    city,
  ].filter(Boolean);
  const normalized = parts.join(", ");
  return { isValid: true, hopLe: true, normalized, chuanHoa: normalized };
}
