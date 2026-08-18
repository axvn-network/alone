/**
 * scripts/seed-rbac.ts
 *
 * Khởi tạo toàn bộ Permission và Role cho hệ thống RBAC.
 *
 * Sử dụng:
 *   npm run seed:rbac
 *
 * [WARNING] Script nay XOA toan bo Permission va Role hien co truoc khi seed.
 *     Chi chay tren DB moi hoac khi can reset hoan toan phan quyen.
 */

import 'dotenv/config';
import { connectDB } from '@/core/database';
import { Permission } from '@/core/models/Permission';
import { Role } from '@/core/models/Role';

// ─── Danh sách quyền hạn đầy đủ ──────────────────────────────────────────────

const PERMISSIONS = [
  // ── Quản trị hệ thống ─────────────────────────────────────────────────────
  { name: 'admin.access',         description: 'Truy cập trang quản trị' },
  { name: 'admin.manage',         description: 'Quản lý tài khoản admin (superadmin only)' },

  // ── Người dùng ────────────────────────────────────────────────────────────
  { name: 'users.view',           description: 'Xem danh sách người dùng công khai' },
  { name: 'users.manage',         description: 'Quản lý người dùng công khai' },

  // ── Bài viết / Blog ───────────────────────────────────────────────────────
  { name: 'blog.view',            description: 'Xem bài viết' },
  { name: 'blog.edit',            description: 'Tạo và chỉnh sửa bài viết' },
  { name: 'blog.publish',         description: 'Xuất bản / gỡ bài viết' },
  { name: 'blog.delete',          description: 'Xóa bài viết' },

  // ── Nội dung CMS ──────────────────────────────────────────────────────────
  { name: 'content.view',         description: 'Xem nội dung CMS' },
  { name: 'content.edit',         description: 'Chỉnh sửa nội dung CMS (visual editor)' },

  // ── Tài liệu công bố ──────────────────────────────────────────────────────
  { name: 'documents.view',       description: 'Xem tài liệu công bố' },
  { name: 'documents.manage',     description: 'Tải lên và quản lý tài liệu' },

  // ── Hạng mục hợp tác ──────────────────────────────────────────────────────
  { name: 'plans.view',           description: 'Xem hạng mục hợp tác đầu tư' },
  { name: 'plans.manage',         description: 'Quản lý hạng mục hợp tác đầu tư' },

  // ── Yêu cầu / Liên hệ ────────────────────────────────────────────────────
  { name: 'enquiries.view',       description: 'Xem yêu cầu liên hệ' },
  { name: 'enquiries.manage',     description: 'Xử lý và cập nhật trạng thái yêu cầu' },

  // ── Đơn đăng ký đối tác ───────────────────────────────────────────────────
  { name: 'partner.view',         description: 'Xem đơn đăng ký đối tác' },
  { name: 'partner.review',       description: 'Xét duyệt đơn đăng ký đối tác' },

  // ── Cổ đông ───────────────────────────────────────────────────────────────
  { name: 'shareholders.view',    description: 'Xem danh sách và hồ sơ cổ đông' },
  { name: 'shareholders.manage',  description: 'Tạo / cập nhật / xóa cổ đông' },
  { name: 'shareholders.kyc',     description: 'Duyệt / từ chối hồ sơ KYC cổ đông' },

  // ── Giao dịch vốn ─────────────────────────────────────────────────────────
  { name: 'capital.view',         description: 'Xem lịch sử giao dịch vốn' },
  { name: 'capital.manage',       description: 'Tạo capital call, xác nhận / từ chối deposit' },

  // ── Cài đặt hệ thống ──────────────────────────────────────────────────────
  { name: 'settings.view',        description: 'Xem cài đặt trang web' },
  { name: 'settings.manage',      description: 'Chỉnh sửa cài đặt trang web' },

  // ── Audit log ─────────────────────────────────────────────────────────────
  { name: 'audit.view',           description: 'Xem nhật ký hoạt động (audit log)' },

  // ── Media ─────────────────────────────────────────────────────────────────
  { name: 'media.upload',         description: 'Tải lên media lên Cloudinary' },
] as const;

// ─── Cấu hình vai trò ─────────────────────────────────────────────────────────

type PermissionName = typeof PERMISSIONS[number]['name'];

const ROLES: Record<string, { description: string; permissions: PermissionName[] }> = {
  superadmin: {
    description: 'Siêu quản trị viên — toàn quyền hệ thống',
    permissions: PERMISSIONS.map((p) => p.name),
  },
  admin: {
    description: 'Quản trị viên — toàn quyền trừ quản lý admin accounts',
    permissions: PERMISSIONS
      .filter((p) => p.name !== 'admin.manage')
      .map((p) => p.name),
  },
  editor: {
    description: 'Biên tập viên — quản lý nội dung và blog',
    permissions: [
      'admin.access',
      'blog.view', 'blog.edit', 'blog.publish', 'blog.delete',
      'content.view', 'content.edit',
      'documents.view', 'documents.manage',
      'media.upload',
    ],
  },
  viewer: {
    description: 'Người xem — chỉ xem, không chỉnh sửa',
    permissions: [
      'admin.access',
      'blog.view',
      'content.view',
      'documents.view',
      'enquiries.view',
      'partner.view',
      'shareholders.view',
      'capital.view',
      'audit.view',
      'settings.view',
    ],
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
  await connectDB();

  console.log('[!] Xoa Permission va Role cu...');
  await Permission.deleteMany({});
  await Role.deleteMany({});

  console.log('Seeding Permissions...');
  const created = await Permission.insertMany(
    PERMISSIONS.map((p) => ({ name: p.name, description: p.description }))
  );

  const permMap = new Map(created.map((p) => [p.name, p._id]));

  console.log(`Seeded ${created.length} permissions.`);
  console.log('Seeding Roles...');

  for (const [roleName, roleConfig] of Object.entries(ROLES)) {
    const permIds = roleConfig.permissions
      .map((name) => permMap.get(name))
      .filter(Boolean);

    await Role.create({
      name: roleName,
      description: roleConfig.description,
      permissions: permIds,
    });

    console.log(`  [+] ${roleName} (${permIds.length} permissions)`);
  }

  console.log('\nRBAC seeded successfully.');
  console.log('Tiếp theo: Gán role cho admin bằng lệnh:');
  console.log('  npm run provision:admin -- <email> <password> <roleName>');
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error('[ERROR] Seed failed:', err);
  process.exit(1);
});
