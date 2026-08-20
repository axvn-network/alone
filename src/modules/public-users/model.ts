/**
 * src/models/PublicUser.ts
 *
 * Model người dùng công khai — đăng ký qua landing page.
 *
 * Đây là tầng thứ ba trong hệ thống phân quyền:
 *   superadmin / admin → Shareholder → PublicUser
 *
 * Tính năng:
 *   - Đăng ký bằng email + mật khẩu
 *   - Xác thực email (emailVerified + verificationToken)
 *   - Đăng ký nhận bản tin (newsletterSubscribed)
 *   - Theo dõi lần đăng nhập cuối
 *
 * ⚠️  Quy tắc bảo mật:
 *   - password: select: false — không bao giờ trả về trong API response
 *   - verificationToken: select: false
 *   - Không lưu thông tin nhạy cảm tài chính vào model này
 */

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPublicUser extends Document {
  /** Họ tên người dùng */
  name: string;
  /** Email — unique, lowercase */
  email: string;
  /** Mật khẩu đã hash — không trả về trong API */
  password: string;
  /** Số điện thoại (tùy chọn) */
  phone: string;
  /** Email đã được xác thực chưa */
  emailVerified: boolean;
  /** Token xác thực email — không trả về trong API */
  verificationToken: string;
  /** Thời điểm token xác thực hết hạn */
  verificationTokenExpiry: Date | null;
  /** Token đặt lại mật khẩu — không trả về trong API */
  passwordResetToken: string;
  /** Thời điểm token đặt lại mật khẩu hết hạn */
  passwordResetExpiry: Date | null;
  /** Đã đăng ký nhận bản tin không */
  newsletterSubscribed: boolean;
  /** Tài khoản có đang hoạt động không */
  isActive: boolean;
  /** Lần đăng nhập cuối */
  lastLogin: Date | null;
  /** Thời điểm tạo */
  createdAt: Date;
  /** Thời điểm cập nhật */
  updatedAt: Date;
  /** So sánh mật khẩu */
  comparePassword(plain: string): Promise<boolean>;
}

const PublicUserSchema = new Schema<IPublicUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    /** Mật khẩu hash bcrypt — không bao giờ trả về trong response */
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    /** Token xác thực email — hex 32 byte, select: false */
    verificationToken: {
      type: String,
      select: false,
      default: "",
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },
    /** Token đặt lại mật khẩu — hex 32 byte, select: false */
    passwordResetToken: {
      type: String,
      select: false,
      default: "",
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // tự động thêm createdAt, updatedAt
  },
);

// ─── Middleware: hash mật khẩu trước khi lưu ─────────────────────────────────

PublicUserSchema.pre("save", async function (): Promise<void> {
  // Chỉ hash khi mật khẩu thay đổi
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

// ─── Instance method: so sánh mật khẩu ──────────────────────────────────────

PublicUserSchema.methods.comparePassword = async function (
  plain: string,
): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

// ─── Index cho truy vấn thường dùng ──────────────────────────────────────────

PublicUserSchema.index({ emailVerified: 1, isActive: 1 });
PublicUserSchema.index({ newsletterSubscribed: 1 });

const PublicUser =
  mongoose.models.PublicUser ||
  mongoose.model<IPublicUser>("PublicUser", PublicUserSchema);

export default PublicUser;
