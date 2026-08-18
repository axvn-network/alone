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
import Admin from "../core/models/Admin";
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
      "\n[ERROR] Usage: npx tsx scripts/reset-admin.ts <email> [new_password]\n" +
      "   Example: npx tsx scripts/reset-admin.ts admin@vnkr.vn NewPass@9876\n"
    );
    process.exit(1);
  }

  if (!newPassword) {
    console.error(
      "\n[ERROR] new_password la bat buoc.\n" +
      "   Hay truyen mat khau manh (>=12 ky tu, co so + ky tu dac biet):\n" +
      "   npx tsx scripts/reset-admin.ts admin@vnkr.vn 'MyStr0ng!Pass'\n"
    );
    process.exit(1);
  }

  // Basic password strength check
  if (newPassword.length < 10) {
    console.error("\n[ERROR] Mat khau qua ngan -- toi thieu 10 ky tu.\n");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("\n[ERROR] MONGODB_URI khong tim thay trong .env.local\n");
    process.exit(1);
  }

  console.log("\n[WARNING] SECURITY WARNING");
  console.log("   Doi mat khau ngay sau khi dang nhap!");
  console.log("   Khong log, khong chia se mat khau nay.\n");

  await connect(process.env.MONGODB_URI);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const result = await Admin.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (result.matchedCount === 0) {
    console.error(`[ERROR] Admin khong tim thay: ${email}`);
    await disconnect();
    process.exit(1);
  }

  console.log(`[OK] Dat lai mat khau thanh cong cho: ${email}`);
  console.log("  -> Hay dang nhap va doi mat khau ngay!\n");

  await disconnect();
  process.exit(0);
}

resetAdminPassword().catch((err) => {
  console.error("[ERROR] Reset failed:", err);
  process.exit(1);
});
