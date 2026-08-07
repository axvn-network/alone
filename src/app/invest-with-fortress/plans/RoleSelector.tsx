"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Globe,
  Cpu,
  Landmark,
  Scale,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface Role {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
  iconBg: string;
  minCapital: string;
  equity: string;
  highlight: string;
  rights: string[];
  obligations: string[];
  documents: string[];
  warning?: string;
}

const ROLES: Role[] = [
  {
    id: "individual",
    label: "Cá Nhân / Nhà Đầu Tư Nhỏ",
    group: "Nhóm ≤35% — Cổ đông phổ thông",
    icon: User,
    color: "text-sky-300",
    border: "border-sky-400/30",
    iconBg: "bg-sky-500/15",
    minCapital: "Từ 100 triệu VNĐ",
    equity: "Theo tỷ lệ góp trong nhóm ≤35%",
    highlight: "Phù hợp với cá nhân muốn tham gia lịch sử hình thành thị trường TSMH hợp pháp đầu tiên tại Việt Nam.",
    rights: [
      "Dự và biểu quyết tại Đại hội cổ đông thường niên",
      "Nhận cổ tức khi công ty có lợi nhuận",
      "Ưu tiên mua cổ phần khi phát hành thêm",
      "Tiếp cận báo cáo tài chính và thông tin nội bộ",
    ],
    obligations: [
      "Góp đủ vốn theo cam kết và đúng hạn",
      "Tuân thủ Điều lệ công ty và Nghị quyết ĐHCĐ",
      "Không chuyển nhượng cổ phần trong thời gian lock-up",
    ],
    documents: [
      "CMND / CCCD / Hộ chiếu còn hiệu lực",
      "Hợp đồng góp vốn ký kết với Fortress",
      "Giấy xác nhận chuyển tiền góp vốn",
    ],
  },
  {
    id: "org-vn",
    label: "Tổ Chức Tài Chính / Công Nghệ",
    group: "Nhóm bắt buộc >35% — ít nhất 2 tổ chức",
    icon: Building2,
    color: "text-emerald-300",
    border: "border-emerald-400/30",
    iconBg: "bg-emerald-500/15",
    minCapital: "Từ 500 tỷ VNĐ",
    equity: "Tỷ lệ lớn trong nhóm bắt buộc >35%",
    highlight: "Đây là nhóm cổ đông bắt buộc theo luật — ít nhất 2 tổ chức (ngân hàng, CTCK, quỹ, bảo hiểm, DN công nghệ) phải nắm >35% VĐL.",
    warning: "Điều kiện bắt buộc (Điều 8, Khoản 4): kinh doanh có lãi 2 năm liền trước · BCTC 2 năm được kiểm toán chấp thuận toàn phần · chỉ góp vốn tại DUY NHẤT 1 tổ chức TSMH.",
    rights: [
      "Tham gia Hội đồng quản trị theo tỷ lệ cổ phần",
      "Biểu quyết các quyết định chiến lược trọng yếu",
      "Nhận cổ tức và quyền lợi ưu tiên cổ đông lớn",
      "Quyền phủ quyết với một số quyết định quan trọng",
    ],
    obligations: [
      "Cung cấp BCTC 2 năm kiểm toán chấp thuận toàn phần",
      "Cam kết không góp vốn tại tổ chức TSMH khác",
      "Tham gia tích cực vào quản trị và định hướng dự án",
      "Hỗ trợ xây dựng quy trình nghiệp vụ theo chuyên môn",
    ],
    documents: [
      "Giấy ĐKKD và Điều lệ công ty",
      "BCTC 2 năm gần nhất đã kiểm toán (ý kiến chấp thuận toàn phần)",
      "Nghị quyết HĐQT/ĐHCĐ về việc tham gia góp vốn",
      "Hồ sơ pháp lý người đại diện theo pháp luật",
      "Xác nhận không tham gia tổ chức TSMH nào khác",
    ],
  },
  {
    id: "org-other",
    label: "Doanh Nghiệp / Tập Đoàn Khác",
    group: "Nhóm 30% — Tổ chức không phải tài chính",
    icon: Landmark,
    color: "text-blue-300",
    border: "border-blue-400/30",
    iconBg: "bg-blue-500/15",
    minCapital: "Từ 100 tỷ VNĐ",
    equity: "Trong nhóm 30% (tổ chức không tài chính)",
    highlight: "Doanh nghiệp, tập đoàn, quỹ đầu tư không thuộc nhóm tài chính — vẫn đóng vai trò cổ đông chiến lược với tỷ lệ đáng kể.",
    rights: [
      "Tham gia Đại hội cổ đông và biểu quyết",
      "Nhận cổ tức theo tỷ lệ góp vốn",
      "Đề cử thành viên HĐQT nếu đạt ngưỡng tối thiểu",
    ],
    obligations: [
      "Góp đủ vốn bằng đồng Việt Nam theo cam kết",
      "Tuân thủ Điều lệ và Nghị quyết ĐHCĐ",
      "Duy trì tư cách pháp nhân hợp lệ trong suốt thời gian góp vốn",
    ],
    documents: [
      "Giấy ĐKKD và Điều lệ công ty",
      "BCTC năm gần nhất",
      "Nghị quyết nội bộ về việc góp vốn",
      "Hồ sơ người đại diện ký hợp đồng",
    ],
  },
  {
    id: "foreign",
    label: "Nhà Đầu Tư / Tổ Chức Nước Ngoài",
    group: "Nhóm ≤49% — Giới hạn tuyệt đối",
    icon: Globe,
    color: "text-rose-300",
    border: "border-rose-400/30",
    iconBg: "bg-rose-500/15",
    minCapital: "Thương lượng trực tiếp",
    equity: "≤49% tổng VĐL (giới hạn tuyệt đối)",
    highlight: "Tham gia theo diện nhà đầu tư nước ngoài — cần thêm một số thủ tục pháp lý so với cổ đông trong nước.",
    warning: "Tổng cổ phần nước ngoài không được vượt 49% VĐL theo Điều 8, Khoản 4 — bất kể số lượng nhà đầu tư. Cần mở tài khoản IICA trước khi chuyển vốn.",
    rights: [
      "Quyền cổ đông như cổ đông trong nước cùng nhóm",
      "Bảo hộ đầu tư theo Hiệp định đầu tư quốc tế",
      "Chuyển lợi nhuận ra nước ngoài sau khi hoàn thành nghĩa vụ thuế",
    ],
    obligations: [
      "Mở tài khoản vốn đầu tư gián tiếp (IICA) tại ngân hàng Việt Nam",
      "Đăng ký đầu tư và nhận Giấy chứng nhận đăng ký đầu tư (IRC)",
      "Làm thủ tục góp vốn có yếu tố nước ngoài tại Sở KHĐT",
      "Cung cấp thông tin UBO (cơ cấu sở hữu thực hưởng)",
    ],
    documents: [
      "Hộ chiếu / Giấy tờ tùy thân còn hiệu lực",
      "Giấy chứng nhận đăng ký đầu tư (IRC) — do Sở KHĐT cấp",
      "Xác nhận tài khoản IICA từ ngân hàng Việt Nam",
      "Tài liệu UBO (cơ cấu sở hữu thực hưởng)",
      "Với tổ chức: Giấy ĐKKD, BCTC kiểm toán, nghị quyết nội bộ",
    ],
  },
  {
    id: "tech",
    label: "Đối Tác Công Nghệ",
    group: "Vai trò kỹ thuật cốt lõi — Điều kiện cấp phép",
    icon: Cpu,
    color: "text-purple-300",
    border: "border-purple-400/30",
    iconBg: "bg-purple-500/15",
    minCapital: "Góp bằng hệ thống & IP — không yêu cầu tiền mặt tối thiểu",
    equity: "15–25% (hoán đổi IP + năng lực đội ngũ)",
    highlight: "Đây là vai trò quan trọng nhất về mặt kỹ thuật. Không có CNTT cấp 4, không được cấp phép. Đối tác công nghệ biến dự án thành thực tế.",
    rights: [
      "Cổ phần hoán đổi theo định giá IP / sản phẩm bàn giao",
      "Quyền lợi đối tác dài hạn sau khi sàn vận hành",
      "Tham gia định hướng kỹ thuật và lộ trình sản phẩm",
    ],
    obligations: [
      "Xây dựng hệ thống CNTT đạt chuẩn cấp độ 4 (Bộ Công An thẩm định)",
      "Triển khai đủ 10 quy trình nghiệp vụ theo quy định",
      "Cung cấp đội ngũ: CTO ≥5 năm kinh nghiệm CNTT, ≥10 chuyên gia ATTT",
      "Hỗ trợ vận hành và bảo trì hệ thống sau khi cấp phép",
    ],
    documents: [
      "Hồ sơ năng lực công ty và đội ngũ kỹ thuật",
      "Đề xuất kiến trúc hệ thống và lộ trình triển khai",
      "Định giá IP / gói dịch vụ làm cơ sở hoán đổi cổ phần",
      "CV của CTO và các chuyên gia ATTT chủ chốt",
    ],
  },
  {
    id: "legal",
    label: "Đối Tác Pháp Lý / Tuân Thủ",
    group: "Vai trò hỗ trợ — Cổ phần hoán đổi dịch vụ",
    icon: Scale,
    color: "text-amber-300",
    border: "border-amber-400/30",
    iconBg: "bg-amber-500/15",
    minCapital: "Góp bằng dịch vụ pháp lý / tuân thủ",
    equity: "Theo định giá gói dịch vụ",
    highlight: "Đơn vị pháp lý và tuân thủ giúp xây dựng 10 quy trình nghiệp vụ, AML/KYC, hồ sơ xin cấp phép — cổ phần hoán đổi theo gói dịch vụ.",
    rights: [
      "Cổ phần hoán đổi theo định giá gói dịch vụ ký kết",
      "Quyền lợi đối tác dài hạn sau khi sàn vận hành",
    ],
    obligations: [
      "Xây dựng và chuẩn hóa 10 quy trình nghiệp vụ theo quy định",
      "Soạn thảo và hoàn thiện hồ sơ xin cấp phép",
      "Tư vấn và hỗ trợ liên tục về AML, KYC, tuân thủ",
      "Tham gia bảo vệ hồ sơ trước Bộ Tài Chính khi cần",
    ],
    documents: [
      "Hồ sơ năng lực công ty pháp lý / tuân thủ",
      "Đề xuất phạm vi dịch vụ và định giá làm cơ sở hoán đổi cổ phần",
      "Danh sách chuyên gia pháp lý chủ chốt và kinh nghiệm liên quan",
    ],
  },
];

