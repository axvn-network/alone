"use client";

import { motion } from "framer-motion";
import { type ComplianceTask } from "@/data/comp/compliance";

interface ComplianceTrackerProps {
  tasks: readonly ComplianceTask[];
}

export function ComplianceTracker({ tasks }: ComplianceTrackerProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-AXVN-deep border border-white/10 rounded-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-AXVN-ivory">{task.taskName}</h3>
            <span className="text-[10px] font-bold text-AXVN-gold">{task.status}</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              className="bg-AXVN-gold h-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
