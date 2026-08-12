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

// ── Admin panel ───────────────────────────────────────────────────────────────
export {
  ROLE_LABELS,
  ALL_ROLES,
  SHAREHOLDER_STATUS_CLS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_CLS,
  PRIORITY_CLS,
  PRIORITY_TEXT_CLS,
  TASK_STATUS_LABELS,
  TASK_CATEGORIES,
  CAT_LABELS,
  MEETING_TYPES,
  MEETING_TYPE_LABELS,
  KYC_STATUS_CONFIG,
  TIER_LABELS,
  PLAN_STATUS_CLS,
  ADMIN_PAGE_CLS,
} from "./admin";

// ── Blog ──────────────────────────────────────────────────────────────────────
export { ARTICLE_CATEGORIES, CAT_COLORS } from "./blog";
export type { ArticleCategory } from "./blog";
export type {
  StrategyValueId,
  StrategyValue,
  Subsidiary,
  StrategicRoadmapPhase,
} from "./strategy";
