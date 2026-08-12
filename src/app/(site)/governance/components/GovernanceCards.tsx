"use client";

import { motion } from "framer-motion";
import { type GovernanceDocument } from "@/data/gov/governance";

interface GovernanceCardsProps {
  docs: readonly GovernanceDocument[];
}

export function GovernanceCards({ docs }: GovernanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {docs.map((doc) => (
        <motion.div
          key={doc.id}
          whileHover={{ scale: 1.01 }}
          className="p-5 bg-gvi-deep border border-white/10 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-gvi-gold">{doc.id}</span>
            <span className="text-[10px] uppercase font-bold text-gvi-silver/60">
              {doc.status}
            </span>
          </div>
          <h3 className="font-semibold text-gvi-ivory mb-1">{doc.title}</h3>
          <p className="text-xs text-gvi-silver/70">{doc.category}</p>
        </motion.div>
      ))}
    </div>
  );
}
