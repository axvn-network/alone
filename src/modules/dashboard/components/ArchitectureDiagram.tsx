"use client";

import {
  ARCH_CONNECTIONS,
  ARCH_LEGEND,
  ARCH_NODES,
  type ArchNode,
} from "@/shared/constants/system-architecture";

interface ArchitectureDiagramProps {
  nodes?: readonly ArchNode[];
}

/**
 * Sơ đồ khái niệm về các bên và vai trò trong hệ sinh thái.
 * Data được truyền vào để component có thể tái sử dụng và kiểm thử độc lập.
 */
export function ArchitectureDiagram({
  nodes = ARCH_NODES,
}: ArchitectureDiagramProps) {
  const hub = nodes.find((node) => node.role === "hub") ?? nodes[0];
  const relatedNodes = nodes.filter((node) => node.id !== hub?.id);
  const connectionByTarget = new Map(
    ARCH_CONNECTIONS.map((connection) => [connection.to, connection]),
  );

  if (!hub) return null;

  return (
    <section
      className="rounded-xl border border-AXVN-gold/15 bg-AXVN-deep p-5 sm:p-7"
      aria-label="Sơ đồ hệ sinh thái"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-AXVN-gold">
          Sơ đồ khái niệm
        </p>
        <h2 className="mt-2 text-xl font-semibold text-AXVN-ivory">
          Các vai trò và mối liên hệ tham chiếu
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-AXVN-silver/70">
          Sơ đồ minh họa các nhóm vai trò ở mức định hướng, không mô tả hạ tầng
          vận hành, luồng dữ liệu hay cơ chế cấp phép.
        </p>
      </div>

      <article
        className={`mx-auto mt-8 max-w-sm rounded-xl border p-5 text-center ${hub.color} ${hub.border}`}
      >
        <p className={`font-semibold tracking-wide ${hub.textColor}`}>
          {hub.label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-AXVN-silver/75">
          {hub.sub}
        </p>
      </article>

      <div className="mx-auto h-7 w-px bg-AXVN-gold/40" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedNodes.map((node) => (
          <article
            key={node.id}
            className={`rounded-xl border p-4 ${node.color} ${node.border}`}
          >
            <p className={`text-sm font-semibold ${node.textColor}`}>
              {node.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-AXVN-silver/75">
              {node.sub}
            </p>
            {connectionByTarget.get(node.id) && (
              <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-AXVN-silver/55">
                {connectionByTarget.get(node.id)?.label}
              </p>
            )}
          </article>
        ))}
      </div>

      <ul
        className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-5"
        aria-label="Chú giải sơ đồ"
      >
        {ARCH_LEGEND.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-[11px] text-AXVN-silver/65"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${item.color}`}
              aria-hidden="true"
            />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ArchitectureDiagram;
