/**
 * src/utils/time.ts
 *
 * @deprecated Thin compatibility shim — new code must import directly from
 * `@/lib/vn/format` (`thoiGianTuongDoi`, `formatNgayVN`).
 *
 * This file exists only so legacy admin pages continue to compile without
 * a forced mass-migration.  Do NOT add new exports here.
 */

import { thoiGianTuongDoi, formatNgayVN } from "@/lib/vn/format";

/** @deprecated Use `thoiGianTuongDoi` from `@/lib/vn/format` instead. */
export function timeAgo(dateStr: string): string {
  return thoiGianTuongDoi(dateStr);
}

/** @deprecated Use `formatNgayVN` from `@/lib/vn/format` instead. */
export function formatDate(dateStr: string): string {
  return formatNgayVN(dateStr);
}
