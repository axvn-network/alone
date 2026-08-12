import InvestorForm from "@/components/public/InvestorForm";
import { CheckCircle, ArrowRight, CheckCheck, Clock } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/public/SectionHeader";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đồng Hành Xây Dựng",
  description:
    "GVI Tech Holding đang xây dựng nền tảng giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam theo NQ 05/2025/NQ-CP. Đây là hành trình — không phải lời mời gọi đầu tư.",
  openGraph: {
    title: "Đồng Hành Xây Dựng | GVI Tech Holding",
    description:
      "Chúng tôi đang xây dựng một thứ có ý nghĩa. Nếu bạn thấy tiềm năng và chia sẻ lý tưởng, chúng tôi muốn nghe từ bạn.",
  },
};

/* ─── Lộ trình dự án — hiển thị nổi bật, minh bạch hoàn toàn ─────────────── */
const PROJECT_TIMELINE = [
  {
    phase: "01",
    label: "Khung Pháp Lý Ban Hành",
    detail: "NQ 05/2025/NQ-CP: Chính phủ chính thức mở thị trường tài sản mã hóa hợp pháp đầu tiên tại Việt Nam",
    status: "done" as const,
    date: "09/09/2025",
  },
  {
    phase: "02",
    label: "Bộ Tài Chính Mở Cổng Tiếp Nhận Hồ Sơ",
    detail: "QĐ 96/QĐ-BTC — điều kiện cấp phép chính thức, bắt đầu tiếp nhận hồ sơ xin cấp phép",
    status: "done" as const,
    date: "20/01/2026",
  },
  {
    phase: "03",
    label: "Xây Dựng Liên Minh Đối Tác",
    detail: "GVI Tech Holding đang kiến tạo hệ thống cổ đông chiến lược, tích lũy vốn, hoàn thiện đội ngũ và cơ cấu quản trị",
    status: "active" as const,
    date: "Hiện tại",
  },
  {
    phase: "04",
    label: "Xây Dựng Hạ Tầng Kỹ Thuật",
    detail: "Hệ thống CNTT cấp độ 4, 10 quy trình nghiệp vụ chuẩn hóa, thẩm định Bộ Công An",
    status: "pending" as const,
    date: "2026",
  },
  {
    phase: "05",
    label: "Nộp Hồ Sơ Cấp Phép",
    detail: "Một bộ hồ sơ đầy đủ đúng quy định lên Bộ Tài chính — minh bạch và tuân thủ tuyệt đối",
    status: "pending" as const,
    date: "2026",
  },
  {
    phase: "06",
    label: "Nhận Giấy Phép & Vận Hành Chính Thức",
    detail: "30 ngày thẩm định → hoạt động ngay. Trở thành sàn giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam",
    status: "pending" as const,
    date: "2026–2027",
  },
];

/* ─── Những gì đang được xây dựng — cụ thể, đo lường được ────────────────── */
const WHAT_WE_ARE_BUILDING = [
  {
    label: "Nền Tảng Giao Dịch TSMH Được Cấp Phép",
    desc: "Sàn giao dịch tài sản mã hóa đầu tiên được Bộ Tài chính Việt Nam cấp phép chính thức theo NQ 05/2025/NQ-CP — không phải thêm một sàn ngoài vòng pháp lý.",
  },
  {
    label: "Hệ Sinh Thái Đối Tác Chiến Lược",
    desc: "Liên minh gồm tổ chức tài chính, doanh nghiệp công nghệ, nhà đầu tư tổ chức — mỗi bên mang đến năng lực thiết yếu mà không một đơn vị đơn lẻ nào có thể tự đáp ứng.",
  },
  {
    label: "Hạ Tầng CNTT Cấp Độ 4",
    desc: "Tiêu chuẩn an toàn thông tin cao nhất, thẩm định bởi Bộ Công An — nền tảng vận hành đáp ứng đầy đủ 10 quy trình nghiệp vụ bắt buộc theo quy định.",
  },
  {
    label: "Đội Ngũ Chuyên Gia Đủ Tiêu Chuẩn Pháp Lý",
    desc: "Tổng giám đốc ≥2 năm kinh nghiệm tài chính/chứng khoán, CTO ≥5 năm CNTT chuyên ngành, ≥10 chuyên gia an toàn thông tin, ≥10 người hành nghề chứng khoán.",
  },
  {
    label: "Quản Trị Minh Bạch & Tuân Thủ Pháp Luật",
    desc: "Điều lệ công ty, quy chế nội bộ, báo cáo định kỳ — mọi cổ đông có quyền tiếp cận thông tin đầy đủ, được bảo vệ theo Luật Doanh nghiệp.",
  },
  {
    label: "Thị Trường 100 Triệu Người — Chưa Ai Tiên Phong",
    desc: "Tính đến ngày hôm nay, chưa có đơn vị nào được cấp phép tại Việt Nam. Cửa sổ cơ hội 5 năm đang mở — ai xây dựng đúng và nhanh sẽ định hình toàn bộ thị trường.",
  },
];

