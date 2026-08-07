import InvestorForm from "@/components/InvestorForm";
import { CheckCircle, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hợp Tác Đầu Tư",
  description:
    "Hợp tác đầu tư cùng Fortress Investment Holdings. Phân bổ vốn kỷ luật vào FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số tại Việt Nam — bám sát Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025.",
  openGraph: {
    title: "Hợp Tác Đầu Tư | Fortress Investment Holdings",
    description:
      "Nguồn vốn của bạn xứng đáng được quản trị bằng kỷ luật, am hiểu pháp lý và định vị đúng trong hệ sinh thái tài sản mã hóa hợp pháp Việt Nam.",
  },
};

const investmentBenefits = [
  {
    label: "Tiên Phong Tài Sản Mã Hóa Hợp Pháp",
    desc: "Đầu tư vào hệ sinh thái tài sản mã hóa hợp pháp đầu tiên của Việt Nam — theo Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025, cửa sổ 5 năm đang mở.",
  },
  {
    label: "Thẩm Định Pháp Lý Nghiêm Ngặt",
    desc: "Mọi cơ hội đều trải qua đánh giá toàn diện: tài chính, tuân thủ pháp lý, quản trị rủi ro và năng lực thực thi — trước khi giải ngân.",
  },
  {
    label: "Phân Bổ Vốn Chiến Lược",
    desc: "Cấu trúc đầu tư được thiết kế tối ưu theo mục tiêu, khẩu vị rủi ro, lộ trình tuân thủ và kỳ vọng lợi suất của bạn.",
  },
  {
    label: "Quản Trị Đầu Tư Chủ Động",
    desc: "Fortress đồng hành xuyên suốt vòng đời đầu tư — từ thẩm định pháp lý ban đầu đến giám sát vận hành và báo cáo minh bạch.",
  },
  {
    label: "Quản Lý Rủi Ro Kỷ Luật",
    desc: "Mọi quyết định được neo chặt trong phân tích rủi ro thực tế, tuân thủ quy định hiện hành và kiểm soát danh mục chặt chẽ.",
  },
  {
    label: "Kiến Tạo Giá Trị Bền Vững",
    desc: "Tập trung vào lợi suất dài hạn có thể đo lường được — không đầu cơ, không hứa hẹn phi thực tế, không chạy theo xu hướng nhất thời.",
  },
];

const sectors = [
  "Dịch Vụ Tài Sản Mã Hóa (Có Cấp Phép)",
  "FinTech & Thanh Toán Số",
  "Công Nghệ AI & Ứng Dụng",
  "Công Nghệ Giáo Dục (EdTech)",
  "Hạ Tầng Blockchain",
  "Kinh Tế Số & Thương Mại Điện Tử",
  "Private Equity & Vốn Tăng Trưởng",
  "Mã Hóa Tài Sản (Tokenisation)",
  "Quản Lý Đầu Tư Chiến Lược",
];

const modelSteps = [
  {
    n: "01",
    title: "Hiểu Rõ Mục Tiêu",
    body: "Xác định ưu tiên, quy mô vốn, lĩnh vực quan tâm, thời hạn và khẩu vị rủi ro. Không có cam kết nào được thực hiện trước khi Fortress thực sự hiểu bạn.",
  },
  {
    n: "02",
    title: "Chiến Lược Đầu Tư",
    body: "Chuyển hóa mục tiêu thành chiến lược rõ ràng — phù hợp khung pháp lý tài sản mã hóa Việt Nam, nhất quán và được thống nhất giữa hai bên.",
  },
  {
    n: "03",
    title: "Tìm Kiếm Cơ Hội",
    body: "Sàng lọc startup FinTech, doanh nghiệp tài sản mã hóa và dự án kinh tế số qua mạng lưới uy tín — chỉ theo đuổi cơ hội đạt tiêu chuẩn nghiêm ngặt.",
  },
  {
    n: "04",
    title: "Thẩm Định Chuyên Sâu",
    body: "Đánh giá chi tiết: tài chính, rủi ro, tuân thủ pháp lý NQ5/2025, năng lực đội ngũ và khả năng thực thi — trước khi bất kỳ đồng vốn nào được giải ngân.",
  },
  {
    n: "05",
    title: "Cấu Trúc & Giải Ngân",
    body: "Khoản đầu tư được cấu trúc tối ưu: bảo vệ vị thế, đảm bảo tuân thủ, liên kết lợi ích các bên — giải ngân vào cơ hội đã phê duyệt chính thức.",
  },
  {
    n: "06",
    title: "Quản Lý & Báo Cáo",
    body: "Giám sát liên tục, minh bạch hoàn toàn về hiệu quả, chủ động ứng phó với biến động thị trường — luôn hướng đến tăng trưởng bền vững dài hạn.",
  },
];

