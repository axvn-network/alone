/**
 * src/modules/capital-transactions/index.ts
 *
 * Barrel export — consumers import từ "@/modules/capital-transactions"
 * thay vì import trực tiếp từ các file con.
 */

export * from "./types";
export * from "./schema";
export * as service from "./service";
export * as actions from "./actions";
export { default as CapitalTransaction } from "./model";

// ── UI components ─────────────────────────────────────────────────────────────
export { CapTxTable } from "./components/CapTxTable";
export { CapCallModal, ReviewModal } from "./components/CapTxActions";
