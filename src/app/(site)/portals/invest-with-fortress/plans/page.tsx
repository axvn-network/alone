import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/public/SectionHeader";
import InvestmentPlansClient from "./InvestmentPlansClient";
import RoleSelector from "./RoleSelector";
import ProjectEcosystem from "@/components/public/ProjectEcosystem";
import PartnerJourney from "@/components/public/PartnerJourney";
import { PROJECT_TIMELINE, CURRENT_PHASE, CAPITAL_AMOUNT } from "@/constants/project";
import {
  CheckCircle,
  AlertTriangle,
  CircleDot,
  CheckCheck,
  Clock,
  Building2,
  Coins,
  BarChart3,
  ShieldCheck,
  Users,
  ClipboardList,
  Monitor,
  Landmark,
  Globe,
  Lock,
  Zap,
  FileText,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hạng Mục Hợp Tác | GVI Tech Holding",
  description:
    "Hướng dẫn đầy đủ để trở thành cổ đông xây dựng sàn giao dịch tài sản mã hóa hợp pháp đầu tiên Việt Nam theo NQ 05/2025/NQ-CP. Hiểu rõ vai trò, quyền, nghĩa vụ và hồ sơ cần chuẩn bị.",
  openGraph: {
    title: "Hạng Mục Hợp Tác | GVI Tech Holding",
    description:
      "Hướng dẫn đầy đủ — từ định nghĩa pháp lý đến hồ sơ cấp phép — để trở thành cổ đông cùng GVI Tech Holding xây dựng sàn TSMH đầu tiên tại Việt Nam.",
  },
};

/* ─── Static data (timeline sourced from @/constants/project) ────────────── */

const CAPITAL_STRUCTURE = [
  { pct: 35, label: ">35% — Tổ chức tài chính/CN bắt buộc", color: "#C9A24A", detail: "≥2 ngân hàng, CTCK, quản lý quỹ, bảo hiểm, DN công nghệ" },
  { pct: 30, label: "30% — Tổ chức khác (trong ≥65%)", color: "#3B82F6", detail: "Doanh nghiệp, quỹ đầu tư, tập đoàn" },
  { pct: 16, label: "16% — Cá nhân & tổ chức nhỏ (≤35%)", color: "#10B981", detail: "Cá nhân, startup, nhà đầu tư nhỏ" },
  { pct: 19, label: "≤49% — Nhà đầu tư nước ngoài", color: "#8B5CF6", detail: "Giới hạn tuyệt đối theo Điều 8 Khoản 4" },
];

