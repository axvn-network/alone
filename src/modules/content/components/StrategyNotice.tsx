import { AlertTriangle } from "lucide-react";
import { STRATEGY_NOTICE } from "@/constants/brand";

interface StrategyNoticeProps {
  dark?: boolean;
  className?: string;
}

export default function StrategyNotice({ dark = false, className = "" }: StrategyNoticeProps) {
  return (
    <aside
      className={`flex items-start gap-3 rounded-sm border p-4 text-xs leading-relaxed ${dark
          ? "border-AXVN-gold/25 bg-AXVN-gold/8 text-AXVN-silver/80"
          : "border-AXVN-gold/25 bg-AXVN-gold/5 text-AXVN-charcoal/70"
        } ${className}`}
      aria-label="Lưu ý về thông tin chiến lược"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-AXVN-gold" aria-hidden="true" />
      <p>{STRATEGY_NOTICE}</p>
    </aside>
  );
}
