/**
 * src/lib/vn/__tests__/validators.test.ts
 *
 * Unit tests for all Vietnamese validators.
 * Run: npx tsx --test src/lib/vn/__tests__/validators.test.ts
 *
 * All assertions use the canonical international API:
 *   isValid, error, normalized, e164, localFormat, integer, isoString, displayVN, bankName, provinceCode
 *
 * ⚠️  Update when regulations change:
 *   - New province codes → add test case with new code
 *   - New TIN format → update MST test cases
 *   - New phone prefixes → add SDT test case
 */

import { strict as assert } from "assert";
import { test, describe } from "node:test";

import {
  validateCCCD,
  validateMaSoThue,
  validateSDT,
  validateSwiftBic,
  validateBarcodeGS1VN,
  validateSoTienVND,
  validateNgayThang,
  validateDiaChi,
} from "../validators";

// ─── 1. CCCD ─────────────────────────────────────────────────────────────────

describe("validateCCCD", () => {
  test("Valid CCCD — Ho Chi Minh City (079)", () => {
    const r = validateCCCD("079056789012");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "079056789012");
    assert.equal(r.provinceCode, "079");
  });

  test("Valid CCCD — Hanoi (001)", () => {
    const r = validateCCCD("001056789012");
    assert.equal(r.isValid, true);
  });

  test("Valid CCCD — Quang Nam (049)", () => {
    const r = validateCCCD("049156789012");
    assert.equal(r.isValid, true);
  });

  test("Invalid — fewer than 12 digits", () => {
    const r = validateCCCD("07905678901");  // 11 digits
    assert.equal(r.isValid, false);
    assert.match(r.error!, /12/);
  });

  test("Invalid — non-digit character", () => {
    const r = validateCCCD("07905678901X");
    assert.equal(r.isValid, false);
  });

  test("Invalid — province code 000", () => {
    const r = validateCCCD("000056789012");
    assert.equal(r.isValid, false);
    assert.match(r.error!, /[Pp]rovince/i);
  });

  test("Invalid — fictitious province 999", () => {
    const r = validateCCCD("999056789012");
    assert.equal(r.isValid, false);
  });

  test("Trims surrounding whitespace", () => {
    const r = validateCCCD("  079056789012  ");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "079056789012");
  });
});

// ─── 2. Tax Identification Number (MST) ─────────────────────────────────────

describe("validateMaSoThue", () => {
  test("Valid corporate TIN — 10 digits", () => {
    const r = validateMaSoThue("0123456789", "doanh-nghiep");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "0123456789");
  });

  test("Invalid corporate TIN — fewer than 10 digits", () => {
    const r = validateMaSoThue("012345678", "doanh-nghiep");
    assert.equal(r.isValid, false);
    assert.match(r.error!, /10/);
  });

  test("Invalid corporate TIN — more than 10 digits", () => {
    const r = validateMaSoThue("01234567890", "doanh-nghiep");
    assert.equal(r.isValid, false);
  });

  test("Valid branch TIN — 10-3 format", () => {
    const r = validateMaSoThue("0123456789-001", "don-vi-phu-thuoc");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "0123456789-001");
  });

  test("Invalid branch TIN — missing hyphen", () => {
    const r = validateMaSoThue("0123456789001", "don-vi-phu-thuoc");
    assert.equal(r.isValid, false);
    assert.match(r.error!, /[Bb]ranch|[-–]/);
  });

  test("Invalid branch TIN — 10-4 (too long)", () => {
    const r = validateMaSoThue("0123456789-0012", "don-vi-phu-thuoc");
    assert.equal(r.isValid, false);
  });
});

// ─── 3. Vietnamese Phone Number (SDT) ────────────────────────────────────────

describe("validateSDT", () => {
  test("Local 0-prefix format", () => {
    const r = validateSDT("0989123456");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84989123456");
    assert.equal(r.localFormat, "0989123456");
  });

  test("E.164 format", () => {
    const r = validateSDT("+84989123456");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84989123456");
  });

  test("Country code 84 without +", () => {
    const r = validateSDT("84989123456");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84989123456");
  });

  test("Country code 0084", () => {
    const r = validateSDT("0084989123456");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84989123456");
  });

  test("Viettel 032 prefix", () => {
    const r = validateSDT("0321234567");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84321234567");
  });

  test("Vietnamobile 056 prefix", () => {
    const r = validateSDT("0561234567");
    assert.equal(r.isValid, true);
  });

  test("Invalid — too short", () => {
    const r = validateSDT("098912");
    assert.equal(r.isValid, false);
  });

  test("Invalid — non-VN country code", () => {
    const r = validateSDT("+1234567890");
    assert.equal(r.isValid, false);
  });

  test("Normalizes hyphens to E.164", () => {
    const r = validateSDT("0912-345-678");
    assert.equal(r.isValid, true);
    assert.equal(r.e164, "+84912345678");
  });
});

// ─── 4. SWIFT/BIC ─────────────────────────────────────────────────────────────

describe("validateSwiftBic", () => {
  test("Valid — Vietcombank 8-char SWIFT", () => {
    const r = validateSwiftBic("BFTVVNVX");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "BFTVVNVX");
    assert.match(r.bankName!, /Vietcombank/i);
  });

  test("Valid — Techcombank SWIFT", () => {
    const r = validateSwiftBic("VTCBVNVX");
    assert.equal(r.isValid, true);
    assert.match(r.bankName!, /Techcombank/i);
  });

  test("Valid — 11-char SWIFT with branch code", () => {
    const r = validateSwiftBic("BFTVVNVXXXX");
    assert.equal(r.isValid, true);
  });

  test("Invalid — 7 characters", () => {
    const r = validateSwiftBic("BFTVVNV");
    assert.equal(r.isValid, false);
    assert.match(r.error!, /8 or 11|8 hoặc 11/i);
  });

  test("Normalizes lowercase to uppercase", () => {
    const r = validateSwiftBic("bftvvnvx");
    assert.equal(r.isValid, true);
    assert.equal(r.normalized, "BFTVVNVX");
  });

  test("Invalid — special character in code", () => {
    const r = validateSwiftBic("BFTV-NVX");
    assert.equal(r.isValid, false);
  });
});

