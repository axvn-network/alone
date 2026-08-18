/**
 * src/cli/reset-admin.ts — Emergency admin password reset
 *
 * Usage:
 *   npm run reset:admin -- <email> <new_password>
 *
 * Example:
 *   npm run reset:admin -- admin@axvn.vn 'NewStr0ng!Pass'
 *
 * Yêu cầu: MONGODB_URI trong .env.local
 * Cảnh báo: Chỉ dùng khi khẩn cấp — đổi mật khẩu ngay sau khi login.
 */

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import * as bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../modules/auth/model";

async function resetAdminPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  // ── Validate args ──────────────────────────────────────────────────────────
  if (!email || !newPassword) {
    console.error(
      "\n[ERROR] Usage: npm run reset:admin -- <email> <new_password>\n" +
        "   Example: npm run reset:admin -- admin@axvn.vn 'NewStr0ng!Pass'\n",
    );
    process.exit(1);
  }

  if (newPassword.length < 10) {
    console.error("\n[ERROR] Mật khẩu quá ngắn — tối thiểu 10 ký tự.\n");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "\n[ERROR] MONGODB_URI không được cấu hình trong .env.local\n",
    );
    process.exit(1);
  }

  // ── Security reminder ──────────────────────────────────────────────────────
  console.warn("\n[WARNING] ĐÂY LÀ THAO TÁC KHẨN CẤP");
  console.warn("   Đổi mật khẩu ngay sau khi đăng nhập!");
  console.warn("   Không chia sẻ mật khẩu này qua chat hay email.\n");

  // ── Connect & update ───────────────────────────────────────────────────────
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("[DB] Đã kết nối MongoDB\n");

  const hashed = await bcrypt.hash(newPassword, 12);
  const result = await Admin.updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { password: hashed } },
  );

  if (result.matchedCount === 0) {
    console.error(`[ERROR] Không tìm thấy admin: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`[OK] Đặt lại mật khẩu thành công cho: ${email}`);
  console.log("     → Đăng nhập và đổi mật khẩu ngay!\n");

  await mongoose.disconnect();
  process.exit(0);
}

resetAdminPassword().catch((err) => {
  console.error("[ERROR] reset-admin thất bại:", err);
  process.exit(1);
});
