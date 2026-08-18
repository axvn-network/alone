/**
 * src/core/vn-utils/index.ts
 *
 * Vietnamese business logic utilities.
 * Single import point for all VN-specific helpers.
 *
 * Covers:
 *   - Currency formatting (VNĐ compact, full, banking)
 *   - Phone number normalization (E.164, +84)
 *   - National ID (CCCD) validation (Thông tư 59/2021/TT-BCA)
 *   - Administrative divisions (hanh-chinh)
 *   - Zod schemas with Vietnamese error messages
 */

export * from "@/core/vn-utils/vn-lib/format";
export * from "@/core/vn-utils/vn-lib/zod-vn";