export default function RoleSelector() {
  const [active, setActive] = useState<string | null>(null);
  const [tab, setTab] = useState<"rights" | "obligations" | "documents">("rights");

  const selected = ROLES.find((r) => r.id === active) ?? null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Role grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = active === role.id;
          return (
            <button
              key={role.id}
              onClick={() => {
                setActive(isActive ? null : role.id);
                setTab("rights");
              }}
              className={`group text-left p-5 rounded-xl border transition-all duration-200 ${
                isActive
                  ? `${role.border} bg-fortress-navy ring-1 ring-fortress-gold/20`
                  : "border-fortress-silver/10 bg-fortress-deep hover:border-fortress-gold/25 hover:bg-fortress-deep/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${role.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${role.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm leading-snug ${isActive ? role.color : "text-fortress-ivory"}`}>
                    {role.label}
                  </p>
                  <p className="text-fortress-silver/50 text-[10px] mt-0.5 leading-snug">{role.group}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200 ${
                    isActive ? `${role.color} rotate-180` : "text-fortress-silver/30"
                  }`}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-fortress-silver/40 text-[9px] uppercase tracking-wider mb-0.5">Vốn tối thiểu</p>
                  <p className={`text-[10px] font-semibold leading-tight ${isActive ? role.color : "text-fortress-ivory/80"}`}>
                    {role.minCapital}
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-fortress-silver/40 text-[9px] uppercase tracking-wider mb-0.5">Cổ phần</p>
                  <p className={`text-[10px] font-semibold leading-tight ${isActive ? role.color : "text-fortress-ivory/80"}`}>
                    {role.equity}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className={`rounded-2xl border ${selected.border} bg-fortress-navy overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-fortress-gold/10">
            <div className={`w-10 h-10 rounded-xl ${selected.iconBg} flex items-center justify-center shrink-0`}>
              <selected.icon className={`w-5 h-5 ${selected.color}`} />
            </div>
            <div>
              <h3 className={`font-black text-base ${selected.color}`}>{selected.label}</h3>
              <p className="text-fortress-silver/50 text-xs mt-0.5">{selected.group}</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Highlight */}
            <p className="text-fortress-ivory/80 text-sm leading-relaxed">{selected.highlight}</p>

            {/* Warning if any */}
            {selected.warning && (
              <div className="flex items-start gap-3 p-4 bg-amber-500/8 border border-amber-400/20 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-amber-200/80 text-xs leading-relaxed">{selected.warning}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-fortress-deep rounded-xl">
              {(
                [
                  { key: "rights",      label: "Quyền Lợi",    Icon: CheckCircle },
                  { key: "obligations", label: "Nghĩa Vụ",     Icon: AlertTriangle },
                  { key: "documents",   label: "Hồ Sơ Cần Có", Icon: FileText },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold tracking-wide rounded-lg transition-colors ${
                    tab === t.key
                      ? "bg-fortress-navy text-fortress-ivory shadow-sm"
                      : "text-fortress-silver/60 hover:text-fortress-ivory hover:bg-fortress-charcoal"
                  }`}
                >
                  <t.Icon className="w-3 h-3" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "rights" && (
              <ul className="space-y-2">
                {selected.rights.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 bg-fortress-deep/60 rounded-lg">
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${selected.color}`} />
                    <span className="text-fortress-silver/80 text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "obligations" && (
              <ul className="space-y-2">
                {selected.obligations.map((o, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 bg-fortress-deep/60 border border-fortress-gold/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-fortress-gold/70" />
                    <span className="text-fortress-silver/80 text-sm leading-relaxed">{o}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "documents" && (
              <ul className="space-y-2">
                {selected.documents.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 bg-fortress-deep/60 border border-fortress-gold/10 rounded-lg">
                    <FileText className="w-4 h-4 mt-0.5 shrink-0 text-fortress-gold/60" />
                    <span className="text-fortress-silver/80 text-sm leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="pt-2 border-t border-fortress-gold/10 flex flex-col sm:flex-row gap-3">
              <a
                href="/invest-with-fortress#connect"
                className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
              >
                Đăng Ký Vai Trò Này
              </a>
              <a
                href="/contact"
                className="flex-1 flex items-center justify-center py-3 border border-fortress-gold/25 text-fortress-gold font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-fortress-gold/5 transition-colors"
              >
                Hỏi Thêm
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
