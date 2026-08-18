/**
 * src/core/vn-utils/vn-lib/hanh-chinh.ts
 *
 * Danh sách mã đơn vị hành chính Việt Nam — CONFIG-DRIVEN.
 *
 * ⚠️  CẦN CẬP NHẬT KHI:
 *   - Nhà nước thực hiện sáp nhập tỉnh/thành (cần update `DANH_SACH_TINH`)
 *   - Thay đổi mã tỉnh theo Nghị quyết UBTVQH
 *
 * Để cập nhật: Chỉ cần chỉnh sửa danh sách `DANH_SACH_TINH` dưới đây.
 *
 * Phiên bản dữ liệu: 2026-08-10 (63 tỉnh/thành hiện hành)
 */

export interface DonViHanhChinh {
  ma: string;       // Mã 3 chữ số (dùng trong CCCD)
  ten: string;      // Tên đầy đủ
  tenViet: string;  // Tên không dấu (để tìm kiếm)
  vung: "Bắc" | "Trung" | "Nam";
  capTinh: "Thành phố trực thuộc TW" | "Tỉnh";
  hieuLuc: boolean; // false = đã sáp nhập/giải thể
}

/**
 * Danh sách 63 tỉnh/thành phố Việt Nam hiện hành (2025).
 * Mã 3 chữ số đầu trong CCCD theo Thông tư 59/2021/TT-BCA.
 */
