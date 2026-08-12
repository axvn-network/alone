"use client";

import { motion } from "framer-motion";
import { type Shareholder } from "@/data/gov/governance";

interface ShareholderTableProps {
  shareholders: readonly Shareholder[];
}

export function ShareholderTable({ shareholders }: ShareholderTableProps) {
  return (
    <div className="overflow-x-auto bg-gvi-deep border border-white/10 rounded-lg">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gvi-silver uppercase tracking-wider">Cổ đông</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gvi-silver uppercase tracking-wider">Vai trò</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gvi-silver uppercase tracking-wider">Số cổ phần</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gvi-silver uppercase tracking-wider">Tỷ lệ</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gvi-silver uppercase tracking-wider">Vốn cam kết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {shareholders.map((sh, idx) => (
            <motion.tr
              key={sh.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="hover:bg-white/5"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gvi-ivory">{sh.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gvi-silver/70">{sh.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gvi-silver/70">{sh.shares.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gvi-gold font-bold">{sh.percentage}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gvi-silver/70">{sh.capitalCommitted.toLocaleString()} VNĐ</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
