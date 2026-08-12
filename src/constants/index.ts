/**
 * src/constants/index.ts
 * Barrel — re-exports all project-wide constants.
 *
 * Usage:
 *   import { PUBLIC_BRAND, STRATEGY_NOTICE } from "@/constants";
 *   import { CAPITAL_AMOUNT, PROJECT_TIMELINE, CURRENT_PHASE } from "@/constants";
 *   import { CORE_VALUES, SUBSIDIARIES, STRATEGY_AT_A_GLANCE } from "@/constants";
 */

// ── Brand ──────────────────────────────────────────────────────────────────────
export { PUBLIC_BRAND, STRATEGY_NOTICE } from "./brand";

// ── Project timeline ──────────────────────────────────────────────────────────
export {
  CAPITAL_AMOUNT,
  PROJECT_TIMELINE,
  CURRENT_PHASE,
  CURRENT_PHASE_LABEL,
} from "./project";
export type { PhaseStatus, TimelinePhase } from "./project";

// ── Strategy ──────────────────────────────────────────────────────────────────
export {
  CORE_VALUES,
  SUBSIDIARIES,
  STRATEGIC_ROADMAP,
  STRATEGY_AT_A_GLANCE,
  STRATEGY_KEYS,
} from "./strategy";
export type {
  StrategyValueId,
  StrategyValue,
  Subsidiary,
  StrategicRoadmapPhase,
} from "./strategy";
