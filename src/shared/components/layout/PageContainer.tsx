import { ReactNode } from 'react';

// Variants defined based on the audit of existing backgrounds
type PageVariant = 'light' | 'dark' | 'admin';

interface PageContainerProps {
  children: ReactNode;
  variant?: PageVariant;
  className?: string;
}

const variants: Record<PageVariant, string> = {
  light: 'min-h-screen bg-white',
  dark: 'min-h-screen bg-AXVN-navy',
  admin: 'min-h-screen bg-[#03080e]',
};

export function PageContainer({ children, variant = 'light', className = '' }: PageContainerProps) {
  return (
    <main className={`${variants[variant]} ${className}`}>
      {children}
    </main>
  );
}
