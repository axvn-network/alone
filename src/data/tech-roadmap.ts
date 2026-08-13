/**
 * Internal-only technical planning data.
 * This file is intentionally not imported by public pages.
 */
export interface TechRoadmapPhase {
  year: number;
  title: string;
  focus: string[];
}

export const TECH_ROADMAP_PHASES: readonly TechRoadmapPhase[] = [
  {
    year: 2026,
    title: "Consolidate",
    focus: ["VNKR Trade v2.0.0", "AXVN Plugin System", "MySQL to PostgreSQL", "Microservices extraction"],
  },
  {
    year: 2027,
    title: "Expand",
    focus: ["AXVN Pay service", "Web3 Wallet backend", "App-chain 78968 Testnet", "Apache Kafka"],
  },
  {
    year: 2028,
    title: "Scale",
    focus: ["App-chain 78968 Mainnet", "Cross-chain bridge", "Edge Computing", "AI Risk Engine v1.0"],
  },
];
