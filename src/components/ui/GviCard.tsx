import { ReactNode } from 'react';

interface GviCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function GviCard({ children, className = '', variant = 'primary' }: GviCardProps) {
  const baseCls = "rounded-xl p-6 md:p-7 border transition-all duration-300";
  const variants = {
    primary: "bg-gvi-navy border-gvi-gold/10 hover:border-gvi-gold/30 hover:shadow-lg hover:shadow-gvi-gold/5",
    secondary: "bg-gvi-deep border-gvi-gold/10 hover:border-gvi-gold/30",
  };

  return (
    <div className={`${baseCls} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