/* ─── Ai chúng tôi tìm kiếm — không phải "nhà đầu tư góp vốn" ────────────── */
const WHO_WE_SEEK = [
  {
    title: "Tổ Chức Tài Chính & Công Nghệ",
    desc: "Ngân hàng, công ty chứng khoán, quản lý quỹ, doanh nghiệp công nghệ — những tổ chức đủ điều kiện pháp lý theo Khoản 4, Điều 8 và sẵn sàng đặt uy tín vào một dự án có tầm.",
    min: "Tổ chức trong nhóm >35% bắt buộc",
  },
  {
    title: "Chuyên Gia Công Nghệ & Pháp Lý",
    desc: "Người có kiến thức sâu về blockchain, bảo mật thông tin, pháp lý tài chính — những người muốn đóng góp năng lực, không chỉ tiền bạc.",
    min: "Năng lực > vốn",
  },
  {
    title: "Nhà Đầu Tư Có Lý Tưởng Dài Hạn",
    desc: "Người hiểu rằng thị trường tài sản mã hóa hợp pháp Việt Nam sẽ định hình lại tài chính số trong 10 năm tới — và muốn là một phần của lịch sử đó.",
    min: "Từ 100 triệu VNĐ",
  },
  {
    title: "Đối Tác Chiến Lược Quốc Tế",
    desc: "Tổ chức nước ngoài hiểu thị trường Đông Nam Á, có quan hệ quốc tế và muốn thiết lập vị thế sớm trong một trong những thị trường tài sản số đang nổi nhanh nhất.",
    min: "Giới hạn ≤49% tổng vốn",
  },
];

/* ─── Các điều cam kết — không phải lời hứa hẹn lợi nhuận ───────────────── */
const OUR_COMMITMENTS = [
  "Minh bạch hoàn toàn về tiến độ thực tế — không tô vẽ, không phóng đại",
  "Quyết định quan trọng được đưa ra với sự tham gia của đại hội đồng cổ đông",
  "Bảo vệ quyền lợi cổ đông theo đúng Luật Doanh nghiệp Việt Nam",
  "Cập nhật định kỳ về tiến độ xây dựng hồ sơ cấp phép",
  "Không có cam kết lợi nhuận cụ thể — đây là đầu tư dài hạn, không phải sản phẩm tài chính",
  "Nếu dự án không đạt được cấp phép, cổ đông được bảo vệ theo đúng quy định pháp luật",
];

function Section({
  id,
  dark,
  altDark,
  children,
}: {
  id?: string;
  dark?: boolean;
  altDark?: boolean;
  children: React.ReactNode;
}) {
  const bg = dark ? "bg-gvi-navy" : altDark ? "bg-gvi-deep" : "bg-white";
  return (
    <section
      id={id}
      className={`rounded-2xl section-mx section-my ${bg}`}
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="max-w-[1400px] mx-auto section-px">{children}</div>
    </section>
  );
}

const STATUS_STYLE = {
  done:    { dot: "bg-emerald-400", bar: "bg-emerald-400", label: "Hoàn thành", text: "text-emerald-400" },
  active:  { dot: "bg-gvi-gold animate-pulse", bar: "bg-gvi-gold", label: "Đang thực hiện", text: "text-gvi-gold" },
  pending: { dot: "bg-gvi-silver/20", bar: "bg-gvi-silver/10", label: "Sắp tới", text: "text-gvi-silver/40" },
};