export const DANH_SACH_TINH: DonViHanhChinh[] = [
  // ── Miền Bắc ──────────────────────────────────────────────────────────────
  { ma: "001", ten: "Thành phố Hà Nội",         tenViet: "Ha Noi",         vung: "Bắc", capTinh: "Thành phố trực thuộc TW", hieuLuc: true },
  { ma: "002", ten: "Tỉnh Hà Giang",             tenViet: "Ha Giang",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "004", ten: "Tỉnh Cao Bằng",             tenViet: "Cao Bang",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "006", ten: "Tỉnh Bắc Kạn",              tenViet: "Bac Kan",        vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "008", ten: "Tỉnh Tuyên Quang",          tenViet: "Tuyen Quang",    vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "010", ten: "Tỉnh Lào Cai",              tenViet: "Lao Cai",        vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "011", ten: "Tỉnh Điện Biên",            tenViet: "Dien Bien",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "012", ten: "Tỉnh Lai Châu",             tenViet: "Lai Chau",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "014", ten: "Tỉnh Sơn La",               tenViet: "Son La",         vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "015", ten: "Tỉnh Yên Bái",              tenViet: "Yen Bai",        vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "017", ten: "Tỉnh Hoà Bình",             tenViet: "Hoa Binh",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "019", ten: "Tỉnh Thái Nguyên",          tenViet: "Thai Nguyen",    vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "020", ten: "Tỉnh Lạng Sơn",             tenViet: "Lang Son",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "022", ten: "Tỉnh Quảng Ninh",           tenViet: "Quang Ninh",     vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "024", ten: "Tỉnh Bắc Giang",            tenViet: "Bac Giang",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "025", ten: "Tỉnh Phú Thọ",              tenViet: "Phu Tho",        vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "026", ten: "Tỉnh Vĩnh Phúc",            tenViet: "Vinh Phuc",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "027", ten: "Tỉnh Bắc Ninh",             tenViet: "Bac Ninh",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "030", ten: "Tỉnh Hải Dương",            tenViet: "Hai Duong",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "031", ten: "Thành phố Hải Phòng",       tenViet: "Hai Phong",      vung: "Bắc", capTinh: "Thành phố trực thuộc TW", hieuLuc: true },
  { ma: "033", ten: "Tỉnh Hưng Yên",             tenViet: "Hung Yen",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "034", ten: "Tỉnh Thái Bình",            tenViet: "Thai Binh",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "035", ten: "Tỉnh Hà Nam",               tenViet: "Ha Nam",         vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "036", ten: "Tỉnh Nam Định",             tenViet: "Nam Dinh",       vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "037", ten: "Tỉnh Ninh Bình",            tenViet: "Ninh Binh",      vung: "Bắc", capTinh: "Tỉnh", hieuLuc: true },
  // ── Miền Trung ────────────────────────────────────────────────────────────
  { ma: "038", ten: "Tỉnh Thanh Hóa",            tenViet: "Thanh Hoa",      vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "040", ten: "Tỉnh Nghệ An",              tenViet: "Nghe An",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "042", ten: "Tỉnh Hà Tĩnh",              tenViet: "Ha Tinh",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "044", ten: "Tỉnh Quảng Bình",           tenViet: "Quang Binh",     vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "045", ten: "Tỉnh Quảng Trị",            tenViet: "Quang Tri",      vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "046", ten: "Tỉnh Thừa Thiên Huế",       tenViet: "Thua Thien Hue", vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "048", ten: "Thành phố Đà Nẵng",         tenViet: "Da Nang",        vung: "Trung", capTinh: "Thành phố trực thuộc TW", hieuLuc: true },
  { ma: "049", ten: "Tỉnh Quảng Nam",            tenViet: "Quang Nam",      vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "051", ten: "Tỉnh Quảng Ngãi",           tenViet: "Quang Ngai",     vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "052", ten: "Tỉnh Bình Định",            tenViet: "Binh Dinh",      vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "054", ten: "Tỉnh Phú Yên",              tenViet: "Phu Yen",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "056", ten: "Tỉnh Khánh Hòa",            tenViet: "Khanh Hoa",      vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "058", ten: "Tỉnh Ninh Thuận",           tenViet: "Ninh Thuan",     vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "060", ten: "Tỉnh Bình Thuận",           tenViet: "Binh Thuan",     vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "062", ten: "Tỉnh Kon Tum",              tenViet: "Kon Tum",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "064", ten: "Tỉnh Gia Lai",              tenViet: "Gia Lai",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "066", ten: "Tỉnh Đắk Lắk",             tenViet: "Dak Lak",        vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "067", ten: "Tỉnh Đắk Nông",             tenViet: "Dak Nong",       vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "068", ten: "Tỉnh Lâm Đồng",             tenViet: "Lam Dong",       vung: "Trung", capTinh: "Tỉnh", hieuLuc: true },
  // ── Miền Nam ──────────────────────────────────────────────────────────────
  { ma: "070", ten: "Tỉnh Bình Phước",           tenViet: "Binh Phuoc",     vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "072", ten: "Tỉnh Tây Ninh",             tenViet: "Tay Ninh",       vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "074", ten: "Tỉnh Bình Dương",           tenViet: "Binh Duong",     vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "075", ten: "Tỉnh Đồng Nai",             tenViet: "Dong Nai",       vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "077", ten: "Tỉnh Bà Rịa - Vũng Tàu",   tenViet: "Ba Ria Vung Tau",vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "079", ten: "Thành phố Hồ Chí Minh",    tenViet: "Ho Chi Minh",    vung: "Nam", capTinh: "Thành phố trực thuộc TW", hieuLuc: true },
  { ma: "080", ten: "Tỉnh Long An",              tenViet: "Long An",        vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "082", ten: "Tỉnh Tiền Giang",           tenViet: "Tien Giang",     vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "083", ten: "Tỉnh Bến Tre",              tenViet: "Ben Tre",        vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "084", ten: "Tỉnh Trà Vinh",             tenViet: "Tra Vinh",       vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "086", ten: "Tỉnh Vĩnh Long",            tenViet: "Vinh Long",      vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "087", ten: "Tỉnh Đồng Tháp",            tenViet: "Dong Thap",      vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "089", ten: "Tỉnh An Giang",             tenViet: "An Giang",       vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "091", ten: "Tỉnh Kiên Giang",           tenViet: "Kien Giang",     vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "092", ten: "Thành phố Cần Thơ",         tenViet: "Can Tho",        vung: "Nam", capTinh: "Thành phố trực thuộc TW", hieuLuc: true },
  { ma: "093", ten: "Tỉnh Hậu Giang",            tenViet: "Hau Giang",      vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "094", ten: "Tỉnh Sóc Trăng",            tenViet: "Soc Trang",      vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "095", ten: "Tỉnh Bạc Liêu",             tenViet: "Bac Lieu",       vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
  { ma: "096", ten: "Tỉnh Cà Mau",               tenViet: "Ca Mau",         vung: "Nam", capTinh: "Tỉnh", hieuLuc: true },
];

/** Set mã tỉnh hợp lệ — chỉ lấy các đơn vị còn hiệu lực */
export const MA_TINH_HOP_LE: Set<string> = new Set(
  DANH_SACH_TINH.filter((t) => t.hieuLuc).map((t) => t.ma)
);

/** Tra cứu tỉnh theo mã */
export function timTinhTheoMa(ma: string): DonViHanhChinh | undefined {
  return DANH_SACH_TINH.find((t) => t.ma === ma);
}

/** Tra cứu tỉnh theo tên (không phân biệt hoa thường) */
export function timTinhTheoTen(ten: string): DonViHanhChinh | undefined {
  const tenNormalized = ten.toLowerCase().trim();
  return DANH_SACH_TINH.find(
    (t) =>
      t.ten.toLowerCase() === tenNormalized ||
      t.tenViet.toLowerCase() === tenNormalized
  );
}

/** Lấy danh sách tỉnh còn hiệu lực để dùng trong dropdown */
export function layDanhSachTinh(): DonViHanhChinh[] {
  return DANH_SACH_TINH.filter((t) => t.hieuLuc);
}
