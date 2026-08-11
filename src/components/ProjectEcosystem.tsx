"use client";

import { motion } from "framer-motion";

interface Node {
  id: string;
  label: string;
  sub: string;
  color: string;
  border: string;
  textColor: string;
  size: "lg" | "md" | "sm";
}

const NODES: Node[] = [
  {
    id: "fortress",
    label: "FORTRESS",
    sub: "Điều phối · Pháp lý · Chiến lược",
    color: "bg-gvi-gold/15",
    border: "border-gvi-gold/60",
    textColor: "text-gvi-gold",
    size: "lg",
  },
  {
    id: "btc",
    label: "BỘ TÀI CHÍNH",
    sub: "Cấp phép · Giám sát · Pháp chế",
    color: "bg-blue-500/10",
    border: "border-blue-400/50",
    textColor: "text-blue-300",
    size: "md",
  },
  {
    id: "institution",
    label: "TỔ CHỨC TÀI CHÍNH",
    sub: "Ngân hàng · CTCK · Quỹ · Bảo hiểm",
    color: "bg-emerald-500/10",
    border: "border-emerald-400/40",
    textColor: "text-emerald-300",
    size: "md",
  },
  {
    id: "tech",
    label: "ĐỐI TÁC CÔNG NGHỆ",
    sub: "Xây hệ thống · CNTT cấp 4 · Điều kiện cấp phép",
    color: "bg-purple-500/10",
    border: "border-purple-400/40",
    textColor: "text-purple-300",
    size: "md",
  },
  {
    id: "legal",
    label: "PHÁP LÝ & TUÂN THỦ",
    sub: "AML · KYC · Quy trình nghiệp vụ",
    color: "bg-amber-500/10",
    border: "border-amber-400/40",
    textColor: "text-amber-300",
    size: "sm",
  },
  {
    id: "individual",
    label: "CÁ NHÂN / TỔ CHỨC NHỎ",
    sub: "Cổ đông phổ thông · ≤35% tổng vốn",
    color: "bg-sky-500/10",
    border: "border-sky-400/40",
    textColor: "text-sky-300",
    size: "sm",
  },
  {
    id: "foreign",
    label: "NHÀ ĐẦU TƯ NƯỚC NGOÀI",
    sub: "Tối đa 49% · IRC · IICA",
    color: "bg-rose-500/10",
    border: "border-rose-400/40",
    textColor: "text-rose-300",
    size: "sm",
  },
];

const CONNECTIONS = [
  { from: "fortress", to: "btc",         label: "Nộp hồ sơ xin cấp phép" },
  { from: "fortress", to: "institution", label: "Kết nạp cổ đông tổ chức" },
  { from: "fortress", to: "tech",        label: "Triển khai hạ tầng" },
  { from: "fortress", to: "legal",       label: "Xây dựng quy trình" },
  { from: "fortress", to: "individual",  label: "Mở đăng ký góp vốn" },
  { from: "fortress", to: "foreign",     label: "Kết nối quốc tế" },
];

const SIZE_STYLE = {
  lg: "px-5 py-4 min-w-[160px]",
  md: "px-4 py-3 min-w-[140px]",
  sm: "px-3 py-2.5 min-w-[128px]",
};

const TEXT_SIZE = {
  lg: "text-sm font-black",
  md: "text-xs font-bold",
  sm: "text-[11px] font-bold",
};

const SUB_SIZE = {
  lg: "text-[11px]",
  md: "text-[10px]",
  sm: "text-[10px]",
};

// Positions (percent of container width/height) for the hub-and-spoke layout
// Fortress at center, others around
const POSITIONS: Record<string, { x: number; y: number }> = {
  fortress:    { x: 50, y: 44 },
  btc:         { x: 50, y:  8 },
  institution: { x: 15, y: 22 },
  tech:        { x: 85, y: 22 },
  legal:       { x: 15, y: 68 },
  individual:  { x: 50, y: 82 },
  foreign:     { x: 85, y: 68 },
};

