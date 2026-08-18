/**
 * src/modules/dashboard/index.ts
 * Barrel export — import from "@/modules/dashboard"
 *
 * NOTE: This barrel intentionally exports UI components only.
 * Server-only aggregation service must be imported directly:
 *   import { getDashboardStats } from "@/modules/dashboard/service"
 * This prevents Mongoose from leaking into Client Component bundles.
 */

// ── UI components (safe for client components) ────────────────────────────────
export { ArchitectureDiagram } from "./components/ArchitectureDiagram";
export { default as DocumentExplorer } from "./components/DocumentExplorer";
export type { ExplorerDocument } from "./components/DocumentExplorer";
export { KpiDashboard } from "./components/KpiDashboard";
export type { KpiItem } from "./components/KpiDashboard";
export { RiskMatrix } from "./components/RiskMatrix";
export type { Risk } from "./components/RiskMatrix";
export {
  default as SystemDiagram,
  DEFAULT_DIAGRAM_ROOT,
} from "./components/SystemDiagram";
export type { SystemDiagramNode } from "./components/SystemDiagram";
export { default as VisualTimeline } from "./components/VisualTimeline";
export type { VisualTimelineItem } from "./components/VisualTimeline";
