import type { ReactNode } from "react";

interface SectionHeaderProps {
  tag?: string;
  heading: ReactNode;
  description?: string;
  /** "left" | "center" (default "center") */
  align?: "left" | "center";
  /** On dark bg (text colors adjust automatically based on parent) */
  dark?: boolean;
  className?: string;
}

/**
 * Chuẩn hóa phần header của mỗi section:
 *  - Eyebrow tag (section-tag class)
 *  - h2 với font-light uppercase
 *  - Mô tả tùy chọn
 *
 * Sử dụng trong server components (không dùng animation).
 * Để có animation, bọc ngoài bằng <Reveal>.
 */
export default function SectionHeader({
  tag,
  heading,
  description,
  align = "center",
  dark = false,
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "text-center mx-auto max-w-4xl" : ""} ${className}`}>
      {tag && (
        <div className={`flex items-center gap-3 mb-5 ${isCenter ? "justify-center" : ""}`}>
          <div className="w-5 h-px bg-AXVN-gold/55" />
          <span className="section-tag">{tag}</span>
          {isCenter && <div className="w-5 h-px bg-AXVN-gold/55" />}
        </div>
      )}
      <h2
        className={`font-light leading-[1.28] uppercase ${dark ? "text-AXVN-ivory" : "text-AXVN-navy"}`}
        style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={`mt-5 leading-[1.8] ${isCenter ? "max-w-2xl mx-auto" : "max-w-3xl"} ${dark ? "text-AXVN-silver/75" : "text-AXVN-charcoal/65"}`}
          style={{ fontSize: "var(--text-body)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