export default function ProjectEcosystem() {
  return (
    <div className="w-full">
      {/* Mobile: simple vertical list with arrows */}
      <div className="block lg:hidden space-y-3">
        {/* Center node */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`${SIZE_STYLE.lg} ${NODES[0].color} border ${NODES[0].border} rounded-xl text-center`}
          >
            <p className={`${TEXT_SIZE.lg} ${NODES[0].textColor} tracking-widest`}>{NODES[0].label}</p>
            <p className={`${SUB_SIZE.lg} text-gvi-silver/50 mt-0.5`}>{NODES[0].sub}</p>
          </motion.div>
        </div>
        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="w-px h-5 bg-gvi-gold/30" />
        </div>
        {/* Satellite nodes in 2-col grid */}
        <div className="grid grid-cols-2 gap-3">
          {NODES.slice(1).map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`${node.color} border ${node.border} rounded-xl p-3 text-center`}
            >
              <p className={`${TEXT_SIZE.sm} ${node.textColor} tracking-wide leading-tight`}>{node.label}</p>
              <p className={`${SUB_SIZE.sm} text-gvi-silver/65 mt-1 leading-snug`}>{node.sub}</p>
            </motion.div>
          ))}
        </div>
        {/* Connections legend */}
        <div className="mt-4 space-y-2">
          {CONNECTIONS.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gvi-gold/50 shrink-0" />
              <p className="text-gvi-silver/70 text-[11px]">
                <span className="text-gvi-gold/80 font-semibold">GVI Tech Holding</span>
                {" → "}
                <span className="text-gvi-ivory/70">
                  {NODES.find(n => n.id === c.to)?.label}
                </span>
                {" — "}
                <span className="italic">{c.label}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: SVG hub-and-spoke diagram */}
      <div className="hidden lg:block relative w-full" style={{ paddingBottom: "56%" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 560"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {CONNECTIONS.map((c, i) => {
            const from = POSITIONS[c.from];
            const to   = POSITIONS[c.to];
            const x1 = from.x * 10;
            const y1 = from.y * 5.6;
            const x2 = to.x   * 10;
            const y2 = to.y   * 5.6;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            return (
              <g key={i}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(201,162,74,0.20)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={mx} y={my - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(174,182,193,0.45)"
                  fontFamily="ui-monospace, monospace"
                >
                  {c.label}
                </text>
              </g>
            );
          })}

          {/* Node boxes rendered as foreignObject */}
          {NODES.map((node, i) => {
            const pos = POSITIONS[node.id];
            const w = node.size === "lg" ? 180 : node.size === "md" ? 160 : 148;
            const h = node.size === "lg" ? 68  : node.size === "md" ? 60  : 56;
            const x = pos.x * 10 - w / 2;
            const y = pos.y * 5.6 - h / 2;
            return (
              <g key={node.id}>
                <foreignObject x={x} y={y} width={w} height={h}>
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center rounded-xl border text-center px-2 ${node.color} ${node.border}`}
                    style={{ border: "1px solid" }}
                  >
                    <p className={`font-black tracking-widest leading-tight ${
                      node.size === "lg" ? "text-[11px]" : "text-[9.5px]"
                    } ${node.textColor}`}>
                      {node.label}
                    </p>
                    <p className="text-[8.5px] text-gray-300 mt-0.5 leading-snug px-1">
                      {node.sub}
                    </p>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend bar */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {[
          { color: "bg-gvi-gold/40",  label: "Điều phối trung tâm" },
          { color: "bg-blue-400/40",       label: "Cơ quan quản lý" },
          { color: "bg-emerald-400/40",    label: "Cổ đông bắt buộc (>35%)" },
          { color: "bg-purple-400/40",     label: "Đối tác kỹ thuật" },
          { color: "bg-sky-400/40",        label: "Cổ đông phổ thông" },
          { color: "bg-rose-400/40",       label: "Nước ngoài (≤49%)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
            <span className="text-gvi-silver/70 text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
