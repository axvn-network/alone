"use client";

import { motion } from "framer-motion";

export interface Risk {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  probability: number;
  impact: number;
}

interface RiskMatrixProps {
  risks: readonly Risk[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {risks.map((risk) => (
        <motion.div
          key={risk.id}
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs font-bold">{risk.id}</span>
            <span className="text-[10px] font-bold uppercase">
              {risk.severity}
            </span>
          </div>
          <h3 className="font-semibold text-AXVN-ivory">{risk.title}</h3>
          <div className="mt-2 text-xs flex gap-4 text-AXVN-silver/70">
            <span>XS: {risk.probability}/5</span>
            <span>TĐ: {risk.impact}/5</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default RiskMatrix;
