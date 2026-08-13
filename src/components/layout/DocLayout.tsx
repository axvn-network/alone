/**
 * src/components/layouts/DocLayout.tsx
 *
 * Layout chuẩn cho mọi trang tài liệu / chiến lược.
 * Cấu trúc:
 *
 *   <DocLayout>
 *     <DocSidebar toc={TOC_ITEMS} />
 *     <DocMain>
 *       <DocHero>...</DocHero>
 *       <DocBody>...</DocBody>
 *     </DocMain>
 *   </DocLayout>
 *
 * Responsive:
 *   - Mobile: sidebar ẩn, hero full-width, body full-width
 *   - Desktop (lg+): 2-column: sidebar cố định bên trái, main scrolls
 *
 * Usage:
 *   import DocLayout, { DocBody, DocHero, DocMain, DocSidebar } from "@/components/layout/DocLayout";
 *
 *   export default function MyPage() {
 *     return (
 *       <DocLayout>
 *         <DocSidebar toc={TOC_ITEMS} />
 *         <DocMain>
 *           <DocHero><Timeline /></DocHero>
 *           <DocBody><Accordion title="Xem chi tiết đầy đủ">...</Accordion></DocBody>
 *         </DocMain>
 *       </DocLayout>
 *     );
 *   }
 */

import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TocItem {
  id: string;
  label: string;
  /** Nesting level — mặc định 1 */
  level?: 1 | 2;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Sidebar mục lục thông minh — sticky khi scroll */
function Sidebar({ toc, className = "" }: { toc: readonly TocItem[]; className?: string }) {
  return (
    <aside
      aria-label="Mục lục"
      className={`hidden lg:block w-56 xl:w-64 shrink-0 self-start sticky top-24 ${className}`}
    >
      <div className="rounded-xl border border-AXVN-gold/15 bg-AXVN-deep p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold mb-3">
          Mục lục
        </p>
        <nav aria-label="Mục lục trang">
          <ol className="space-y-1">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded px-2 py-1.5 text-xs leading-snug transition-colors hover:bg-AXVN-gold/10 hover:text-AXVN-gold focus-visible:outline-2 focus-visible:outline-AXVN-gold ${item.level === 2
                      ? "pl-5 text-AXVN-silver/55"
                      : "text-AXVN-silver/80"
                    }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

/** Khu vực hero — chứa visual component chính */
function Hero({ children, id = "visual", className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} aria-label="Trực quan hóa" className={`w-full ${className}`}>
      {children}
    </section>
  );
}

/** Khu vực body — accordion fallback chứa nội dung chi tiết */
function Body({ children, id = "details", className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <section
      id={id}
      aria-label="Nội dung chi tiết"
      className={`mt-10 w-full ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface DocLayoutProps {
  children: ReactNode;
  /** Padding ngoài cùng — mặc định dùng section-px */
  className?: string;
}

/**
 * Root layout component. Sắp xếp sidebar + main content theo 2 cột ở desktop.
 * children nên là tổ hợp DocSidebar và DocMain; DocHero và DocBody nằm trong DocMain.
 */
export function DocLayout({ children, className = "" }: DocLayoutProps) {
  return (
    <div
      className={`max-w-7xl mx-auto px-[var(--section-px)] py-[var(--section-py)] ${className}`}
    >
      <div className="flex gap-8 xl:gap-12 items-start">
        {children}
      </div>
    </div>
  );
}

// ─── Main content wrapper ─────────────────────────────────────────────────────

/** Bao bọc Hero + Body trong cột main (flex-1) */
export function DocMain({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 min-w-0 ${className}`}>{children}</div>;
}

export { Sidebar as DocSidebar, Hero as DocHero, Body as DocBody };

export default DocLayout;
