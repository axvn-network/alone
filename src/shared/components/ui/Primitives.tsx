import React from "react";

// ─── Button Primitives ───────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseClass = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ─── Heading Primitives ─────────────────────────────────────────────────────

interface HeadingProps {
  level: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}

const HeadingMap = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

export const Heading: React.FC<HeadingProps> = ({
  level,
  className = "",
  children,
}) => {
  const Tag = HeadingMap[level];
  const styleClass =
    level === 1
      ? "heading-display"
      : level === 2
        ? "heading-section"
        : "text-h3";
  return <Tag className={`${styleClass} ${className}`}>{children}</Tag>;
};

// ─── Section Container ───────────────────────────────────────────────────────

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  dark?: boolean;
  altDark?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  innerClassName = "",
  id,
  dark,
  altDark,
}) => {
  const bgClass = dark ? "bg-dark" : altDark ? "bg-alt-dark" : "";
  return (
    <section
      id={id}
      className={`section-py section-px ${bgClass} ${className}`.trim()}
    >
      <div className={innerClassName || undefined}>{children}</div>
    </section>
  );
};

// ─── Tag Label ──────────────────────────────────────────────────────────────

export const SectionTag: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <span className="section-tag block mb-4">{children}</span>;
};
