"use client";

import { motion } from "framer-motion";
import { skeletonVariants } from "@/lib/animation";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      variants={skeletonVariants}
      animate="animate"
      className={`bg-AXVN-charcoal/50 rounded-md ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 border border-AXVN-gold/10 rounded-2xl bg-AXVN-deep space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
}
