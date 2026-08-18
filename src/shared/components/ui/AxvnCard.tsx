import { ReactNode } from "react";

interface AXVNCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function AXVNCard({ children, className = "", variant = "primary" }: AXVNCardProps) {
  const baseCls = "rounded-xl p-6 md:p-7 border transition-all duration-300";
  const variants = {
    primary: "bg-AXVN-navy border-AXVN-gold/10 hover:border-AXVN-gold/30 hover:shadow-lg hover:shadow-AXVN-gold/5",
    secondary: "bg-AXVN-deep border-AXVN-gold/10 hover:border-AXVN-gold/30",
  };

  return (
    <div className={`${baseCls} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
