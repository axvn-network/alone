import type { ReactNode } from "react";

/**
 * ProseSection — khung trình bày tài liệu pháp lý / văn bản dài.
 * Mỗi section có số thứ tự, tiêu đề và nội dung.
 */
export interface ProseSectionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface ProseDocProps {
  sections: ProseSectionItem[];
}

export default function ProseDoc({ sections }: ProseDocProps) {
  return (
    <div className="space-y-0">
      {sections.map((sec, i) => (
        <div key={sec.id} id={sec.id} className="group">
          {/* Số thứ tự + đường gạch dưới */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-fortress-gold/40 font-mono font-black text-xs tracking-[3px] select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-fortress-gold/15" />
          </div>

          {/* Heading */}
          <h2
            className="font-semibold text-fortress-navy mb-4 leading-snug"
            style={{ fontSize: "var(--text-h3)" }}
          >
            {sec.title}
          </h2>

          {/* Body */}
          <div
            className="prose-content text-fortress-charcoal/70 leading-[1.85] mb-10 md:mb-14"
            style={{ fontSize: "var(--text-body)" }}
          >
            {sec.content}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ProseList — danh sách bullet chuẩn cho tài liệu pháp lý
 */
export function ProseList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-fortress-gold/60 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * ProseNote — hộp ghi chú cảnh báo
 */
export function ProseNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 p-4 rounded-sm border-l-2 border-fortress-gold/50 bg-fortress-gold/5">
      <span className="text-fortress-gold text-xs font-bold uppercase tracking-widest shrink-0 mt-0.5">Lưu ý</span>
      <div className="text-fortress-charcoal/65 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
