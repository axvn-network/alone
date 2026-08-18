import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type ShareholderRole = "tech" | "financial" | "tech-company" | "individual" | "legal" | "foreign";
export type ShareholderStatus = "pending" | "active" | "suspended";

/**
 * Model cổ đông — tuân thủ chuẩn dữ liệu Việt Nam:
 *   - phone: lưu E.164 (+84xxxxxxxxx) via libphonenumber-js
 *   - nationalId: CCCD 12 số, mã hóa AES-256-GCM, select: false
 *   - capitalCommitted/capitalPaid: số nguyên đơn vị VNĐ (không có phân số)
 *   - Địa chỉ: lưu cả raw string và structured (permanentAddressStruct)
 *
 * ⚠️  CẦN CẬP NHẬT KHI: thay đổi quy định AML/KYC (NQ05/2025, Luật 14/2022)
 */
export interface IShareholder extends Document {
  name: string;
  email: string;
  password: string;
  /** Số điện thoại lưu chuẩn E.164: +84xxxxxxxxx
   *  ⚠️  Cập nhật validation khi có đầu số mới (libphonenumber-js) */
  phone: string;
  /** Số điện thoại gốc (người dùng nhập) — lưu để kiểm tra/debug */
  phoneRaw: string;
  role: ShareholderRole;
  status: ShareholderStatus;
  equityPercent: number;       // % cổ phần cam kết
  capitalCommitted: number;    // VNĐ vốn cam kết — SỐ NGUYÊN (không phân số)
  capitalPaid: number;         // VNĐ đã góp thực tế — SỐ NGUYÊN
  notes: string;               // ghi chú nội bộ (admin only)
  avatarUrl: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // ── KYC fields (NQ05/2025, Luật AML 14/2022, Thông tư 59/2021/TT-BCA) ──
  kycStatus: "not_started" | "pending" | "approved" | "rejected";
  kycSubmittedAt: Date | null;
  kycApprovedAt: Date | null;
  /** CCCD 12 số — mã hóa AES-256-GCM tại service layer, select: false
   *  ⚠️  KHÔNG BAO GIỜ trả về trong API response */
  nationalId: string;
  /** Giá trị CCCD gốc người dùng nhập — select: false */
  nationalIdRaw: string;
  nationalIdIssuedDate: Date | null;
  nationalIdIssuedPlace: string;
  /** Địa chỉ thường trú dạng text thuần */
  permanentAddress: string;
  /** Địa chỉ cấu trúc (structured) theo chuẩn VN:
   *  { soNha, tenDuong, phuongXa, quanHuyen, tinhThanhPho }
   *  ⚠️  Cập nhật khi sáp nhập tỉnh thành */
  permanentAddressStruct: {
    soNha?: string;
    ngoHem?: string;
    tenDuong?: string;
    phuongXa?: string;
    quanHuyen?: string;
    tinhThanhPho: string;
    maQuocGia: string;
  } | null;
  /** Nguồn gốc vốn góp theo chuẩn AML */
  sourceOfFunds: string;
  /** Mã số thuế cá nhân (= CCCD khi đã đăng ký), select: false */
  maSoThue: string;
  /** Mã SWIFT ngân hàng của cổ đông (nếu có) */
  swiftCode: string;
  isPEP: boolean;
  isSanctioned: boolean;
  comparePassword(plain: string): Promise<boolean>;
}

/**
 * Mongoose Schema cổ đông — chuẩn dữ liệu Việt Nam.
 *
 * Quy tắc lưu trữ:
 *   - phone: E.164 (+84xxxxxxxxx), phoneRaw: giá trị gốc
 *   - nationalId: AES-256-GCM encrypted, select: false
 *   - nationalIdRaw: giá trị gốc người dùng nhập, select: false
 *   - capitalCommitted / capitalPaid: số nguyên đơn vị VNĐ
 *   - permanentAddress: text thuần, permanentAddressStruct: structured
 *   - maSoThue: MST cá nhân (= CCCD), select: false
 *
 * ⚠️  Thêm index cho kycStatus khi volume > 10k records
 */
const AddressStructSchema = new Schema(
  {
    soNha:        { type: String, default: "" },
    ngoHem:       { type: String, default: "" },
    tenDuong:     { type: String, default: "" },
    phuongXa:     { type: String, default: "" },
    quanHuyen:    { type: String, default: "" },
    tinhThanhPho: { type: String, default: "" },
    maQuocGia:    { type: String, default: "VN" }, // ISO 3166-1 alpha-2
  },
  { _id: false }
);

const ShareholderSchema = new Schema<IShareholder>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, select: false },
    /** E.164 format: +84xxxxxxxxx — chuẩn hóa qua libphonenumber-js */
    phone:            { type: String, default: "" },
    /** Số điện thoại gốc người dùng nhập (raw) */
    phoneRaw:         { type: String, default: "" },
    role:             { type: String, enum: ["tech", "financial", "tech-company", "individual", "legal", "foreign"], required: true },
    status:           { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    equityPercent:    { type: Number, default: 0 },
    /** Vốn cam kết — số nguyên đơn vị VNĐ (không có phân số) */
    capitalCommitted: { type: Number, default: 0, validate: { validator: Number.isInteger, message: "capitalCommitted phải là số nguyên VNĐ" } },
    /** Vốn đã góp — số nguyên đơn vị VNĐ */
    capitalPaid:      { type: Number, default: 0, validate: { validator: Number.isInteger, message: "capitalPaid phải là số nguyên VNĐ" } },
    notes:            { type: String, default: "" },
    avatarUrl:        { type: String, default: "" },
    lastLogin:        { type: Date, default: null },
    // ── KYC fields (NQ05/2025, Luật AML 14/2022, Thông tư 59/2021/TT-BCA) ──
    kycStatus:        { type: String, enum: ["not_started", "pending", "approved", "rejected"], default: "not_started" },
    kycSubmittedAt:   { type: Date, default: null },
    kycApprovedAt:    { type: Date, default: null },
    /** CCCD 12 số — AES-256-GCM encrypted. KHÔNG bao giờ trả về API response */
    nationalId:       { type: String, select: false, default: "" },
    /** CCCD gốc người dùng nhập — select: false */
    nationalIdRaw:    { type: String, select: false, default: "" },
    nationalIdIssuedDate:  { type: Date, default: null },
    nationalIdIssuedPlace: { type: String, default: "" },
    /** Địa chỉ thường trú dạng text thuần */
    permanentAddress: { type: String, default: "" },
    /** Địa chỉ cấu trúc theo chuẩn VN — hỗ trợ tìm kiếm theo tỉnh/huyện/xã */
    permanentAddressStruct: { type: AddressStructSchema, default: null },
    sourceOfFunds:    { type: String, default: "" },
    /** MST cá nhân (= CCCD khi đã đăng ký thuế) — select: false */
    maSoThue:         { type: String, select: false, default: "" },
    /** Mã SWIFT ngân hàng của cổ đông */
    swiftCode:        { type: String, default: "" },
    isPEP:            { type: Boolean, default: false },
    isSanctioned:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

ShareholderSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

ShareholderSchema.pre("save", async function(): Promise<void> {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

ShareholderSchema.index({ status: 1, role: 1 });

const Shareholder =
  mongoose.models.Shareholder ||
  mongoose.model<IShareholder>("Shareholder", ShareholderSchema);

export default Shareholder;
