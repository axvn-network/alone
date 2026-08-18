/**
 * scripts/reset-admin.ts — Emergency admin password reset
 *
 * Usage:
 *   npx tsx scripts/reset-admin.ts <email>
 *   npx tsx scripts/reset-admin.ts <email> <new_password>
 *
 * Yêu cầu: MONGODB_URI trong .env.local
 * Cảnh báo: Script này chỉ dùng khi khẩn cấp — đổi mật khẩu ngay sau khi login.
 */
import { connect, disconnect } from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../src/models/Admin";
import dotenv from "dotenv";
import path from "path";

// Load env từ .env.local (cùng với runtime)
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function resetAdminPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  // ── Validate args ──────────────────────────────────────────────────────────
  if (!email) {
    console.error(
      "\n❌ Usage: npx tsx scripts/reset-admin.ts <email> [new_password]\n" +
      "   Example: npx tsx scripts/reset-admin.ts admin@vnkr.vn NewPass@9876\n"
    );
    process.exit(1);
  }

  if (!newPassword) {
    console.error(
      "\n❌ new_password là bắt buộc.\n" +
      "   Hãy truyền mật khẩu mạnh (≥12 ký tự, có số + ký tự đặc biệt):\n" +
      "   npx tsx scripts/reset-admin.ts admin@vnkr.vn 'MyStr0ng!Pass'\n"
    );
    process.exit(1);
  }

  // Basic password strength check
  if (newPassword.length < 10) {
    console.error("\n❌ Mật khẩu quá ngắn — tối thiểu 10 ký tự.\n");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("\n❌ MONGODB_URI không tìm thấy trong .env.local\n");
    process.exit(1);
  }

  console.log("\n⚠  SECURITY WARNING");
  console.log("   Đổi mật khẩu ngay sau khi đăng nhập!");
  console.log("   Không log, không chia sẻ mật khẩu này.\n");

  await connect(process.env.MONGODB_URI);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const result = await Admin.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (result.matchedCount === 0) {
    console.error(`❌ Admin không tìm thấy: ${email}`);
    await disconnect();
    process.exit(1);
  }

  console.log(`✓ Đặt lại mật khẩu thành công cho: ${email}`);
  console.log("  → Hãy đăng nhập và đổi mật khẩu ngay!\n");

  await disconnect();
  process.exit(0);
}

resetAdminPassword().catch((err) => {
  console.error("❌ Reset failed:", err);
  process.exit(1);
});
