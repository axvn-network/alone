/**
 * src/lib/vn/middleware-chuan-hoa.ts
 *
 * Input-normalisation middleware for Vietnamese identity fields.
 * Call normalizeInputVN() in every API route handler that receives
 * national ID, tax ID, or phone number data before processing or storage.
 *
 * Principle: preserve both the raw user-supplied value and the normalised
 * value to support auditing, debugging and legal compliance.
 */

import { validateCCCD, validateMaSoThue, validateSDT } from "./validators";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Normalisation result for a single sensitive field. */
export interface SensitiveField {
  /** Value exactly as entered by the user */
  rawValue: string;
  /** Normalised value (trimmed, uppercased, E.164, etc.) */
  normalizedValue: string;
  /** Whether the value is valid */
  isValid: boolean;
  /** Validation error message (only set when isValid is false) */
  error?: string;
}

/** Full normalisation result for a request body. */
export interface NormalisedInput {
  /** National ID (CCCD) field, if present in the body */
  nationalId?: SensitiveField;
  /** Tax ID (MST) field, if present in the body */
  taxId?: SensitiveField;
  /** Phone number field, if present in the body */
  phone?: SensitiveField;
  /** All other fields — trimmed but otherwise unchanged */
  rest: Record<string, unknown>;
}

// Backward-compat aliases for existing callers
export type TruongNhayCanm = SensitiveField;
export type KetQuaChuanHoa = NormalisedInput & {
  /** @deprecated Use nationalId */  cccd?: SensitiveField;
  /** @deprecated Use taxId */       maSoThue?: SensitiveField;
  /** @deprecated Use phone */       soDienThoai?: SensitiveField;
};

// ─── Main normalisation function ──────────────────────────────────────────────

/**
 * Normalise all identity fields in a parsed JSON request body.
 *
 * @param body - Parsed request body (result of `await req.json()`)
 * @returns Object with each recognised field normalised + raw value preserved
 *
 * @example
 * ```ts
 * const body = await req.json();
 * const { nationalId, phone, rest } = normalizeInputVN(body);
 * if (nationalId && !nationalId.isValid) return badRequestResponse(nationalId.error!);
 * await Model.create({
 *   nationalIdRaw:        nationalId?.rawValue,
 *   nationalId:           nationalId?.normalizedValue, // AES-256-GCM encrypted
 * });
 * ```
 */
export function normalizeInputVN(body: Record<string, unknown>): KetQuaChuanHoa {
  const result: KetQuaChuanHoa = { rest: {} };

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") {
      result.rest[key] = value;
      continue;
    }

    const s = value.trim();

    if (isNationalIdField(key)) {
      const kq = validateCCCD(s);
      const field: SensitiveField = {
        rawValue:        s,
        normalizedValue: kq.normalized ?? s,
        isValid:         kq.isValid,
        error:           kq.error,
      };
      result.nationalId = field;
      result.cccd       = field; // backward-compat
      continue;
    }

    if (isTaxIdField(key)) {
      const loai = body.loaiMST as "doanh-nghiep" | "don-vi-phu-thuoc" | "ca-nhan" | undefined;
      const kq = validateMaSoThue(s, loai ?? "doanh-nghiep");
      const field: SensitiveField = {
        rawValue:        s,
        normalizedValue: kq.normalized ?? s.toUpperCase(),
        isValid:         kq.isValid,
        error:           kq.error,
      };
      result.taxId      = field;
      result.maSoThue   = field; // backward-compat
      continue;
    }

    if (isPhoneField(key)) {
      const kq = validateSDT(s);
      const field: SensitiveField = {
        rawValue:        s,
        normalizedValue: kq.e164 ?? kq.normalized ?? s,
        isValid:         kq.isValid,
        error:           kq.error,
      };
      result.phone        = field;
      result.soDienThoai  = field; // backward-compat
      continue;
    }

    // All other string fields: trim only
    result.rest[key] = s;
  }

  return result;
}

// ─── Field-type detection helpers ─────────────────────────────────────────────

function isNationalIdField(key: string): boolean {
  const patterns = ["cccd", "soCCCD", "sodinhdanh", "nationalId", "identityNumber", "cmt"];
  return patterns.some((p) => key.toLowerCase().includes(p.toLowerCase()));
}

function isTaxIdField(key: string): boolean {
  const patterns = ["maSoThue", "mst", "taxCode", "taxNumber", "taxId"];
  return patterns.some((p) => key.toLowerCase().includes(p.toLowerCase()));
}

function isPhoneField(key: string): boolean {
  const patterns = ["phone", "soDienThoai", "sdt", "mobile", "dienthoai", "tel"];
  return patterns.some((p) => key.toLowerCase().includes(p.toLowerCase()));
}

// ─── Convenience helper for route handlers ────────────────────────────────────

/**
 * Return the first validation error found in a normalised input, or null if all valid.
 * Use in API routes immediately after normalizeInputVN().
 *
 * @returns An error message string, or null when everything is valid.
 */
export function kiemTraLoiChuanHoa(input: KetQuaChuanHoa): string | null {
  if (input.nationalId && !input.nationalId.isValid)
    return input.nationalId.error ?? "Invalid national ID";
  if (input.taxId && !input.taxId.isValid)
    return input.taxId.error ?? "Invalid tax ID";
  if (input.phone && !input.phone.isValid)
    return input.phone.error ?? "Invalid phone number";
  return null;
}

/** @deprecated Use kiemTraLoiChuanHoa — name kept for backward compatibility */
export const validateNormalisedInput = kiemTraLoiChuanHoa;
