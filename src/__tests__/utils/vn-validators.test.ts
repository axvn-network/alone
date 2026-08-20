/**
 * Unit tests — Vietnamese validators (Vitest port of vn-lib/__tests__/validators.test.ts)
 *
 * This is a Vitest-native port of the legacy node:test format file.
 * The original file uses node:test runner and is excluded from vitest.config.
 *
 * Run: npx vitest run src/__tests__/utils/vn-validators.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  validateCCCD,
  validateMaSoThue,
  validateSDT,
  validateSwiftBic,
  validateBarcodeGS1VN,
  validateSoTienVND,
  validateNgayThang,
  validateDiaChi,
} from "@/core/vn-utils/vn-lib/validators";

// ─── 1. CCCD ─────────────────────────────────────────────────────────────────

describe("validateCCCD", () => {
  it("validates Ho Chi Minh City (079) CCCD", () => {
    const r = validateCCCD("079056789012");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("079056789012");
    expect(r.provinceCode).toBe("079");
  });

  it("validates Hanoi (001) CCCD", () => {
    expect(validateCCCD("001056789012").isValid).toBe(true);
  });

  it("validates Quang Nam (049) CCCD", () => {
    expect(validateCCCD("049156789012").isValid).toBe(true);
  });

  it("rejects fewer than 12 digits (11 digits)", () => {
    const r = validateCCCD("07905678901");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/12/);
  });

  it("rejects non-digit character", () => {
    expect(validateCCCD("07905678901X").isValid).toBe(false);
  });

  it("rejects province code 000", () => {
    const r = validateCCCD("000056789012");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/[Pp]rovince/i);
  });

  it("rejects fictitious province 999", () => {
    expect(validateCCCD("999056789012").isValid).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const r = validateCCCD("  079056789012  ");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("079056789012");
  });

  it("backward-compat: sets hopLe alias", () => {
    expect(validateCCCD("079056789012").hopLe).toBe(true);
    expect(validateCCCD("000056789012").hopLe).toBe(false);
  });

  it("backward-compat: sets maTinh alias", () => {
    const r = validateCCCD("079056789012");
    expect(r.maTinh).toBe("079");
  });
});

// ─── 2. Tax Identification Number (MST) ─────────────────────────────────────

describe("validateMaSoThue", () => {
  it("validates 10-digit corporate TIN", () => {
    const r = validateMaSoThue("0123456789", "doanh-nghiep");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("0123456789");
  });

  it("rejects corporate TIN with fewer than 10 digits", () => {
    const r = validateMaSoThue("012345678", "doanh-nghiep");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/10/);
  });

  it("rejects corporate TIN with more than 10 digits", () => {
    expect(validateMaSoThue("01234567890", "doanh-nghiep").isValid).toBe(false);
  });

  it("validates branch TIN in 10-3 format", () => {
    const r = validateMaSoThue("0123456789-001", "don-vi-phu-thuoc");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("0123456789-001");
  });

  it("rejects branch TIN without hyphen", () => {
    const r = validateMaSoThue("0123456789001", "don-vi-phu-thuoc");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/[Bb]ranch|[-–]/);
  });

  it("rejects branch TIN with 4-digit suffix (too long)", () => {
    expect(validateMaSoThue("0123456789-0012", "don-vi-phu-thuoc").isValid).toBe(false);
  });

  it("defaults to doanh-nghiep type when omitted", () => {
    expect(validateMaSoThue("0123456789").isValid).toBe(true);
    expect(validateMaSoThue("012345678").isValid).toBe(false);
  });
});

// ─── 3. Vietnamese Phone Number (SDT) ────────────────────────────────────────

describe("validateSDT", () => {
  it("validates local 0-prefix format", () => {
    const r = validateSDT("0989123456");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84989123456");
    expect(r.localFormat).toBe("0989123456");
  });

  it("validates E.164 format", () => {
    const r = validateSDT("+84989123456");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84989123456");
  });

  it("validates country code 84 without +", () => {
    const r = validateSDT("84989123456");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84989123456");
  });

  it("validates 0084 prefix", () => {
    const r = validateSDT("0084989123456");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84989123456");
  });

  it("validates Viettel 032 prefix", () => {
    const r = validateSDT("0321234567");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84321234567");
  });

  it("validates Vietnamobile 056 prefix", () => {
    expect(validateSDT("0561234567").isValid).toBe(true);
  });

  it("rejects too-short number", () => {
    expect(validateSDT("098912").isValid).toBe(false);
  });

  it("rejects non-VN country code", () => {
    expect(validateSDT("+1234567890").isValid).toBe(false);
  });

  it("normalises hyphens to E.164", () => {
    const r = validateSDT("0912-345-678");
    expect(r.isValid).toBe(true);
    expect(r.e164).toBe("+84912345678");
  });

  it("backward-compat: sets noiDia alias", () => {
    const r = validateSDT("0989123456");
    expect(r.noiDia).toBe("0989123456");
  });
});

// ─── 4. SWIFT/BIC ─────────────────────────────────────────────────────────────

describe("validateSwiftBic", () => {
  it("validates Vietcombank 8-char SWIFT", () => {
    const r = validateSwiftBic("BFTVVNVX");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("BFTVVNVX");
    expect(r.bankName).toMatch(/Vietcombank/i);
  });

  it("validates Techcombank SWIFT", () => {
    const r = validateSwiftBic("VTCBVNVX");
    expect(r.isValid).toBe(true);
    expect(r.bankName).toMatch(/Techcombank/i);
  });

  it("validates 11-char SWIFT with branch code", () => {
    expect(validateSwiftBic("BFTVVNVXXXX").isValid).toBe(true);
  });

  it("rejects 7-character SWIFT", () => {
    const r = validateSwiftBic("BFTVVNV");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/8 or 11|8 hoặc 11/i);
  });

  it("normalises lowercase to uppercase", () => {
    const r = validateSwiftBic("bftvvnvx");
    expect(r.isValid).toBe(true);
    expect(r.normalized).toBe("BFTVVNVX");
  });

  it("rejects special characters in code", () => {
    expect(validateSwiftBic("BFTV-NVX").isValid).toBe(false);
  });

  it("backward-compat: sets nganHang alias for known banks", () => {
    const r = validateSwiftBic("BFTVVNVX");
    expect(r.nganHang).toMatch(/Vietcombank/i);
  });
});

// ─── 5. GS1 Vietnam Barcode ──────────────────────────────────────────────────

describe("validateBarcodeGS1VN", () => {
  // sum(8*1,9*3,3*1,0*3,...) → check digit = 2
  it("validates a correctly checksummed GS1 VN barcode", () => {
    expect(validateBarcodeGS1VN("8930000000002").isValid).toBe(true);
  });

  it("rejects fewer than 13 digits", () => {
    const r = validateBarcodeGS1VN("893000000000"); // 12 digits
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/13/);
  });

  it("rejects prefix that is not 893", () => {
    const r = validateBarcodeGS1VN("4006381333931");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/893/);
  });

  it("rejects non-digit character", () => {
    const r = validateBarcodeGS1VN("893000000000X");
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/digit|chữ số/i);
  });

  it("rejects invalid checksum", () => {
    // Valid prefix + length but wrong check digit (002 → swap last to 3)
    expect(validateBarcodeGS1VN("8930000000003").isValid).toBe(false);
  });
});

// ─── 6. VND Amount ───────────────────────────────────────────────────────────

describe("validateSoTienVND", () => {
  it("validates integer amount", () => {
    const r = validateSoTienVND(1_000_000);
    expect(r.isValid).toBe(true);
    expect(r.integer).toBe(1_000_000);
  });

  it("validates numeric string", () => {
    const r = validateSoTienVND("1000000");
    expect(r.isValid).toBe(true);
    expect(r.integer).toBe(1_000_000);
  });

  it("validates formatted string with ₫ symbol and dots", () => {
    const r = validateSoTienVND("1.000.000 ₫");
    expect(r.isValid).toBe(true);
    expect(r.integer).toBe(1_000_000);
  });

  it("rejects negative amount", () => {
    const r = validateSoTienVND(-1_000);
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/negative|âm/i);
  });

  it("validates zero", () => {
    const r = validateSoTienVND(0);
    expect(r.isValid).toBe(true);
    expect(r.integer).toBe(0);
  });

  it("floors decimal to integer", () => {
    const r = validateSoTienVND(999.9);
    expect(r.isValid).toBe(true);
    expect(r.integer).toBe(999);
  });

  it("backward-compat: sets soNguyen alias", () => {
    expect(validateSoTienVND(500_000).soNguyen).toBe(500_000);
  });

  it("normalized field is formatted VND string", () => {
    const r = validateSoTienVND(1_000_000);
    expect(r.normalized).toContain("₫");
  });
});

// ─── 7. Date / Time ───────────────────────────────────────────────────────────

describe("validateNgayThang", () => {
  it("validates ISO 8601 date", () => {
    const r = validateNgayThang("2026-08-10");
    expect(r.isValid).toBe(true);
    expect(r.isoString).toMatch(/^2026-08-10/);
  });

  it("validates ISO 8601 datetime with timezone", () => {
    expect(validateNgayThang("2026-08-10T14:00:00+07:00").isValid).toBe(true);
  });

  it("validates Vietnamese dd/mm/yyyy format", () => {
    const r = validateNgayThang("10/08/2026");
    expect(r.isValid).toBe(true);
    expect(r.isoString).toMatch(/^2026-08-10/);
  });

  it("validates Vietnamese dd/mm/yyyy HH:mm:ss format", () => {
    expect(validateNgayThang("10/08/2026 14:00:00").isValid).toBe(true);
  });

  it("rejects non-date string", () => {
    const r = validateNgayThang("not a date");
    expect(r.isValid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("rejects empty string", () => {
    expect(validateNgayThang("").isValid).toBe(false);
  });

  it("displayVN is formatted as dd/mm/yyyy", () => {
    const r = validateNgayThang("2026-08-10");
    expect(r.displayVN).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("isoString is a valid ISO date string", () => {
    const r = validateNgayThang("2026-08-10");
    if (r.isValid && r.isoString) {
      expect(new Date(r.isoString).toISOString()).toBeTruthy();
    }
  });
});

// ─── 8. Address ──────────────────────────────────────────────────────────────

describe("validateDiaChi", () => {
  it("validates a full address", () => {
    const r = validateDiaChi({
      soNha: "123",
      tenDuong: "Nguyễn Văn Cừ",
      phuongXa: "Phường 4",
      quanHuyen: "Quận 5",
      tinhThanhPho: "Thành phố Hồ Chí Minh",
    });
    expect(r.isValid).toBe(true);
    expect(r.normalized).toMatch(/Hồ Chí Minh/);
  });

  it("rejects input missing province/city", () => {
    const r = validateDiaChi({ soNha: "123", tenDuong: "ABC" });
    expect(r.isValid).toBe(false);
    expect(r.error).toMatch(/[Pp]rovince|Tỉnh/i);
  });

  it("validates with province only (minimum required)", () => {
    expect(validateDiaChi({ tinhThanhPho: "Hà Nội" }).isValid).toBe(true);
  });

  it("accepts AddressComponents API (city field)", () => {
    const r = validateDiaChi({ city: "Hà Nội", street: "Đinh Tiên Hoàng" });
    expect(r.isValid).toBe(true);
    expect(r.normalized).toContain("Hà Nội");
  });

  it("normalized contains all provided parts", () => {
    const r = validateDiaChi({
      soNha: "1",
      tenDuong: "Hai Bà Trưng",
      tinhThanhPho: "Hà Nội",
    });
    if (r.isValid) {
      expect(r.normalized).toContain("1");
      expect(r.normalized).toContain("Hai Bà Trưng");
      expect(r.normalized).toContain("Hà Nội");
    }
  });

  it("backward-compat: sets chuanHoa alias", () => {
    const r = validateDiaChi({ tinhThanhPho: "Đà Nẵng" });
    expect(r.chuanHoa).toBeTruthy();
    expect(r.chuanHoa).toContain("Đà Nẵng");
  });
});
