/**
 * src/lib/vn/index.ts
 *
 * Barrel — import all Vietnam-specific utilities from one place:
 *
 *   import { validateCCCD, formatVND, DANH_SACH_TINH } from "@/core/vn-utils/vn-lib";
 *   import { zNationalId, zPhone, zTaxIdBusiness, zKyc } from "@/core/vn-utils/vn-lib";
 */

// Validators
export {
  validateCCCD,
  validateMaSoThue,
  validateSDT,
  validateSwiftBic,
  validateBarcodeGS1VN,
  validateSoTienVND,
  validateNgayThang,
  validateDiaChi,
  normalizePhone,
  normalizeNationalId,
} from "./validators";

export type {
  ValidationResult,
  CCCDResult,
  PhoneResult,
  SwiftResult,
  DateResult,
  TaxCodeResult,
  AmountResult,
  BarcodeResult,
  AddressResult,
  DiaChiInput,
  MSTLoai,
  // Backward-compat aliases
  SDTResult,
  NgayResult,
  SoTienResult,
  DiaChiResult,
  MSTResult,
} from "./validators";

// Hành chính
export {
  DANH_SACH_TINH,
  MA_TINH_HOP_LE,
  timTinhTheoMa,
  timTinhTheoTen,
  layDanhSachTinh,
} from "./hanh-chinh";

export type { DonViHanhChinh } from "./hanh-chinh";

// Ngân hàng + SWIFT
export {
  DANH_SACH_NGAN_HANG,
  SWIFT_MAP,
  timNganHangTheoSwift,
  layDanhSachNganHang,
} from "./swift-ngan-hang";

export type { NganHangVN } from "./swift-ngan-hang";

// Định dạng hiển thị
export {
  formatVND,
  formatVNDCompact,
  formatVNDInternational,
  parseVND,
  formatNgayVN,
  formatNgayGioVN,
  formatNgayGioVNDayOfWeek,
  formatNgayISO,
  thoiGianTuongDoi,
  formatSDTNoiDia,
  formatSDTQuocTe,
} from "./format";

// Middleware — normalise VN fields in API route bodies
export {
  normalizeInputVN,
  kiemTraLoiChuanHoa,
  // backward-compat aliases
  normalizeInputVN as normalizeAllVNFields,
} from "./middleware-chuan-hoa";

export type { TruongNhayCanm, KetQuaChuanHoa } from "./middleware-chuan-hoa";
// backward-compat alias
export type { KetQuaChuanHoa as KetQuaNormalize } from "./middleware-chuan-hoa";

// ── Zod schemas (re-exported for convenience) ────────────────────────────────
export {
  // Primary names
  zNationalId,
  zNationalIdOptional,
  zTaxIdBusiness,
  zTaxIdBranch,
  zTaxIdIndividual,
  zPhone,
  zPhoneOptional,
  zSwiftBic,
  zSwiftBicOptional,
  zAmountVND,
  zAmountVNDOptional,
  zBarcodeGS1,
  zDate,
  zDateOptional,
  zAddress,
  zKyc,
  // Backward-compat aliases
  zCCCD,
  zCCCDOptional,
  zMSTDN,
  zMSTPhuThuoc,
  zMSTCaNhan,
  zSDTVN,
  zSDTVNOptional,
  zSoTienVND,
  zSoTienVNDOptional,
  zBarcodeGS1VN,
  zNgayThang,
  zNgayThangOptional,
  zDiaChiVN,
  zKycVN,
} from "./zod-vn";

export type {
  AddressInput,
  KycInput,
  // Backward-compat
  DiaChiVNInput,
  KycVNInput,
} from "./zod-vn";
