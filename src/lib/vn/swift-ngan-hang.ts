/**
 * src/lib/vn/swift-ngan-hang.ts
 *
 * SWIFT/BIC codes for Vietnamese banks — config-driven.
 * Update this file (never the validation logic) when banks merge,
 * rename or receive new SWIFT codes.
 *
 * ⚠️  Update when: bank mergers, renames, or new SWIFT assignments.
 * Sources: https://www.swift.com/standards/data-standards/bic
 *          and each bank's official website.
 *
 * Version: 2026-08-10
 */

export interface VietnamBank {
  /** SWIFT/BIC code — 8 or 11 characters */
  swift: string;
  /** Full official Vietnamese name */
  name: string;
  /** Common abbreviated name */
  shortName: string;
  /** Full English name */
  nameEn: string;
  /** Official website */
  website?: string;
  /** Short display label for dropdowns */
  label: string;
}

// Backward-compat alias
export type NganHangVN = VietnamBank & {
  /** @deprecated Use name */      ten?: string;
  /** @deprecated Use shortName */ tenViet?: string;
  /** @deprecated Use nameEn */    tenEn?: string;
  /** @deprecated Use label */     nhanHan?: string;
};

function bank(swift: string, name: string, shortName: string, nameEn: string, website?: string): NganHangVN {
  return { swift, name, shortName, nameEn, website, label: `${shortName} (${swift})`, ten: name, tenViet: shortName, tenEn: nameEn, nhanHan: `${shortName} (${swift})` };
}

export const DANH_SACH_NGAN_HANG: NganHangVN[] = [
  // ── State-owned commercial banks ──────────────────────────────────────────
  bank("BFTVVNVX", "Ngân hàng TMCP Ngoại thương Việt Nam",             "Vietcombank",        "Joint Stock Commercial Bank for Foreign Trade of Vietnam",          "https://www.vietcombank.com.vn"),
  bank("ICBVVNVX", "Ngân hàng TMCP Công thương Việt Nam",              "VietinBank",         "Vietnam Joint Stock Commercial Bank for Industry and Trade",         "https://www.vietinbank.vn"),
  bank("BIDVVNVX", "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",     "BIDV",               "Bank for Investment and Development of Vietnam",                     "https://www.bidv.com.vn"),
  bank("VBAAVNVX", "Ngân hàng Nông nghiệp và Phát triển Nông thôn VN", "Agribank",           "Vietnam Bank for Agriculture and Rural Development",                 "https://www.agribank.com.vn"),
  // ── Major private commercial banks ────────────────────────────────────────
  bank("VTCBVNVX", "Ngân hàng TMCP Kỹ thương Việt Nam",                "Techcombank",        "Vietnam Technological and Commercial Joint Stock Bank",              "https://www.techcombank.com.vn"),
  bank("ASCBVNVX", "Ngân hàng TMCP Á Châu",                            "ACB",                "Asia Commercial Joint Stock Bank",                                   "https://www.acb.com.vn"),
  bank("VPBKVNVX", "Ngân hàng TMCP Việt Nam Thịnh Vượng",              "VPBank",             "Vietnam Prosperity Joint Stock Commercial Bank",                     "https://www.vpbank.com.vn"),
  bank("MCOBVNVX", "Ngân hàng TMCP Quân đội",                          "MB Bank",            "Military Commercial Joint Stock Bank",                               "https://www.mbbank.com.vn"),
  bank("SGGVVNVX", "Ngân hàng TMCP Sài Gòn",                           "SCB",                "Saigon Commercial Bank",                                             "https://www.scb.com.vn"),
  bank("SHHBVNVX", "Ngân hàng TMCP Sài Gòn - Hà Nội",                 "SHB",                "Saigon-Hanoi Commercial Joint Stock Bank",                           "https://www.shb.com.vn"),
  bank("EACBVNVX", "Ngân hàng TMCP Đông Á",                            "DongA Bank",         "Dong A Commercial Joint Stock Bank"),
  bank("SACLVNVX", "Ngân hàng TMCP Sài Gòn Thương Tín",               "Sacombank",          "Saigon Thuong Tin Commercial Joint Stock Bank",                     "https://www.sacombank.com.vn"),
  bank("ORCOVNVX", "Ngân hàng TMCP Phương Đông",                       "OCB",                "Orient Commercial Joint Stock Bank",                                 "https://www.ocb.com.vn"),
  bank("HLBBVNVX", "Ngân hàng TMCP Bưu điện Liên Việt",               "LienVietPostBank",   "LienViet Post Joint Stock Commercial Bank",                          "https://www.lienvietpostbank.com.vn"),
  bank("TPBVVNVX", "Ngân hàng TMCP Tiên Phong",                        "TPBank",             "Tien Phong Commercial Joint Stock Bank",                             "https://www.tpb.vn"),
  bank("MSCBVNVX", "Ngân hàng TMCP Hàng Hải",                          "MSB",                "Maritime Bank",                                                      "https://www.msb.com.vn"),
  bank("ABVIVNVX", "Ngân hàng TMCP An Bình",                           "ABBank",             "An Binh Commercial Joint Stock Bank",                                "https://www.abbank.vn"),
  bank("NVBAVNVX", "Ngân hàng TMCP Nam Việt",                          "NVB",                "Nam Viet Commercial Joint Stock Bank"),
  bank("SBNKVNVX", "Ngân hàng TMCP Bản Việt",                          "VietCapital Bank",   "Viet Capital Commercial Joint Stock Bank"),
  bank("VBSPVNVX", "Ngân hàng TMCP Việt Nam Thương Tín",               "VietBank",           "Vietnam Thuong Tin Commercial Joint Stock Bank"),
  bank("WBVNVNVX", "Ngân hàng TMCP Woori Việt Nam",                    "Woori Bank VN",      "Woori Bank Vietnam"),
];

/** O(1) lookup map: SWIFT code → VietnamBank */
export const SWIFT_MAP: Map<string, NganHangVN> = new Map(
  DANH_SACH_NGAN_HANG.map((b) => [b.swift.toUpperCase(), b])
);

/** Look up a bank by SWIFT code (case-insensitive). */
export function timNganHangTheoSwift(swift: string): NganHangVN | undefined {
  return SWIFT_MAP.get(swift.toUpperCase().trim());
}

/** Return the full bank list — use for dropdown rendering. */
export function layDanhSachNganHang(): NganHangVN[] {
  return DANH_SACH_NGAN_HANG;
}
