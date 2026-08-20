/**
 * src/cli/provision-admin.ts
 *
 * Tạo tài khoản admin mới trong DB.
 *
 * Usage:
 *   npm run provision:admin -- <email> <password> [role]
 *   npm run provision:admin -- admin@axvn.vn MyStr0ng!Pass superadmin
 *
 * role mặc định: "admin"  |  giá trị hợp lệ: "admin" | "superadmin"
 *
 * Yêu cầu: MONGODB_URI trong .env.local
 */

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import * as bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../modules/auth/model";

const VALID_ROLES = ["admin", "superadmin"] as const;
type AdminRole = (typeof VALID_ROLES)[number];

async function provision() {
  const [, , email, password, roleName = "admin"] = process.argv;

  // ── Validate args ──────────────────────────────────────────────────────────
  if (!email || !password) {
    console.error(
      "\n[ERROR] Usage: npm run provision:admin -- <email> <password> [role]\n" +
        "   role: admin (default) | superadmin\n" +
        "   Example: npm run provision:admin -- admin@axvn.vn 'MyStr0ng!Pass' superadmin\n",
    );
    process.exit(1);
  }

  if (!VALID_ROLES.includes(roleName as AdminRole)) {
    console.error(
      `\n[ERROR] role phải là một trong: ${VALID_ROLES.join(", ")}\n`,
    );
    process.exit(1);
  }

  if (password.length < 10) {
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

  // ── Connect ────────────────────────────────────────────────────────────────
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("[DB] Đã kết nối MongoDB\n");

  // ── Check duplicate ────────────────────────────────────────────────────────
  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.error(`[ERROR] Admin với email "${email}" đã tồn tại.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Create ─────────────────────────────────────────────────────────────────
  const hashed = await bcrypt.hash(password, 12);
  const admin = await Admin.create({
    name: email.split("@")[0],
    email: email.toLowerCase().trim(),
    password: hashed,
    role: roleName as AdminRole,
  });

  console.log(
    `[OK] Admin "${admin.email}" đã được tạo với role "${admin.role}".`,
  );
  console.log("     Đổi mật khẩu ngay sau khi đăng nhập lần đầu!\n");

  await mongoose.disconnect();
  process.exit(0);
}

provision().catch((err) => {
  console.error("[ERROR] provision-admin thất bại:", err);
  process.exit(1);
});
