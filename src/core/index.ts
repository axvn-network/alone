/**
 * src/core/index.ts
 *
 * Core system infrastructure — não bộ hệ thống.
 * Không chứa UI, không phụ thuộc vào React.
 *
 * Sub-modules:
 *   database/ — MongoDB connection, index management
 *   rbac/     — Role-based access control, permission checks
 *   security/ — CSRF, rate-limit, session signing
 *   vn-utils/ — Vietnamese business logic (currency, CCCD, hanh-chinh)
 *
 * Import quy tắc:
 *   - core/ có thể import từ nhau
 *   - core/ KHÔNG được import từ src/modules/, src/app/, src/components/
 *   - Mọi nơi khác có thể import từ core/
 */