const activeSupport = [
  "Định Hướng Chiến Lược",
  "Hỗ Trợ Quản Trị Doanh Nghiệp",
  "Phát Triển Thương Mại & Mở Rộng",
  "Giám Sát Vận Hành",
  "Kết Nối Thị Trường Quốc Tế",
  "Báo Cáo Hiệu Quả Đầu Tư",
];

const guarantees = [
  "Bảo mật tuyệt đối mọi thông tin bạn cung cấp",
  "Thẩm định trực tiếp bởi đội ngũ chuyên gia Fortress",
  "Không phát sinh nghĩa vụ ràng buộc ở bước tư vấn ban đầu",
  "Phản hồi cá nhân hóa trong 2–3 ngày làm việc",
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
  const bg = dark ? "bg-fortress-navy" : altDark ? "bg-fortress-deep" : "bg-white";
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

export default function InvestWithFortressPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      {/* ── Hero ── */}
      <PageHero
        tag="Hợp Tác Đầu Tư"
        heading={
          <>
            Nguồn Vốn Xứng Đáng Được{" "}
            <span className="font-bold bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
              Quản Trị Kỷ Luật.
            </span>
          </>
        }
        description="Fortress Investment Holdings đồng hành phân bổ vốn vào FinTech, tài sản mã hóa hợp pháp và kinh tế số tại Việt Nam — tiên phong đón đầu Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025."
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="#enquiry"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-xs tracking-[0.18em] uppercase hover:opacity-90 transition-opacity shadow-lg shadow-fortress-gold/15"
          >
            Gửi Đề Xuất Đầu Tư
          </Link>
          <Link
            href="/invest-with-fortress/plans"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-fortress-gold/60 text-fortress-navy font-semibold text-xs tracking-[0.18em] uppercase hover:bg-fortress-gold/8 hover:border-fortress-gold transition-all"
          >
            Xem Hạng Mục Hợp Tác
          </Link>
          <Link
            href="#sectors"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-fortress-navy/30 text-fortress-navy font-semibold text-xs tracking-[0.18em] uppercase hover:bg-fortress-navy/5 transition-all"
          >
            Khám Phá Lĩnh Vực
          </Link>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-fortress-gold/10 border border-fortress-gold/25 rounded-full text-fortress-gold text-[11px] font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-fortress-gold animate-pulse" />
          Từ 20/01/2026 — Bộ Tài chính chính thức tiếp nhận hồ sơ cấp phép
        </div>
      </PageHero>

      {/* ── Lợi ích đầu tư ── */}
      <Section dark id="invest">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Tại Sao Chọn Fortress"
            heading="Vốn Của Bạn. Kỷ Luật Của Chúng Tôi."
            description="Nguồn vốn chỉ được giải ngân sau khi Fortress thấu hiểu rõ mục tiêu, khẩu vị rủi ro, yêu cầu tuân thủ và kỳ vọng của bạn — từ đó xây dựng chiến lược tối ưu nhất."
            dark
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {investmentBenefits.map((item, i) => (
            <div
              key={i}
              className="group p-6 bg-fortress-deep border border-fortress-gold/10 hover:border-fortress-gold/30 hover:-translate-y-0.5 transition-all duration-300 rounded-sm"
            >
              <div className="w-px h-4 bg-fortress-gold/40 mb-4 group-hover:bg-fortress-gold/70 transition-colors" />
              <p className="font-semibold text-fortress-ivory text-sm mb-1.5">{item.label}</p>
              <p className="text-fortress-silver/65 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Lĩnh vực đầu tư ── */}
      <Section id="sectors">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Lĩnh Vực Đầu Tư Trọng Tâm"
            heading="Một Mối Quan Hệ. Tiếp Cận Toàn Bộ Hệ Sinh Thái Tài Sản Số."
            description="Thông qua Fortress, bạn tiếp cận 9 lĩnh vực đầu tư trọng tâm trong hệ sinh thái FinTech, tài sản mã hóa hợp pháp và kinh tế số Việt Nam."
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {sectors.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 md:p-5 bg-fortress-navy border border-fortress-gold/10 hover:border-fortress-gold/25 transition-all duration-300 rounded-sm"
            >
              <span className="text-fortress-gold/40 text-xs font-mono font-bold tracking-widest shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-medium text-fortress-silver text-sm">{item}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/investment-focus"
            className="inline-flex items-center gap-2 px-6 py-3 border border-fortress-navy/25 text-fortress-charcoal text-xs font-semibold tracking-[0.15em] uppercase hover:bg-fortress-navy hover:text-fortress-ivory hover:border-fortress-navy transition-all duration-300 rounded-sm"
          >
            Xem Chi Tiết Từng Lĩnh Vực
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Section>

      {/* ── Mô hình đầu tư ── */}
      <Section altDark id="model">
        <div className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Quy Trình Đầu Tư"
            heading="Hành Trình Kỷ Luật Từ Cam Kết Đến Giá Trị"
            description="Đầu tư thành công dựa trên quy trình chặt chẽ. Mọi quyết định tại Fortress đều trải qua 6 giai đoạn thẩm định và quản trị rủi ro nghiêm ngặt."
            dark
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {modelSteps.map((step) => (
            <div
              key={step.n}
              className="group p-6 md:p-7 bg-fortress-navy border border-fortress-gold/15 hover:border-fortress-gold/35 hover:-translate-y-0.5 transition-all duration-300 rounded-sm"
            >
              <span className="text-fortress-gold/35 font-mono font-black text-3xl md:text-4xl block mb-4 leading-none group-hover:text-fortress-gold/55 transition-colors">
                {step.n}
              </span>
              <h3 className="font-semibold text-fortress-ivory text-sm mb-2">{step.title}</h3>
              <p className="text-fortress-silver/65 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Quản trị chủ động ── */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <SectionHeader
              tag="Đồng Hành Tích Cực"
              heading="Chúng Tôi Không Chỉ Giải Ngân — Chúng Tôi Đồng Hành Trực Tiếp."
              description="Khác với các đơn vị chỉ phân bổ vốn rồi đứng ngoài, Fortress trực tiếp tham gia hỗ trợ chiến lược, quản trị doanh nghiệp và mở rộng quy mô cùng bạn."
              align="left"
            />
          </div>
          <div className="bg-fortress-navy rounded-2xl p-7 md:p-10">
            <p className="section-tag mb-4">Fortress Gia Tăng Giá Trị Như Thế Nào</p>
            <h3
              className="font-semibold text-fortress-ivory mb-7 leading-snug"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Đồng Hành Xuyên Suốt Vòng Đời Đầu Tư
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {activeSupport.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3.5 bg-fortress-deep border border-fortress-gold/10 rounded-sm"
                >
                  <div className="w-1 h-1 rounded-full bg-fortress-gold shrink-0" />
                  <p className="text-fortress-ivory text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Form yêu cầu ── */}
      <Section dark id="enquiry">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-14">
          <div className="lg:col-span-2">
            <SectionHeader
              tag="Bắt Đầu Ngay Hôm Nay"
              heading="Thảo Luận Cơ Hội Cùng Fortress"
              description="Chia sẻ thông tin và kỳ vọng của bạn. Đội ngũ chuyên gia sẽ phản hồi trong 2–3 ngày làm việc với cam kết bảo mật cao nhất."
              align="left"
              dark
            />
            <ul className="mt-8 space-y-3">
              {guarantees.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-fortress-gold shrink-0 mt-0.5" />
                  <span className="text-fortress-silver/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-fortress-deep border border-fortress-gold/15 p-7 md:p-10 rounded-2xl">
              <InvestorForm />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Cam kết bảo mật ── */}
      <Section altDark>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            tag="Cam Kết Bảo Mật"
            heading="Thông Tin Của Bạn Được Bảo Vệ Tuyệt Đối"
            description="Mọi dữ liệu gửi qua website chỉ được sử dụng cho mục đích đánh giá cơ hội đầu tư. Fortress tuân thủ nghiêm ngặt nguyên tắc bảo mật và quyền riêng tư của khách hàng — không chia sẻ với bên thứ ba."
            dark
          />
        </div>
      </Section>
    </main>
  );
}