// ─── 5. GS1 Vietnam Barcode ──────────────────────────────────────────────────

describe("validateBarcodeGS1VN", () => {
  // EAN-13 with prefix 893 and valid checksum:
  // sum = 8*1+9*3+3*1+0*3+0*1+0*3+0*1+0*3+0*1+0*3+0*1+0*3 = 8+27+3 = 38 → (10-(38%10))%10 = 2
  test("Valid GS1 VN barcode", () => {
    const r = validateBarcodeGS1VN("8930000000002");
    assert.equal(r.isValid, true);
  });

  test("Invalid — fewer than 13 digits", () => {
    const r = validateBarcodeGS1VN("893000000000");  // 12 digits
    assert.equal(r.isValid, false);
    assert.match(r.error!, /13/);
  });

  test("Invalid — prefix not 893", () => {
    const r = validateBarcodeGS1VN("4006381333931");  // German prefix 400
    assert.equal(r.isValid, false);
    assert.match(r.error!, /893/);
  });

  test("Invalid — non-digit character", () => {
    const r = validateBarcodeGS1VN("893000000000X");
    assert.equal(r.isValid, false);
    assert.match(r.error!, /digit|chữ số/i);
  });
});

// ─── 6. VND Amount ───────────────────────────────────────────────────────────

describe("validateSoTienVND", () => {
  test("Valid integer", () => {
    const r = validateSoTienVND(1000000);
    assert.equal(r.isValid, true);
    assert.equal(r.integer, 1000000);
  });

  test("Valid numeric string", () => {
    const r = validateSoTienVND("1000000");
    assert.equal(r.isValid, true);
    assert.equal(r.integer, 1000000);
  });

  test("Valid string with ₫ symbol and dot separators", () => {
    const r = validateSoTienVND("1.000.000 ₫");
    assert.equal(r.isValid, true);
    assert.equal(r.integer, 1000000);
  });

  test("Invalid — negative amount", () => {
    const r = validateSoTienVND(-1000);
    assert.equal(r.isValid, false);
    assert.match(r.error!, /negative|âm/i);
  });

  test("Valid — zero", () => {
    const r = validateSoTienVND(0);
    assert.equal(r.isValid, true);
    assert.equal(r.integer, 0);
  });

  test("Decimal floors to integer", () => {
    const r = validateSoTienVND(999.9);
    assert.equal(r.isValid, true);
    assert.equal(r.integer, 999);
  });
});

// ─── 7. Date / Time ───────────────────────────────────────────────────────────

describe("validateNgayThang", () => {
  test("Valid ISO 8601 date", () => {
    const r = validateNgayThang("2026-08-10");
    assert.equal(r.isValid, true);
    assert.ok(r.isoString);
    assert.match(r.isoString!, /^2026-08-10/);
  });

  test("Valid ISO 8601 datetime", () => {
    const r = validateNgayThang("2026-08-10T14:00:00+07:00");
    assert.equal(r.isValid, true);
  });

  test("Valid Vietnamese dd/mm/yyyy format", () => {
    const r = validateNgayThang("10/08/2026");
    assert.equal(r.isValid, true);
    assert.match(r.isoString!, /^2026-08-10/);
  });

  test("Valid Vietnamese dd/mm/yyyy HH:mm:ss format", () => {
    const r = validateNgayThang("10/08/2026 14:00:00");
    assert.equal(r.isValid, true);
  });

  test("Invalid — non-date string", () => {
    const r = validateNgayThang("not a date");
    assert.equal(r.isValid, false);
    assert.ok(r.error);
  });

  test("Invalid — empty string", () => {
    const r = validateNgayThang("");
    assert.equal(r.isValid, false);
  });

  test("displayVN is formatted as dd/mm/yyyy", () => {
    const r = validateNgayThang("2026-08-10");
    assert.ok(r.displayVN);
    assert.match(r.displayVN!, /\d{2}\/\d{2}\/\d{4}/);
  });
});

// ─── 8. Address ──────────────────────────────────────────────────────────────

describe("validateDiaChi", () => {
  test("Valid full address", () => {
    const r = validateDiaChi({
      soNha: "123",
      tenDuong: "Nguyễn Văn Cừ",
      phuongXa: "Phường 4",
      quanHuyen: "Quận 5",
      tinhThanhPho: "Thành phố Hồ Chí Minh",
    });
    assert.equal(r.isValid, true);
    assert.match(r.normalized!, /Hồ Chí Minh/);
  });

  test("Invalid — missing province/city", () => {
    const r = validateDiaChi({ soNha: "123", tenDuong: "ABC" });
    assert.equal(r.isValid, false);
    assert.match(r.error!, /[Pp]rovince|Tỉnh/i);
  });

  test("Valid — province only (minimum required)", () => {
    const r = validateDiaChi({ tinhThanhPho: "Hà Nội" });
    assert.equal(r.isValid, true);
  });
});

console.log("✅ All validator unit tests defined. Run: npx tsx --test src/lib/vn/__tests__/validators.test.ts");
