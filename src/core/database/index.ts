/**
 * src/core/database/index.ts
 *
 * MongoDB connection layer — single canonical connection point.
 *
 * Migration path:
 *   Phase 1 (done):  canonical implementation in ./db.ts
 *   Phase 2 (scale): add connection pool config, read replica, Redis cache
 */

export { connectDB } from "./db";
