/**
 * src/cli/seed-rbac.ts
 *
 * RBAC trong kiến trúc mới là code-defined — không lưu trữ Role/Permission vào DB.
 * Mỗi admin có trường `role: "admin" | "superadmin"` trực tiếp trên model.
 * Quyền hạn được tra cứu tại runtime qua ROLE_PERMISSIONS (src/core/rbac/rbac-lib/permissions.ts).
 *
 * Script này thực hiện:
 *   1. In bảng phân quyền hiện tại để tham khảo
 *   2. Tạo tài khoản superadmin mặc định nếu chưa có admin nào (bootstrap)
 *   3. Hiển thị danh sách admin hiện có trong DB
 *
 * Usage:
 *   npm run seed:rbac                           # bootstrap + report
 *   npm run seed:rbac -- --no-bootstrap         # chỉ in báo cáo
 *   npm run seed:rbac -- --email x@x.com --password MyP@ss  # tùy chỉnh bootstrap
 *
 * Yêu cầu: MONGODB_URI trong .env.local
 */

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import * as bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../modules/auth/model";
import { ROLE_PERMISSIONS } from "../core/rbac/rbac-lib/permissions";
import type { AppRole } from "../core/rbac/rbac-lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
  };
  return {
    noBootstrap: args.includes("--no-bootstrap"),
    email: get("--email") ?? "admin@axvn.vn",
    password: get("--password") ?? "AxvnAdmin@2025!",
    role: (get("--role") ?? "superadmin") as AppRole,
  };
}

function printPermissionMatrix() {
  const roles: AppRole[] = ["superadmin", "admin", "shareholder", "public"];

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║         BẢNG PHÂN QUYỀN AXVN TECH HOLDING           ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  RBAC là code-defined — không lưu vào DB             ║");
  console.log("║  Nguồn: src/core/rbac/rbac-lib/permissions.ts        ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  for (const role of roles) {
    const perms = ROLE_PERMISSIONS[role];
    if (!perms) continue;
    console.log(`  ▸ ${role.padEnd(14)} (${perms.length} quyền)`);
    for (const p of perms) {
      console.log(`      • ${p}`);
    }
    console.log();
  }
}

async function bootstrap(email: string, password: string, role: AppRole) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "\n[ERROR] MONGODB_URI không được cấu hình trong .env.local\n",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { bufferCommands: false });
  console.log("[DB] Đã kết nối MongoDB\n");

  const count = await Admin.countDocuments();

  if (count > 0) {
    console.log(`[INFO] Đã có ${count} admin trong DB. Bỏ qua bootstrap.\n`);
    console.log("Danh sách admin hiện tại:");
    const admins = await Admin.find(
      {},
      { email: 1, role: 1, createdAt: 1 },
    ).lean();
    for (const a of admins) {
      console.log(
        `  • ${String(a.email).padEnd(30)} role=${a.role}  created=${new Date(a.createdAt).toISOString().slice(0, 10)}`,
      );
    }
    console.log();
    await mongoose.disconnect();
    return;
  }

  if (password.length < 10) {
    console.error(
      "\n[ERROR] Mật khẩu bootstrap quá ngắn (tối thiểu 10 ký tự).",
    );
    console.error("   Truyền --password 'MyStr0ng!Pass' để tùy chỉnh.\n");
    await mongoose.disconnect();
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = await Admin.create({
    name: email.split("@")[0],
    email: email.toLowerCase().trim(),
    password: hashed,
    role: role === "superadmin" ? "superadmin" : "admin",
  });

  console.log(`[OK] Admin mặc định đã được tạo:`);
  console.log(`     email : ${admin.email}`);
  console.log(`     role  : ${admin.role}`);
  console.warn(
    `\n[WARNING] Đây là tài khoản bootstrap — đổi mật khẩu ngay sau khi đăng nhập!\n`,
  );

  await mongoose.disconnect();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const opts = parseArgs();

  // 1. Luôn in bảng phân quyền
  printPermissionMatrix();

  // 2. Bootstrap nếu không bị tắt
  if (!opts.noBootstrap) {
    await bootstrap(opts.email, opts.password, opts.role);
  } else {
    console.log("[INFO] --no-bootstrap: bỏ qua tạo admin mặc định.\n");
  }

  console.log("✓ seed:rbac hoàn thành.\n");
  console.log("Các lệnh hữu ích tiếp theo:");
  console.log(
    "  npm run provision:admin -- <email> <password> [role]   # thêm admin mới",
  );
  console.log(
    "  npm run reset:admin -- <email> <new_password>          # đặt lại mật khẩu\n",
  );
}

run().catch((err) => {
  console.error("[ERROR] seed-rbac thất bại:", err);
  process.exit(1);
});