const FAQ = [
  {
    q: "GVI Tech Holding đang ở giai đoạn nào? Tôi có bị trễ không?",
    a: "GVI Tech Holding đang ở giai đoạn 03 — tích lũy vốn và tuyển đối tác. Đây là thời điểm tốt nhất để tham gia: bạn được vào với mức định giá thấp nhất, cổ phần tốt nhất, và có tiếng nói sớm nhất trong chiến lược dự án. Chưa ai được cấp phép tại Việt Nam.",
  },
  {
    q: "Vốn điều lệ 10.000 tỷ VNĐ — một mình không góp nổi, làm sao?",
    a: "Đúng — đây là lý do dự án cần nhiều đối tác. 10.000 tỷ VNĐ ≈ 400 triệu USD, được chia cho nhiều cổ đông: >35% từ ≥2 tổ chức tài chính/công nghệ, 30% từ tổ chức khác, ≤35% cá nhân, ≤49% nước ngoài. Không ai cần góp toàn bộ.",
  },
  {
    q: "Nếu dự án không được cấp phép thì vốn góp của tôi ra sao?",
    a: "Vốn góp được bảo vệ bởi Điều lệ công ty và hợp đồng góp vốn theo Luật Doanh nghiệp. Nếu không được cấp phép, công ty có thể chuyển sang mô hình kinh doanh khác hoặc thanh lý theo đúng quy định pháp luật, cổ đông nhận lại phần vốn tương ứng sau khi thanh toán nghĩa vụ.",
  },
  {
    q: "Khi nào sàn bắt đầu hoạt động và tôi có lợi nhuận?",
    a: "Theo quy định, sau 30 ngày nhận giấy phép là phải hoạt động. Dự kiến 2026–2027. Cổ tức phụ thuộc vào kết quả kinh doanh — đây là đầu tư dài hạn. Giá trị cổ phần có thể tăng đáng kể khi sàn hoạt động và thị trường mở rộng.",
  },
  {
    q: "Tôi là người Việt Nam ở nước ngoài — có tham gia được không?",
    a: "Được. Nếu còn quốc tịch Việt Nam: tham gia như cổ đông trong nước. Nếu đã từ bỏ hoặc mang quốc tịch khác: tham gia theo diện nhà đầu tư nước ngoài (tối đa 49% tổng), cần mở tài khoản IICA và làm thủ tục góp vốn theo Luật Đầu tư.",
  },
  {
    q: "Tổ chức nước ngoài tham gia cần làm gì thêm so với cổ đông trong nước?",
    a: "Cần thêm: Giấy chứng nhận đăng ký đầu tư (IRC), mở tài khoản vốn đầu tư gián tiếp (IICA) tại ngân hàng VN, nộp thủ tục góp vốn có yếu tố nước ngoài tại Sở KHĐT, cung cấp tài liệu UBO (cơ cấu sở hữu thực hưởng). Toàn bộ trong giới hạn 49% VĐL.",
  },
  {
    q: "Đóng góp bằng IP / công nghệ / dịch vụ pháp lý thay vì tiền mặt được không?",
    a: "Được, đối với một số vai trò đặc thù (đối tác công nghệ, đối tác pháp lý). Cổ phần được tính theo định giá IP hoặc gói dịch vụ. Tuy nhiên, theo NQ5, vốn điều lệ bắt buộc phải góp bằng đồng Việt Nam — phần hoán đổi IP/dịch vụ cần cơ cấu pháp lý riêng.",
  },
  {
    q: "Tôi chỉ có 100–500 triệu VNĐ, có tham gia được không?",
    a: "Được — với tư cách cổ đông cá nhân trong nhóm ≤35% còn lại. Cổ phần nhỏ nhưng bạn được tham gia ĐHCĐ, nhận cổ tức, và là một phần của dự án lịch sử. Liên hệ để biết mức tối thiểu hiện tại và phần vốn còn trống.",
  },
];

const LICENSING_CONDITIONS = [
  { n: "01", Icon: Building2,      label: "Pháp nhân VN",            detail: "CTCP hoặc TNHH — ĐKKD dịch vụ TSMH",                                                          source: "Khoản 1" },
  { n: "02", Icon: Coins,          label: "Vốn điều lệ 10.000 tỷ",   detail: "Đã góp đủ bằng đồng Việt Nam",                                                               source: "Khoản 2" },
  { n: "03", Icon: BarChart3,      label: "Cơ cấu cổ đông",          detail: "≥65% tổ chức; >35% từ ≥2 tổ chức tài chính/CN; ≤49% nước ngoài",                             source: "Khoản 4" },
  { n: "04", Icon: CheckCheck,     label: "Điều kiện cổ đông",        detail: "Pháp nhân + lãi 2 năm + BCTC kiểm toán TP + chỉ 1 sàn",                                    source: "Khoản 4" },
  { n: "05", Icon: Users,          label: "Nhân sự chuẩn",            detail: "TGĐ ≥2 năm TC/CK; CTO ≥5 năm CNTT; ≥10 ATTT; ≥10 hành nghề CK",                           source: "Khoản 5" },
  { n: "06", Icon: ClipboardList,  label: "10 Quy trình nghiệp vụ",   detail: "AML, giao dịch, lưu ký, tự doanh, phát hành, CBTT, rủi ro, kiểm soát, khiếu nại, xung đột", source: "Khoản 6" },
  { n: "07", Icon: Monitor,        label: "CNTT cấp độ 4",            detail: "Chuẩn ATTT cấp 4 — thẩm định Bộ Công an trước khi vận hành",                               source: "Khoản 7" },
  { n: "08", Icon: Landmark,       label: "Trụ sở + hạ tầng",         detail: "Trụ sở làm việc hợp pháp, cơ sở vật chất và hệ thống CNTT phù hợp",                        source: "Khoản 3" },
];

