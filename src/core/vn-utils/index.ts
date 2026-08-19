/**
 * src/core/vn-utils/index.ts
 *
 * Vietnamese business logic utilities — single import point.
 *
 * Covers:
 *   - Currency formatting (VNĐ compact, full, international)
 *   - Date/time formatting (Vietnamese timezone, day-of-week)
 *   - Phone number formatting and E.164 normalisation
 *   - National ID (CCCD) validation (Thông tư 59/2021/TT-BCA)
 *   - Tax ID (MST) validation — business, branch, individual
 *   - SWIFT/BIC validation and bank lookup
 *   - Administrative divisions (63 tỉnh/thành)
 *   - Input normalisation middleware for API route bodies
 *   - Zod schemas with Vietnamese validation rules
 */

export * from "@/core/vn-utils/vn-lib/format";
export * from "@/core/vn-utils/vn-lib/validators";
export * from "@/core/vn-utils/vn-lib/zod-vn";
export * from "@/core/vn-utils/vn-lib/hanh-chinh";
export * from "@/core/vn-utils/vn-lib/swift-ngan-hang";
export * from "@/core/vn-utils/vn-lib/middleware-chuan-hoa";
