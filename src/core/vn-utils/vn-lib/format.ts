/**
 * src/lib/vn/format.ts
 *
 * Display-formatting helpers for Vietnamese locale standards.
 *
 * Rules:
 *   - Storage / API : raw number / ISO 8601 string
 *   - UI display    : locale "vi-VN", timezone "Asia/Ho_Chi_Minh"
 *   - VND currency  : dot-separated thousands, ₫ symbol
 *
 * Dependencies: date-fns (installed), Intl (built-in Node / browser)
 *
 * ⚠️  Update when: national currency / date display standards change.
 */

import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ─── VND currency ─────────────────────────────────────────────────────────────

/** Standard VND formatter: 1.000.000 ₫ */
const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a VND amount in Vietnamese standard notation.
 * Input: non-negative integer (unit: đồng)
 * Output: "1.000.000 ₫"
 *
 * @example formatVND(1_000_000) → "1.000.000 ₫"
 */
export function formatVND(amount: number): string {
  return VND_FORMATTER.format(amount);
}

/**
 * Compact VND format for dashboards and summary tables.
 *
 * @example
 *   formatVNDCompact(1_500_000)       → "1,5 triệu ₫"
 *   formatVNDCompact(2_500_000_000)   → "2,5 tỷ ₫"
 *   formatVNDCompact(10_000_000_000)  → "10 tỷ ₫"
 */
export function formatVNDCompact(amount: number): string {
  if (amount >= 1_000_000_000_000)
    return `${(amount / 1_000_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} nghìn tỷ ₫`;
  if (amount >= 1_000_000_000)
    return `${(amount / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ ₫`;
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu ₫`;
  if (amount >= 1_000)
    return `${(amount / 1_000).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} nghìn ₫`;
  return formatVND(amount);
}

/**
 * International VND format — compatible with foreign-facing systems.
 *
 * @example formatVNDInternational(1_000_000) → "1,000,000 VND"
 */
export function formatVNDInternational(amount: number): string {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " VND"
  );
}

/**
 * Parse a VND-formatted string into an integer.
 * Accepts: "1.000.000 ₫", "1,000,000 VND", "1000000"
 *
 * @example parseVND("1.000.000 ₫") → 1000000
 */
export function parseVND(input: string): number | null {
  const cleaned = input
    .replace(/[₫VND\s]/gi, "") // strip currency symbols
    .replace(/\./g, "") // strip VN thousands separator
    .replace(/,/g, ""); // strip international thousands separator
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? null : n;
}

// ─── Date / time ──────────────────────────────────────────────────────────────

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Format a date as dd/MM/yyyy in the Vietnam timezone.
 *
 * @example formatNgayVN("2026-08-10T07:00:00Z") → "10/08/2026"
 */
export function formatNgayVN(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const date = typeof input === "string" ? parseISO(input) : input;
  if (!isValid(date)) return "Invalid date";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: VN_TIMEZONE,
  }).format(date);
}

/**
 * Format a full datetime as dd/MM/yyyy HH:mm:ss in the Vietnam timezone.
 *
 * @example formatNgayGioVN("2026-08-10T07:00:00Z") → "10/08/2026 14:00:00"
 */
export function formatNgayGioVN(
  input: string | Date | null | undefined,
): string {
  if (!input) return "—";
  const date = typeof input === "string" ? parseISO(input) : input;
  if (!isValid(date)) return "Invalid date/time";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: VN_TIMEZONE,
  }).format(date);
}

/**
 * Format a full datetime with Vietnamese day-of-week name and ICT timezone label.
 * Use for meeting schedules and calendar events.
 *
 * @example formatNgayGioVNDayOfWeek("2026-08-10T07:00:00Z") → "Thứ Hai, 10/08/2026 14:00 (ICT)"
 */
export function formatNgayGioVNDayOfWeek(
  input: string | Date | null | undefined,
): string {
  if (!input) return "—";
  const date = typeof input === "string" ? parseISO(input) : input;
  if (!isValid(date)) return "Invalid date/time";
  return format(date, "EEEE, dd/MM/yyyy HH:mm '(ICT)'", { locale: vi });
}

/**
 * Format a date as an ISO 8601 string (UTC) for storage or API responses.
 *
 * @example formatNgayISO(new Date()) → "2026-08-10T07:00:00.000Z"
 */
export function formatNgayISO(
  input: string | Date | null | undefined,
): string | null {
  if (!input) return null;
  const date = typeof input === "string" ? parseISO(input) : input;
  if (!isValid(date)) return null;
  return date.toISOString();
}

/**
 * Human-readable relative time string in Vietnamese.
 *
 * @example thoiGianTuongDoi("2026-08-09T12:00:00Z") → "1 ngày trước"
 */
export function thoiGianTuongDoi(
  input: string | Date | null | undefined,
): string {
  if (!input) return "—";
  const date = typeof input === "string" ? parseISO(input) : input;
  if (!isValid(date)) return "—";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "vừa xong";
  if (diffSec < 3_600) return `${Math.floor(diffSec / 60)} phút trước`;
  if (diffSec < 86_400) return `${Math.floor(diffSec / 3_600)} giờ trước`;
  if (diffSec < 2_592_000) return `${Math.floor(diffSec / 86_400)} ngày trước`;
  if (diffSec < 31_536_000)
    return `${Math.floor(diffSec / 2_592_000)} tháng trước`;
  return `${Math.floor(diffSec / 31_536_000)} năm trước`;
}

// ─── Phone ────────────────────────────────────────────────────────────────────

/**
 * Display a phone number in local Vietnamese format from E.164.
 *
 * @example formatSDTNoiDia("+84989123456") → "0989123456"
 */
export function formatSDTNoiDia(e164: string | null | undefined): string {
  if (!e164) return "—";
  const s = e164.trim();
  return s.startsWith("+84") ? "0" + s.slice(3) : s;
}

/**
 * Display a phone number in international format.
 *
 * @example formatSDTQuocTe("+84989123456") → "+84 98 912 3456"
 */
export function formatSDTQuocTe(e164: string | null | undefined): string {
  if (!e164) return "—";
  try {
    const parsed = parsePhoneNumberFromString(e164);
    return parsed ? parsed.formatInternational() : e164;
  } catch {
    return e164;
  }
}