export default function InvestWithFortressPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">

      {/* ── Hero — tầm nhìn, không phải lời mời gọi ── */}
      <PageHero
        tag="Đồng Hành Xây Dựng"
        heading={
          <>
            Chúng Tôi Đang Xây Dựng{" "}
            <span className="font-bold bg-gradient-to-r from-gvi-gold to-gvi-champagne bg-clip-text text-transparent">
              Một Thứ Có Ý Nghĩa.
            </span>
          </>
        }
        description="GVI Tech Holding đang kiến tạo nền tảng giao dịch tài sản mã hóa hợp pháp đầu tiên của Việt Nam theo NQ 05/2025/NQ-CP. Đây là hành trình dài hạn — chúng tôi không tìm người góp vốn, chúng tôi tìm người đồng hành vì cùng nhìn thấy điều tương tự."
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="#roadmap"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-gvi-gold to-gvi-champagne text-gvi-navy font-bold text-xs tracking-[0.18em] uppercase hover:opacity-90 transition-opacity shadow-lg shadow-gvi-gold/15"
          >
            Xem Lộ Trình Thực Tế
          </Link>
          <Link
            href="/invest-with-gvi/plans"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gvi-gold/60 text-gvi-navy font-semibold text-xs tracking-[0.18em] uppercase hover:bg-gvi-gold/8 hover:border-gvi-gold transition-all"
          >
            Vai Trò Có Thể Tham Gia
          </Link>
          <Link
            href="#connect"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gvi-navy/30 text-gvi-navy font-semibold text-xs tracking-[0.18em] uppercase hover:bg-gvi-navy/5 transition-all"
          >
            Kết Nối Với Chúng Tôi
          </Link>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gvi-gold/10 border border-gvi-gold/25 rounded-full text-gvi-gold text-[11px] font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-gvi-gold animate-pulse" />
          Giai đoạn 03/06 — Đang xây dựng liên minh đối tác
        </div>
      </PageHero>

      {/* ── Lộ trình — minh bạch, cụ thể, không ẩn giấu ── */}
      <Section dark id="roadmap">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Lộ Trình Thực Tế"
            heading="Chúng Tôi Đang Ở Đây. Đây Là Hành Trình."
            description="Không có vẽ bánh, không hứa hẹn mơ hồ. Đây là 6 giai đoạn cụ thể, với tiến độ thực tế và ngày tháng rõ ràng — để bạn tự đánh giá."
            dark
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline connector line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-400/40 via-gvi-gold/40 to-gvi-silver/10 hidden sm:block" />
          <div className="space-y-4">
            {PROJECT_TIMELINE.map((item, i) => {
              const s = STATUS_STYLE[item.status];
              return (
                <div key={i} className="relative flex items-start gap-5 sm:gap-7">
                  {/* Status dot */}
                  <div className="relative z-10 flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full border-2 border-gvi-navy ${s.dot}`} />
                  </div>
                  {/* Content */}
                  <div className={`flex-1 p-5 rounded-xl border transition-all ${
                    item.status === "active"
                      ? "bg-gvi-deep border-gvi-gold/30 shadow-lg shadow-gvi-gold/5"
                      : item.status === "done"
                      ? "bg-gvi-deep border-emerald-400/15"
                      : "bg-gvi-deep/40 border-gvi-silver/8"
                  }`}>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-gvi-silver/30 text-[10px] font-mono font-bold tracking-widest shrink-0">
                          GIAI ĐOẠN {item.phase}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          item.status === "done"    ? "bg-emerald-400/10 text-emerald-400" :
                          item.status === "active"  ? "bg-gvi-gold/10 text-gvi-gold" :
                          "bg-gvi-silver/5 text-gvi-silver/30"
                        }`}>
                          {s.label}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono shrink-0 ${s.text}`}>{item.date}</span>
                    </div>
                    <h3 className={`font-semibold text-sm mb-1.5 ${
                      item.status === "pending" ? "text-gvi-ivory/40" : "text-gvi-ivory"
                    }`}>{item.label}</h3>
                    <p className={`text-xs leading-relaxed ${
                      item.status === "pending" ? "text-gvi-silver/30" : "text-gvi-silver/65"
                    }`}>{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Current position callout */}
          <div className="mt-8 p-5 bg-gvi-gold/8 border border-gvi-gold/25 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-gvi-gold animate-pulse" />
              <p className="text-gvi-gold font-bold text-sm">GVI Tech Holding hiện đang ở Giai đoạn 03</p>
            </div>
            <p className="text-gvi-silver/70 text-xs leading-relaxed">
              Đây là thời điểm tốt nhất để tham gia — trước khi hồ sơ được nộp, trước khi cơ cấu cổ đông khóa lại. 
              Định giá thấp nhất, tiếng nói cao nhất, tầm ảnh hưởng thực sự nhất.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Những gì đang được xây dựng — cụ thể, đo lường được ── */}
      <Section id="building">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Chúng Tôi Đang Xây Gì"
            heading="Không Phải Lời Hứa — Là Công Trình Đang Được Xây."
            description="Mỗi hạng mục bên dưới là yêu cầu bắt buộc theo NQ 05/2025/NQ-CP để được cấp phép. Không có gì mơ hồ hay phóng đại — đây là những gì phải có."
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {WHAT_WE_ARE_BUILDING.map((item, i) => (
            <div
              key={i}
              className="group p-6 bg-gvi-navy border border-gvi-gold/10 hover:border-gvi-gold/30 hover:-translate-y-0.5 transition-all duration-300 rounded-sm"
            >
              <div className="w-px h-4 bg-gvi-gold/40 mb-4 group-hover:bg-gvi-gold/70 transition-colors" />
              <p className="font-semibold text-gvi-ivory text-sm mb-1.5">{item.label}</p>
              <p className="text-gvi-silver/65 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/invest-with-gvi/plans"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gvi-navy/25 text-gvi-charcoal text-xs font-semibold tracking-[0.15em] uppercase hover:bg-gvi-navy hover:text-gvi-ivory hover:border-gvi-navy transition-all duration-300 rounded-sm"
          >
            Xem Toàn Bộ Điều Kiện Pháp Lý
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Section>

      {/* ── Ai chúng tôi tìm kiếm ── */}
      <Section altDark id="who">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Chúng Tôi Tìm Ai"
            heading="Không Phải Người Góp Vốn — Là Người Đồng Hành."
            description="Chúng tôi không tìm người đưa tiền rồi chờ kết quả. Chúng tôi tìm người nhìn thấy cùng một cơ hội, hiểu rõ rủi ro, và muốn là một phần của hành trình xây dựng."
            dark
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {WHO_WE_SEEK.map((item, i) => (
            <div
              key={i}
              className="group p-6 md:p-7 bg-gvi-navy border border-gvi-gold/15 hover:border-gvi-gold/35 hover:-translate-y-0.5 transition-all duration-300 rounded-sm"
            >
              <p className="font-semibold text-gvi-ivory text-sm mb-2">{item.title}</p>
              <p className="text-gvi-silver/65 leading-relaxed text-xs mb-4">{item.desc}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gvi-gold/8 border border-gvi-gold/20 rounded-full">
                <span className="w-1 h-1 rounded-full bg-gvi-gold" />
                <span className="text-gvi-gold text-[10px] font-semibold">{item.min}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Cam kết của chúng tôi — không phải lời hứa lợi nhuận ── */}
      <Section id="commitments">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <SectionHeader
              tag="Cam Kết Của Chúng Tôi"
              heading="Minh Bạch Tuyệt Đối. Không Tô Vẽ. Không Phóng Đại."
              description="Đây không phải là những gì chúng tôi hứa hẹn để thuyết phục bạn. Đây là những gì chúng tôi cam kết thực hiện — bất kể kết quả như thế nào."
              align="left"
            />
          </div>
          <div className="bg-gvi-navy rounded-2xl p-7 md:p-10">
            <p className="section-tag mb-5">GVI Tech Holding Cam Kết Với Mọi Đối Tác</p>
            <ul className="space-y-3">
              {OUR_COMMITMENTS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                  <span className="text-gvi-silver/75 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-gvi-gold/10">
              <p className="text-gvi-silver/40 text-xs leading-relaxed italic">
                &ldquo;Nếu bạn cần được thuyết phục, đây có thể chưa phải thời điểm phù hợp.
                Nếu bạn đã nhìn thấy cơ hội này — chúng tôi muốn nói chuyện.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Form kết nối — không phải "gửi đề xuất đầu tư" ── */}
      <Section dark id="connect">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-14">
          <div className="lg:col-span-2">
            <SectionHeader
              tag="Kết Nối Với Chúng Tôi"
              heading="Nếu Bạn Thấy Điều Tương Tự"
              description="Chia sẻ với chúng tôi bạn là ai, bạn nhìn thấy gì trong cơ hội này, và bạn muốn đóng góp điều gì. Không có mẫu câu nào đúng hay sai — chúng tôi chỉ muốn nghe từ người thật."
              align="left"
              dark
            />
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCheck className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                <span className="text-gvi-silver/70 text-sm">Mọi thông tin được bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCheck className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                <span className="text-gvi-silver/70 text-sm">Phản hồi trực tiếp trong 2–3 ngày làm việc</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCheck className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                <span className="text-gvi-silver/70 text-sm">Không có ràng buộc hay nghĩa vụ ở bước này</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gvi-gold shrink-0 mt-0.5" />
                <span className="text-gvi-silver/70 text-sm">Chúng tôi không rush bạn — quyết định đúng cần thời gian</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-gvi-deep border border-gvi-gold/15 p-7 md:p-10 rounded-2xl">
              <InvestorForm />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Tuyên bố rõ ràng về rủi ro ── */}
      <Section altDark>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            tag="Sự Thật Về Rủi Ro"
            heading="Đây Là Đầu Tư Dài Hạn, Không Phải Sản Phẩm Tài Chính"
            description="Thị trường tài sản mã hóa hợp pháp tại Việt Nam vẫn đang trong giai đoạn hình thành. Không ai có thể đảm bảo kết quả. Chúng tôi cam kết minh bạch — không phải cam kết lợi nhuận. Nếu bạn chấp nhận sự không chắc chắn đó và vẫn thấy cơ hội — chúng tôi cùng chí hướng."
            dark
          />
          <div className="mt-6">
            <Link
              href="/investment-disclaimer"
              className="inline-flex items-center gap-2 text-gvi-gold/60 hover:text-gvi-gold text-xs font-semibold tracking-wide transition-colors"
            >
              Đọc Đầy Đủ Tuyên Bố Miễn Trừ Trách Nhiệm
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
