"use client";

import { motion } from "framer-motion";
import { type Advisor } from "@/data/gov/governance";

interface AdvisorCardsProps {
  advisors: readonly Advisor[];
}

export function AdvisorCards({ advisors }: AdvisorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {advisors.map((adv, idx) => (
        <motion.div
          key={adv.position}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="p-6 bg-gvi-deep border border-white/10 rounded-lg"
        >
          <span className="text-[10px] font-bold text-gvi-gold uppercase tracking-wider block mb-2">
            {adv.role}
          </span>
          <h3 className="text-xl font-bold text-gvi-ivory mb-3">{adv.position}</h3>
          <p className="text-sm text-gvi-silver/80 leading-relaxed">{adv.objective}</p>
        </motion.div>
      ))}
    </div>
  );
}
