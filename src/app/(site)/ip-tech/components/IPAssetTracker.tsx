"use client";

import { motion } from "framer-motion";
import { type IPAsset } from "@/data/ip/ip-tech";

interface IPAssetTrackerProps {
  assets: readonly IPAsset[];
}

export function IPAssetTracker({ assets }: IPAssetTrackerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assets.map((asset) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-gvi-deep border border-white/10 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-gvi-gold">{asset.id}</span>
            <span className="text-[10px] uppercase font-bold text-gvi-silver/60">
              {asset.assetType}
            </span>
          </div>
          <h3 className="font-semibold text-gvi-ivory mb-1">{asset.name}</h3>
          <p className="text-xs text-gvi-silver/70">
            Giá trị: {asset.evaluationValue.toLocaleString()} VNĐ
          </p>
          <div className="mt-2 text-[10px] font-bold text-gvi-gold uppercase">
            {asset.protectionStatus}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
