/**
 * src/data/ip/ip-tech.ts
 */

export interface IPAsset {
  id: string;
  name: string;
  assetType: "Copyright" | "Patent" | "Trademark" | "SmartContract";
  evaluationValue: number;
  valuationDate: string;
  protectionStatus: string;
}

export const IP_ASSETS: readonly IPAsset[] = [
  {
    id: "IP-001",
    name: "Hệ thống App-chain cốt lõi",
    assetType: "Copyright",
    evaluationValue: 5000000000,
    valuationDate: "2026-07-20",
    protectionStatus: "Registered",
  },
  {
    id: "SC-001",
    name: "Smart Contract VASP Pilot",
    assetType: "SmartContract",
    evaluationValue: 1000000000,
    valuationDate: "2026-08-01",
    protectionStatus: "Audited",
  },
];