const DOC_SUMMARY = [
  { Icon: Building2,   label: "Pháp lý Doanh nghiệp", count: "5 tài liệu", color: "border-blue-500/30 bg-blue-500/5",          iconColor: "text-blue-400" },
  { Icon: Coins,       label: "Cổ đông & Vốn góp",   count: "6 tài liệu", color: "border-gvi-gold/30 bg-gvi-gold/5", iconColor: "text-gvi-gold" },
  { Icon: Users,       label: "Nhân sự",              count: "5 tài liệu", color: "border-purple-500/30 bg-purple-500/5",       iconColor: "text-purple-400" },
  { Icon: Monitor,     label: "CNTT & 10 Quy trình", count: "11 tài liệu", color: "border-emerald-500/30 bg-emerald-500/5",     iconColor: "text-emerald-400" },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function Section({ id, dark, altDark, noPad, children }: {
  id?: string; dark?: boolean; altDark?: boolean; noPad?: boolean; children: React.ReactNode;
}) {
  const bg = dark ? "bg-gvi-navy" : altDark ? "bg-gvi-deep" : "bg-white";
  return (
    <section id={id} className={`rounded-2xl section-mx section-my ${bg}`}
      style={noPad ? undefined : { paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}>
      <div className={`max-w-[1400px] mx-auto ${noPad ? "" : "section-px"}`}>{children}</div>
    </section>
  );
}

/* ─── Capital structure SVG donut ─────────────────────────────────────────── */
function CapitalDonut() {
  const size = 220;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = CAPITAL_STRUCTURE.map((s) => {
    const offset = circumference * (1 - cumulative / 100);
    const dash = (s.pct / 100) * circumference;
    cumulative += s.pct;
    return { ...s, offset, dash };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* SVG */}
      <div className="relative shrink-0">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0B1B2E" strokeWidth={32} />
          {slices.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={32}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={s.offset} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gvi-gold font-black text-xl leading-none">{CAPITAL_AMOUNT.short}</p>
          <p className="text-gvi-silver/60 text-[11px] font-mono mt-0.5">tỷ VNĐ</p>
          <p className="text-gvi-silver/40 text-[10px] mt-1">vốn điều lệ</p>
        </div>
      </div>
      {/* Legend */}
      <div className="space-y-3 flex-1 w-full">
        {CAPITAL_STRUCTURE.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-sm shrink-0 mt-1" style={{ background: s.color }} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-gvi-ivory text-sm font-semibold">{s.label}</p>
                <p className="text-gvi-silver/50 text-xs font-mono ml-2 shrink-0">{s.pct}%</p>
              </div>
              <p className="text-gvi-silver/50 text-xs leading-relaxed mt-0.5">{s.detail}</p>
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-gvi-gold/15">
          <p className="text-gvi-gold/60 text-[11px] font-mono">
            Căn cứ: Điều 8 Khoản 4 — NQ 05/2025/NQ-CP
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ accordion ───────────────────────────────────────────────────────── */
function FAQ_Section() {
  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {FAQ.map((item, i) => (
        <details key={i} className="group bg-gvi-navy border border-gvi-gold/10 rounded-xl overflow-hidden">
          <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none hover:bg-gvi-deep/50 transition-colors gap-4">
            <span className="font-semibold text-gvi-ivory text-sm leading-snug">{item.q}</span>
            <span className="text-gvi-gold/50 text-lg shrink-0 group-open:rotate-45 transition-transform duration-200 leading-none">+</span>
          </summary>
          <div className="px-5 pb-5 border-t border-gvi-gold/8">
            <p className="text-gvi-silver/75 text-sm leading-relaxed mt-4">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ShareholderPlansPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">

      {/* ── 0. HERO ── */}
      <PageHero
        tag="Hạng Mục Hợp Tác"
        heading={
          <>
            Xây Dựng Sàn{" "}
            <span className="font-bold text-gvi-gold bg-gradient-to-r from-gvi-gold to-gvi-champagne bg-clip-text [color:transparent]">
              TSMH Hợp Pháp Đầu Tiên
            </span>{" "}
            Tại Việt Nam
          </>
        }
        description="Hướng dẫn đầy đủ — định nghĩa pháp lý, cơ cấu cổ đông, vai trò của bạn, quyền & nghĩa vụ, và toàn bộ hồ sơ cần chuẩn bị — để tham gia dự án lịch sử theo Nghị quyết 05/2025/NQ-CP."
        dark
      >
        <div className="flex flex-col items-center gap-4">
          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gvi-gold/15 border border-gvi-gold/30 rounded-full text-gvi-gold text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-gvi-gold animate-pulse" />
              Từ 20/01/2026 — BTC tiếp nhận hồ sơ
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Chưa có đơn vị nào được cấp phép
            </div>
          </div>
          {/* Quick nav */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Sơ đồ tổng quan",  href: "#ecosystem" },
              { label: "4 câu hỏi cốt lõi", href: "#journey" },
              { label: "Dự án là gì?",     href: "#what" },
              { label: "Cơ cấu vốn",       href: "#capital" },
              { label: "Vai trò",           href: "#roles" },
              { label: "Hạng mục",          href: "#plans" },
              { label: "Hồ sơ cần có",     href: "#docs" },
              { label: "FAQ",               href: "#faq" },
              { label: "Điều lệ & Quyền",  href: "/documents" },
            ].map((nav) => (
              <a key={nav.href} href={nav.href}
                className="px-3 py-1.5 text-[11px] font-semibold text-gvi-silver/70 border border-gvi-silver/20 rounded-full hover:border-gvi-gold/50 hover:text-gvi-gold transition-all">
                {nav.label}
              </a>
            ))}
          </div>
        </div>
      </PageHero>

      {/* ── 0b. SƠ ĐỒ HỆ SINH THÁI ── */}
      <Section id="ecosystem" dark>
        <div className="text-center mb-10">
          <SectionHeader
            tag="Nhìn Toàn Bộ Dự Án"
            heading="Bạn Đang Bước Vào Hệ Sinh Thái Nào?"
            description="GVI Tech Holding ở trung tâm. Mỗi đối tác có một vai trò rõ ràng — góp gì, nhận gì, ở đâu trong sơ đồ."
            dark
          />
        </div>
        <ProjectEcosystem />
      </Section>

      {/* ── 0c. HÀNH TRÌNH ĐỐI TÁC ── */}
      <Section id="journey">
        <div className="text-center mb-10">
          <SectionHeader
            tag="4 Câu Hỏi Cốt Lõi"
            heading="Tôi Là Ai — Góp Gì — Ở Đâu — Nhận Gì?"
            description="Trả lời 4 câu hỏi này trước khi đọc bất kỳ điều khoản nào. Rõ ràng, trực quan, không vòng vo."
          />
        </div>
        <PartnerJourney />
      </Section>

      {/* ── 1. DỰ ÁN LÀ GÌ ── */}
      <Section id="what">
        <div className="text-center mb-10">
          <SectionHeader
            tag="Điều 3 — NQ 05/2025/NQ-CP"
            heading="Chúng Ta Đang Xây Dựng Gì?"
            description="Trước khi góp vốn, mỗi cổ đông cần hiểu rõ bản chất pháp lý của dự án theo định nghĩa chính thức của Chính phủ Việt Nam."
          />
        </div>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">

          {/* Định nghĩa pháp lý */}
          <div className="bg-gvi-navy border border-gvi-gold/20 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gvi-gold/15 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-gvi-gold" />
              </div>
              <div>
                <p className="font-bold text-gvi-gold text-sm uppercase tracking-wide">Tổ Chức Thị Trường Giao Dịch TSMH</p>
                <p className="text-gvi-silver/40 text-[11px] font-mono mt-0.5">Khoản 4 Điều 3, NQ 05/2025/NQ-CP</p>
              </div>
            </div>
            <p className="text-gvi-silver/60 text-xs italic border-l-2 border-gvi-gold/30 pl-3">
              &ldquo;Cung cấp nền tảng hoặc hệ thống hạ tầng để:&rdquo;
            </p>
            <ul className="space-y-2">
              {[
                "Trao đổi thông tin liên quan tài sản mã hóa",
                "Tập hợp lệnh mua, bán và giao dịch TSMH",
                "Thanh toán giao dịch tài sản mã hóa",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                  <span className="text-gvi-ivory text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gvi-gold/15 pt-4">
              <p className="text-gvi-silver/50 text-[11px] uppercase tracking-wider mb-3 font-semibold">4 dịch vụ được phép sau cấp phép (Điều 7)</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  [Landmark,      "Tổ chức thị trường giao dịch"],
                  [Lock,          "Lưu ký tài sản mã hóa"],
                  [BarChart3,     "Tự doanh tài sản mã hóa"],
                  [ClipboardList, "Phát hành, chào bán TSMH"],
                ] as const).map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-2 bg-gvi-deep rounded-lg p-2.5">
                    <Icon className="w-4 h-4 text-gvi-gold shrink-0" />
                    <span className="text-gvi-ivory text-[11px] font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quy định + cơ hội */}
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm mb-2">Quy định bắt buộc sau cấp phép (Điều 7)</p>
                  <ul className="space-y-2">
                    {[
                      "NĐT trong nước & nước ngoài được mở tài khoản mua/bán/lưu ký TSMH",
                      "Sau 6 tháng cấp phép: giao dịch ngoài hệ thống bị xử phạt hành chính hoặc truy cứu hình sự",
                      "Mọi giao dịch TSMH phải thông qua tổ chức được BTC cấp phép",
                    ].map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                        <span className="text-amber-800 text-xs leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gvi-navy border border-blue-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-300 shrink-0" />
                <p className="font-bold text-blue-300 text-sm">Tại sao đây là cơ hội lịch sử?</p>
              </div>
              <div className="space-y-2.5">
                {([
                  [BarChart3,  "~90 tỷ USD/năm giao dịch OTC không chính thức — đang chờ hợp pháp hóa"],
                  [ShieldCheck,"Chưa có đơn vị nào được cấp phép — first-mover thực sự"],
                  [Globe,      "Bắt kịp eCNY, e-HKD, Digital SGD — hội nhập kinh tế số khu vực"],
                  [Lock,       "Nhà nước kiểm soát minh bạch — chống thất thoát, rửa tiền"],
                ] as const).map(([Icon, text]) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-gvi-silver/70 text-xs leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. TIẾN ĐỘ DỰ ÁN ── */}
      <Section dark>
        <div className="text-center mb-10">
          <SectionHeader tag="Tiến Độ Dự Án" heading={`Chúng Ta Đang Ở Giai Đoạn ${CURRENT_PHASE}`} dark
            description="GVI Tech Holding đang tích lũy vốn và xây dựng liên minh đối tác. Đây là thời điểm tốt nhất để tham gia — trước khi hồ sơ được nộp." />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {PROJECT_TIMELINE.map((p) => {
            const StatusIcon =
              p.status === "done"   ? CheckCheck  :
              p.status === "active" ? CircleDot   : Clock;
            return (
              <div key={p.phase} className={`flex gap-4 p-4 rounded-xl border transition-all ${
                p.status === "done"   ? "bg-gvi-gold/8 border-gvi-gold/25" :
                p.status === "active" ? "bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/30" :
                "bg-gvi-deep/40 border-gvi-silver/10 opacity-60"
              }`}>
                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full border ${
                  p.status === "done"   ? "bg-gvi-gold/20 border-gvi-gold" :
                  p.status === "active" ? "bg-blue-500/20 border-blue-400" :
                  "bg-gvi-deep border-gvi-silver/20"
                }`}>
                  <StatusIcon className={`w-4 h-4 ${
                    p.status === "done"   ? "text-gvi-gold" :
                    p.status === "active" ? "text-blue-300" :
                    "text-gvi-silver/30"
                  }`} />
                </div>
                <div>
                  <p className={`font-mono text-[10px] tracking-widest mb-0.5 ${
                    p.status === "done"   ? "text-gvi-gold" :
                    p.status === "active" ? "text-blue-300" : "text-gvi-silver/30"
                  }`}>{p.date}</p>
                  <p className="font-semibold text-gvi-ivory text-sm">{p.label}</p>
                  <p className="text-gvi-silver/50 text-xs mt-0.5 leading-relaxed">{p.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 3. CƠ CẤU VỐN ── */}
      <Section id="capital">
        <div className="text-center mb-10">
          <SectionHeader
            tag="Điều 8, Khoản 4 — NQ 05/2025/NQ-CP"
            heading="Cơ Cấu Vốn Điều Lệ 10.000 Tỷ VNĐ"
            description="Không một ai góp một mình. Luật quy định cụ thể tỷ lệ từng nhóm — đây là lý do dự án cần nhiều cổ đông với vai trò khác nhau."
          />
        </div>
        <div className="max-w-3xl mx-auto bg-gvi-navy border border-gvi-gold/20 rounded-2xl p-6 md:p-8">
          <CapitalDonut />
        </div>
        <div className="mt-6 max-w-3xl mx-auto grid sm:grid-cols-3 gap-4 text-center">
          {[
            { Icon: Coins,    label: "Vốn điều lệ bắt buộc", value: "10.000 tỷ VNĐ", sub: "≈ 400 triệu USD",                                   color: "text-gvi-gold" },
            { Icon: Building2,label: "Tổ chức bắt buộc",     value: ">35% từ ≥2 tổ chức", sub: "Ngân hàng / CTCK / Quỹ / Bảo hiểm / Công nghệ", color: "text-blue-400" },
            { Icon: Globe,    label: "Giới hạn nước ngoài",  value: "Tối đa 49%",      sub: "Điều 8, Khoản 4 — bắt buộc tuyệt đối",            color: "text-purple-400" },
          ].map(({ Icon, label, value, sub, color }) => (
            <div key={label} className="p-5 bg-gvi-navy border border-gvi-gold/10 rounded-xl">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <p className="text-gvi-silver/50 text-[10px] uppercase tracking-widest mb-1">{label}</p>
              <p className={`font-black text-sm ${color}`}>{value}</p>
              <p className="text-gvi-silver/40 text-[11px] mt-1 leading-tight">{sub}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. VAI TRÒ CỔ ĐÔNG ── */}
      <Section id="roles" dark>
        <div className="text-center mb-10">
          <SectionHeader
            tag="Phân Vai Đối Tác"
            heading="Bạn Phù Hợp Với Vai Trò Nào?"
            description="6 vai trò đối tác — mỗi người có lợi thế khác nhau, đóng góp khác nhau. Chọn đúng vai trò, hiểu rõ quyền & nghĩa vụ, và biết chính xác hồ sơ cần chuẩn bị."
            dark
          />
        </div>
        <RoleSelector />
      </Section>

      {/* ── 5. CÁC HẠNG MỤC HỢP TÁC (từ DB) ── */}
      <Section id="plans">
        <div className="text-center mb-10">
          <SectionHeader
            tag="Phương Án Góp Vốn"
            heading="4 Nhóm Cổ Đông Theo Luật"
            description="Dưới đây là 4 nhóm cổ đông được phân loại trực tiếp từ Điều 8, Khoản 4 NQ 05/2025/NQ-CP. Bấm vào từng nhóm để xem đầy đủ quyền lợi, nghĩa vụ và hồ sơ."
          />
        </div>
        <InvestmentPlansClient />
        <div className="mt-8 max-w-3xl mx-auto p-4 bg-gvi-charcoal/5 border border-gvi-navy/15 rounded-xl">
          <p className="text-gvi-charcoal/50 text-[11px] leading-relaxed text-center">
            Đây là hạng mục góp vốn B2B xây dựng dự án —{" "}
            <strong className="text-gvi-charcoal/70">không phải sản phẩm đầu tư tài chính bán lẻ</strong>.
            Điều khoản cụ thể được thương lượng trực tiếp và ký kết theo Luật Doanh nghiệp + NQ 05/2025/NQ-CP.
          </p>
        </div>
      </Section>

      {/* ── 6. HỒ SƠ CẤP PHÉP ĐẦY ĐỦ ── */}
      <Section id="docs" altDark>
        <div className="text-center mb-10">
          <SectionHeader
            tag="Điều 9 — NQ 05/2025/NQ-CP"
            heading="Toàn Bộ Hồ Sơ Cần Nộp Bộ Tài Chính"
            description="Mỗi vai trò cần chuẩn bị một số tài liệu khác nhau. Danh sách dưới đây là toàn bộ hồ sơ theo nhóm — được tổ chức để đối tác dễ theo dõi tiến độ."
            dark
          />
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DOC_SUMMARY.map(({ Icon, label, count, color, iconColor }) => (
              <div key={label} className={`p-5 rounded-xl border ${color} flex flex-col items-center text-center gap-2`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
                <p className="text-gvi-ivory font-semibold text-xs leading-snug">{label}</p>
                <p className="text-gvi-silver/50 text-[11px]">{count}</p>
              </div>
            ))}
          </div>
          <p className="text-gvi-silver/50 text-xs text-center">
            Chi tiết từng tài liệu theo vai trò → xem phần{" "}
            <a href="#roles" className="text-gvi-gold underline hover:text-gvi-champagne">Phân Vai Đối Tác</a>
            {" "}ở trên · Tab &ldquo;Hồ Sơ Cần Có&rdquo; trong từng vai trò
          </p>
        </div>
      </Section>

      {/* ── 7. ĐIỀU KIỆN CẤP PHÉP ── */}
      <Section dark>
        <div className="text-center mb-10">
          <SectionHeader tag="Điều 8 — NQ 05/2025/NQ-CP" heading="8 Điều Kiện Để Được Cấp Phép"
            description="Đây là những gì dự án phải đáp ứng trước khi nộp hồ sơ. Mỗi cổ đông đóng góp vào một hoặc nhiều điều kiện." dark />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {LICENSING_CONDITIONS.map(({ n, Icon, label, detail, source }) => (
            <div key={n} className="p-5 bg-gvi-deep border border-gvi-gold/10 hover:border-gvi-gold/30 transition-all rounded-xl group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gvi-gold/30 font-mono font-black text-xl group-hover:text-gvi-gold/50 transition-colors">{n}</span>
                <div className="w-8 h-8 rounded-lg bg-gvi-navy flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gvi-gold/60 group-hover:text-gvi-gold transition-colors" />
                </div>
              </div>
              <p className="font-semibold text-gvi-ivory text-sm mb-1.5">{label}</p>
              <p className="text-gvi-silver/55 text-xs leading-relaxed">{detail}</p>
              <p className="text-gvi-gold/30 text-[10px] font-mono mt-3">{source}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6 text-gvi-silver/30 text-[11px] font-mono">
          Điều 8, NQ 05/2025/NQ-CP ngày 09/09/2025 · QĐ 96/QĐ-BTC ngày 20/01/2026
        </p>
      </Section>

      {/* ── 8. FAQ ── */}
      <Section id="faq">
        <div className="text-center mb-10">
          <SectionHeader
            tag="Câu Hỏi Thường Gặp"
            heading="Giải Đáp Trực Tiếp Cho Đối Tác"
            description="Những câu hỏi phổ biến nhất từ các đối tác tiềm năng — được trả lời thẳng thắn, không vòng vo."
          />
        </div>
        <FAQ_Section />
      </Section>

      {/* ── 9. RỦI RO — đồng bộ với trang chính ── */}
      <Section altDark>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            tag="Sự Thật Về Rủi Ro"
            heading="Đây Là Đầu Tư Dài Hạn, Không Phải Sản Phẩm Tài Chính"
            description="Thị trường tài sản mã hóa hợp pháp tại Việt Nam vẫn đang trong giai đoạn hình thành. Không ai có thể đảm bảo kết quả. Chúng tôi cam kết minh bạch — không phải cam kết lợi nhuận."
            dark
          />
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/investment-disclaimer"
              className="inline-flex items-center gap-2 text-gvi-gold/60 hover:text-gvi-gold text-xs font-semibold tracking-wide transition-colors">
              Tuyên Bố Miễn Trừ Trách Nhiệm <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/documents"
              className="inline-flex items-center gap-2 text-gvi-silver/40 hover:text-gvi-silver text-xs font-semibold tracking-wide transition-colors">
              Quyền & Nghĩa Vụ Hợp Tác <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ── 10. CTA ── */}
      <Section dark>
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeader
            tag="Bước Tiếp Theo"
            heading="Bạn Đã Thấy Lộ Trình. Điều Gì Tiếp Theo?"
            description="Nếu bạn thấy cơ hội ở đây — không phải vì được thuyết phục, mà vì bạn thực sự hiểu và chia sẻ lý tưởng — chúng tôi muốn nghe từ bạn. Không cần chuẩn bị gì phức tạp."
            dark
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/invest-with-gvi#connect"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gvi-gold to-gvi-champagne text-gvi-navy font-bold text-xs tracking-[0.18em] uppercase hover:opacity-90 transition-opacity shadow-lg shadow-gvi-gold/20 rounded-sm">
              Kết Nối Với Chúng Tôi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gvi-gold/35 text-gvi-gold font-semibold text-xs tracking-[0.18em] uppercase hover:bg-gvi-gold/8 transition-all rounded-sm">
              Đặt Câu Hỏi Trực Tiếp
            </Link>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
            {[
              { Icon: Lock,     label: "Bảo mật tuyệt đối",  sub: "Mọi thông tin được bảo mật hoàn toàn" },
              { Icon: Zap,      label: "Phản hồi 2–3 ngày",  sub: "Đội ngũ phản hồi trực tiếp, không qua bot" },
              { Icon: FileText, label: "Không áp lực",        sub: "Bước kết nối đầu tiên không có nghĩa vụ gì" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="p-5 bg-gvi-deep border border-gvi-gold/10 rounded-xl">
                <Icon className="w-5 h-5 mx-auto mb-2 text-gvi-gold/60" />
                <p className="text-gvi-ivory font-semibold text-xs">{label}</p>
                <p className="text-gvi-silver/45 text-[11px] mt-1 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gvi-silver/30 text-[11px] font-mono">
            Căn cứ: NQ 05/2025/NQ-CP · QĐ 96/QĐ-BTC ngày 20/01/2026 · Luật Doanh nghiệp · Luật Đầu tư
          </p>
        </div>
      </Section>

    </main>
  );
}
