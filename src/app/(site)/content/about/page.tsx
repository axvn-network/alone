import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Eye,
  Target,
  Award,
  Users,
  Scale,
  Lock,
  Hexagon,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/shared/components/animations/Reveal";
import Stagger from "@/shared/components/animations/Stagger";
import StaggerItem from "@/shared/components/animations/StaggerItem";
import PageHero from "@/shared/components/blocks/PageHero";
import SectionHeader from "@/shared/components/blocks/SectionHeader";
import type { Metadata } from "next";

// Static page — no DB queries. Cache for 24h; revalidate on next request after expiry.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Về Chúng Tôi | AXVN Tech Holding",
  description:
    "AXVN Tech Holding — đội ngũ đang xây dựng nền tảng giao dịch tài sản mã hóa hợp pháp đầu tiên tại Việt Nam. Tìm hiểu về con người, lý tưởng và hành trình của chúng tôi.",
  openGraph: {
    title: "Về Chúng Tôi | AXVN Tech Holding",
    description:
      "Chúng tôi không xây dựng thứ này để bán. Chúng tôi xây dựng vì tin rằng thị trường tài sản số hợp pháp là nền tảng tài chính thế hệ tiếp theo của Việt Nam.",
  },
};

// Ba giá trị cốt lõi — hiển thị nổi bật đầu tiên
const coreValues = [
  {
    icon: Shield,
    title: "XÂY DỰNG TRÊN NIỀM TIN",
    description: "Liêm chính và minh bạch trong mọi hoạt động.",
  },
  {
    icon: Target,
    title: "TẠO RA GIÁ TRỊ THỰC",
    description: "Xây dựng nền tảng có lộ trình rõ ràng và tiến độ minh bạch.",
  },
  {
    icon: Scale,
    title: "QUẢN TRỊ CÓ KỶ LUẬT",
    description: "Thẩm định nghiêm ngặt và giám sát chặt chẽ mọi khoản đầu tư.",
  },
];

// Các nguyên tắc bổ sung
const values = [
  {
    icon: Shield,
    title: "Liêm Chính",
    description:
      "Trung thực, trách nhiệm và minh bạch trong mọi quyết định và giao dịch — không có ngoại lệ.",
  },
  {
    icon: Hexagon,
    title: "Kỷ Luật",
    description:
      "Quyết định dựa trên phân tích, không phải cảm xúc. Biết khi nào nên tiến và khi nào nên dừng.",
  },
  {
    icon: Eye,
    title: "Tầm Nhìn Dài Hạn",
    description:
      "Nhìn xa hơn lợi nhuận trước mắt để xác định giá trị bền vững mà thị trường đang bỏ qua.",
  },
  {
    icon: Users,
    title: "Quan Hệ Đối Tác",
    description:
      "Xây dựng mối quan hệ trên niềm tin, tôn trọng và mục tiêu chung. Thành công của đối tác là thành công của chúng tôi.",
  },
  {
    icon: Award,
    title: "Tiêu Chuẩn Xuất Sắc",
    description:
      "Giữ chuẩn mực cao trong mọi khoản đầu tư, quan hệ đối tác và tương tác kinh doanh.",
  },
  {
    icon: Scale,
    title: "Trách Nhiệm Giải Trình",
    description:
      "Chịu trách nhiệm hoàn toàn với quyết định, cam kết và hiệu suất. Chúng tôi làm đúng những gì đã nói.",
  },
  {
    icon: Lock,
    title: "Bảo Mật Tuyệt Đối",
    description:
      "Bảo vệ thông tin, lợi ích và quyền riêng tư của đối tác và các bên liên quan — luôn luôn.",
  },
  {
    icon: Heart,
    title: "Lấy Đối Tác Làm Trung Tâm",
    description:
      "Đặt lợi ích đối tác vào trung tâm mọi quyết định — minh bạch, tin cậy và tạo giá trị dài hạn.",
  },
];

const philosophyPoints = [
  {
    label: "Nhu cầu thị trường thực sự",
    desc: "Người dùng cần sản phẩm FinTech/tài sản số có giá trị thực — không phải đầu cơ",
  },
  {
    label: "Tuân thủ pháp lý là nền tảng",
    desc: "Mọi đầu tư crypto/FinTech phải phù hợp NQ5/2025 và quy định pháp luật hiện hành",
  },
  {
    label: "Lãnh đạo có năng lực & đạo đức",
    desc: "Đội ngũ quản lý am hiểu pháp lý, có kinh nghiệm và trách nhiệm cao",
  },
  {
    label: "Vận hành có thể mở rộng quy mô",
    desc: "Tăng trưởng mà không gãy vỡ cấu trúc tuân thủ và quản trị",
  },
  {
    label: "Lợi thế cạnh tranh bền vững",
    desc: "Doanh nghiệp được cấp phép và định vị đúng trong hệ sinh thái tài sản số",
  },
  {
    label: "Thông tin tài chính minh bạch",
    desc: "Con số rõ ràng, trình bày trung thực với nhà đầu tư và cơ quan quản lý",
  },
  {
    label: "Tiềm năng tăng trưởng thực tế",
    desc: "Tham vọng được neo chặt trong nhu cầu thị trường tài sản số Việt Nam",
  },
  {
    label: "Liên kết các bên cùng mục tiêu",
    desc: "Nhà đầu tư, doanh nghiệp và cơ quan quản lý cùng hướng đến mục tiêu chung",
  },
];

function Section({
  id,
  dark,
  children,
}: {
  id?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl section-mx section-my ${dark ? "bg-AXVN-navy" : "bg-white"}`}
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div className="max-w-[1400px] mx-auto section-px">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      {/* ── Hero ── */}
      <PageHero
        tag="Về Chúng Tôi"
        heading={
          <>
            Con Người.{" "}
            <span className="font-bold bg-gradient-to-r from-AXVN-gold to-AXVN-champagne bg-clip-text text-transparent">
              Lý Tưởng.
            </span>
            <br />
            Hành Trình{" "}
            <span className="font-bold bg-gradient-to-r from-AXVN-gold to-AXVN-champagne bg-clip-text text-transparent">
              Xây Dựng.
            </span>
          </>
        }
        description="AXVN Tech Holding được xây dựng bởi những người tin rằng thị trường tài sản số hợp pháp là nền tảng tài chính thế hệ tiếp theo của Việt Nam — và quyết định hành động thay vì chờ đợi."
      />

      {/* ── Giới thiệu công ty ── */}
      <Section dark id="about">
        <Reveal className="max-w-3xl mx-auto text-center">
          <SectionHeader
            tag="Chúng Tôi Là Ai"
            heading="Không Phải Công Ty Đầu Tư Truyền Thống — Là Nhóm Người Đang Xây Dựng"
            description="AXVN Tech Holding có trụ sở tại Dubai, UAE và hoạt động tại Việt Nam. Chúng tôi không tìm kiếm thương vụ — chúng tôi đang kiến tạo từ đầu sàn giao dịch tài sản mã hóa hợp pháp đầu tiên theo NQ 05/2025/NQ-CP. Đây là dự án dài hạn, được xây dựng bởi người có lý tưởng, không phải bởi người chỉ nhìn thấy lợi nhuận ngắn hạn."
            dark
          />
        </Reveal>
      </Section>

      {/* ── Tầm nhìn & Sứ mệnh ── */}
      <Section id="mission">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Tại Sao Chúng Tôi Ở Đây"
            heading="Lý Do Và Mục Đích"
          />
        </Reveal>
        <Stagger className="grid md:grid-cols-2 gap-5 md:gap-8">
          <StaggerItem className="bg-AXVN-navy border border-AXVN-gold/10 hover:border-AXVN-gold/30 transition-all duration-300 rounded-2xl p-7 md:p-10">
            <div className="w-11 h-11 bg-AXVN-gold/10 border border-AXVN-gold/20 flex items-center justify-center rounded-sm mb-6">
              <Eye className="w-5 h-5 text-AXVN-gold" />
            </div>
            <p className="section-tag mb-3">Tầm Nhìn</p>
            <h3
              className="font-semibold text-AXVN-ivory mb-4 leading-snug"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Thị Trường Tài Sản Số Hợp Pháp Là Nền Tảng Tài Chính Thế Hệ Tiếp
              Theo Của Việt Nam
            </h3>
            <p
              className="text-AXVN-silver/80 leading-[1.8]"
              style={{ fontSize: "var(--text-body)" }}
            >
              Không phải vì đây là xu hướng. Vì đây là tất yếu. Với 100 triệu
              dân, tỷ lệ sở hữu crypto cao nhất Đông Nam Á nhưng chưa có một sàn
              giao dịch hợp pháp — thị trường này cần được xây dựng đúng, bởi
              người có trách nhiệm. AXVN Tech Holding ở đây để làm điều đó.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-AXVN-deep border border-AXVN-gold/10 hover:border-AXVN-gold/30 transition-all duration-300 rounded-2xl p-7 md:p-10">
            <div className="w-11 h-11 bg-AXVN-gold/10 border border-AXVN-gold/20 flex items-center justify-center rounded-sm mb-6">
              <Target className="w-5 h-5 text-AXVN-gold" />
            </div>
            <p className="section-tag mb-3">Sứ Mệnh</p>
            <h3
              className="font-semibold text-AXVN-ivory mb-4 leading-snug"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Xây Dựng Đúng. Kỷ Luật. Minh Bạch. Để Tồn Tại Lâu Dài.
            </h3>
            <p
              className="text-AXVN-silver/80 leading-[1.8]"
              style={{ fontSize: "var(--text-body)" }}
            >
              Tập hợp những người cùng lý tưởng — tổ chức tài chính, chuyên gia
              công nghệ, nhà đầu tư dài hạn — để cùng nhau xây dựng sàn giao
              dịch tài sản mã hóa đầu tiên được Bộ Tài chính Việt Nam cấp phép
              theo NQ 05/2025/NQ-CP. Đúng quy trình. Đúng pháp lý. Không đường
              tắt.
            </p>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* ── Ban lãnh đạo ── */}
      <Section dark id="leadership">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Ban Lãnh Đạo"
            heading="Lãnh Đạo Xây Dựng Trên Tầm Nhìn & Trách Nhiệm"
            dark
          />
        </Reveal>
        <Stagger className="grid lg:grid-cols-2 gap-6 md:gap-10">
          {[
            {
              src: "/Azzam-El-Khatib.jpeg",
              name: "Azzam El-Khatib",
              role: "Nhà Sáng Lập & Tổng Giám Đốc Điều Hành (CEO)",
              bio: [
                "Azzam El-Khatib xây dựng AXVN Tech Holding từ một niềm tin đơn giản: thị trường tài sản mã hóa hợp pháp tại Việt Nam cần được xây dựng bởi người có trách nhiệm — không phải bởi người chỉ nhìn thấy lợi nhuận.",
                "Với mạng lưới sâu rộng tại UAE, GCC và các thị trường quốc tế, Azzam mang đến cho AXVN Tech Holding khả năng kết nối vốn và chuyên môn quốc tế với cơ hội thực tế tại Việt Nam.",
                "Phong cách lãnh đạo của ông được định hình bởi một nguyên tắc: người ta không đi cùng vì bị thuyết phục — họ đi cùng vì nhìn thấy điều tương tự và tin vào hành trình đó.",
              ],
            },
            {
              src: "/Serhii-Pohrebniak.jpeg",
              name: "Serhii Pohrebniak",
              role: "Giám Đốc Chiến Lược Doanh Nghiệp",
              bio: [
                "Serhii Pohrebniak là người định hình chiến lược và kiến trúc vận hành của AXVN Tech Holding. Nền tảng quân ngũ của ông không chỉ mang lại kỷ luật — mà còn là tư duy rõ ràng về mục tiêu, rủi ro và cái giá của việc làm sai.",
                "Ông không tin vào đường tắt hay chiến lược mờ nhạt. Mỗi quyết định được đưa ra trên cơ sở phân tích thực tế, hiểu rõ ràng về những gì đang xây dựng và tại sao nó quan trọng.",
                "Triết lý của ông: &apos;Mục tiêu có ý nghĩa thực sự chỉ đạt được bằng kiên trì, không phải bằng nhiệt tình.&apos; Đây là nền tảng văn hóa của AXVN Tech Holding.",
              ],
            },
          ].map((person) => (
            <StaggerItem
              key={person.name}
              className="group bg-gradient-to-br from-AXVN-navy to-AXVN-charcoal border border-AXVN-gold/10 hover:border-AXVN-gold/35 hover:shadow-2xl hover:shadow-AXVN-gold/8 hover:-translate-y-1 transition-all duration-500 rounded-2xl overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={person.src}
                  alt={person.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-AXVN-navy/60 to-transparent" />
              </div>
              <div className="p-7 md:p-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3
                      className="font-bold text-AXVN-ivory mb-1 group-hover:text-AXVN-gold transition-colors duration-300"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {person.name}
                    </h3>
                    <p className="section-tag">{person.role}</p>
                  </div>
                  <div className="w-8 h-px bg-AXVN-gold/40 mt-2 shrink-0" />
                </div>
                <div className="space-y-3">
                  {person.bio.map((para, i) => (
                    <p
                      key={i}
                      className="text-AXVN-silver/75 leading-[1.8]"
                      style={{ fontSize: "var(--text-body)" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── Giá trị cốt lõi ── */}
      <Section id="values">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Giá Trị Cốt Lõi"
            heading="Nguyên Tắc Đằng Sau Mọi Quyết Định"
            description="Ba giá trị cốt lõi không thể thỏa hiệp — là la bàn hướng dẫn mọi hành động và cam kết của AXVN Tech Holding."
          />
        </Reveal>

        {/* Ba giá trị cốt lõi nổi bật */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
          {coreValues.map((v) => (
            <StaggerItem
              key={v.title}
              className="group bg-AXVN-deep border border-AXVN-gold/20 hover:border-AXVN-gold/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-AXVN-gold/10 transition-all duration-300 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-AXVN-gold/15 border border-AXVN-gold/25 flex items-center justify-center rounded-sm mb-6 group-hover:bg-AXVN-gold/25 transition-colors">
                <v.icon className="w-6 h-6 text-AXVN-gold" />
              </div>
              <h3 className="font-bold text-AXVN-gold uppercase tracking-widest text-sm mb-3 leading-snug">
                {v.title}
              </h3>
              <p
                className="text-AXVN-silver/80 leading-[1.75]"
                style={{ fontSize: "var(--text-body)" }}
              >
                {v.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Các nguyên tắc bổ sung */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {values.map((v) => (
            <StaggerItem
              key={v.title}
              className="group bg-AXVN-navy border border-AXVN-gold/10 hover:border-AXVN-gold/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-AXVN-gold/5 transition-all duration-300 rounded-2xl p-6 md:p-7"
            >
              <div className="w-10 h-10 bg-AXVN-gold/10 border border-AXVN-gold/15 flex items-center justify-center rounded-sm mb-5 group-hover:bg-AXVN-gold/20 transition-colors">
                <v.icon className="w-5 h-5 text-AXVN-gold" />
              </div>
              <h3
                className="font-semibold text-AXVN-ivory mb-2.5 leading-snug"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {v.title}
              </h3>
              <p
                className="text-AXVN-silver/70 leading-[1.75]"
                style={{ fontSize: "var(--text-body)" }}
              >
                {v.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── Triết lý đầu tư ── */}
      <Section dark id="philosophy">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Triết Lý Đầu Tư"
            heading={
              <>
                Vốn Kỷ Luật.{" "}
                <span className="font-bold text-AXVN-gold">
                  Tuân Thủ. Tăng Trưởng Bền Vững.
                </span>
              </>
            }
            description="Giá trị bền vững trong kinh tế số bắt đầu từ tuân thủ pháp lý, nền tảng thị trường vững chắc và đội ngũ đủ năng lực — tất cả những thứ khác chỉ là ảo ảnh nhất thời."
            dark
          />
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {philosophyPoints.map((point, i) => (
            <StaggerItem
              key={i}
              className="group flex items-start gap-4 p-5 md:p-6 bg-AXVN-deep border border-AXVN-gold/10 hover:border-AXVN-gold/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-AXVN-gold/5 transition-all duration-300 rounded-sm"
            >
              <div className="w-px h-full min-h-[2.5rem] bg-AXVN-gold/30 shrink-0 group-hover:bg-AXVN-gold/60 transition-colors" />
              <div>
                <p className="font-semibold text-AXVN-ivory text-sm mb-1">
                  {point.label}
                </p>
                <p
                  className="text-AXVN-silver/60 leading-relaxed"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {point.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── Tiến độ dự án ── */}
      <Section id="progress">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader
            tag="Tiến Độ Thực Tế"
            heading="Chúng Tôi Đang Ở Đâu Trên Hành Trình"
            description="Không phải slide deck. Đây là trạng thái thực tế của dự án — những gì đã hoàn thành, đang thực hiện, và những bước tiếp theo."
          />
        </Reveal>
        <Stagger className="space-y-4">
          {[
            {
              status: "done",
              phase: "Giai Đoạn 01",
              title: "Thành Lập & Định Vị",
              desc: "AXVN Tech Holding được thành lập tại Dubai, UAE. Đội ngũ sáng lập được tập hợp. Chiến lược pháp lý theo NQ 05/2025/NQ-CP được xác định.",
            },
            {
              status: "done",
              phase: "Giai Đoạn 02",
              title: "Nghiên Cứu Pháp Lý & Điều Kiện Cấp Phép",
              desc: "Nghiên cứu chuyên sâu NQ 05/2025/NQ-CP và QĐ 96/QĐ-BTC. Xác định đầy đủ 12 điều kiện cấp phép. Lộ trình hồ sơ được phác thảo.",
            },
            {
              status: "active",
              phase: "Giai Đoạn 03",
              title: "Xây Dựng Liên Minh Đối Tác",
              desc: "Đang tìm kiếm và đánh giá các đối tác chiến lược — tổ chức tài chính, chuyên gia công nghệ, nhà đầu tư dài hạn — đủ điều kiện tham gia hồ sơ cấp phép.",
            },
            {
              status: "upcoming",
              phase: "Giai Đoạn 04",
              title: "Nộp Hồ Sơ Xin Cấp Phép",
              desc: "Hoàn thiện và nộp hồ sơ lên Bộ Tài chính sau khi đáp ứng đủ điều kiện về vốn điều lệ, đội ngũ và hệ thống kỹ thuật.",
            },
            {
              status: "upcoming",
              phase: "Giai Đoạn 05",
              title: "Vận Hành Có Giám Sát",
              desc: "Sau khi nhận giấy phép, vận hành thí điểm có kiểm soát trong giai đoạn NQ 05/2025 (5 năm) với báo cáo minh bạch định kỳ cho tất cả đối tác.",
            },
          ].map((item, i) => (
            <StaggerItem key={i}>
              <div
                className={`flex items-start gap-4 p-5 md:p-6 border rounded-sm transition-all duration-300 ${
                  item.status === "done"
                    ? "bg-AXVN-navy border-AXVN-gold/25"
                    : item.status === "active"
                      ? "bg-AXVN-gold/5 border-AXVN-gold/50"
                      : "bg-white border-AXVN-gold/10"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {item.status === "done" ? (
                    <CheckCircle2 className="w-5 h-5 text-AXVN-gold" />
                  ) : item.status === "active" ? (
                    <div className="w-5 h-5 rounded-full border-2 border-AXVN-gold flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-AXVN-gold animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-AXVN-gold/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                        item.status === "done"
                          ? "text-AXVN-gold"
                          : item.status === "active"
                            ? "text-AXVN-gold"
                            : "text-AXVN-gold/40"
                      }`}
                    >
                      {item.phase}
                    </span>
                    {item.status === "active" && (
                      <span className="text-[10px] font-bold tracking-wider text-AXVN-gold bg-AXVN-gold/10 border border-AXVN-gold/30 px-2 py-0.5 uppercase">
                        Đang Thực Hiện
                      </span>
                    )}
                  </div>
                  <p
                    className={`font-semibold text-sm mb-1 ${
                      item.status === "upcoming"
                        ? "text-AXVN-charcoal/60"
                        : "text-AXVN-ivory"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-xs leading-relaxed ${
                      item.status === "upcoming"
                        ? "text-AXVN-charcoal/50"
                        : "text-AXVN-silver/70"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ── CTA ── */}
      <Section dark>
        <Reveal className="text-center max-w-2xl mx-auto">
          <SectionHeader
            tag="Cùng Chung Lý Tưởng"
            heading="Bạn Muốn Đồng Hành?"
            description="Nếu bạn đọc đến đây và thấy mình đang gật đầu — chúng tôi muốn nói chuyện với bạn. Không phải về tiền. Về hành trình và lý tưởng."
            dark
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/invest-with-axvn"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm tracking-widest hover:shadow-2xl hover:shadow-AXVN-gold/25 transition-all duration-300"
            >
              XEM HÀNH TRÌNH & KẾT NỐI
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-AXVN-gold/40 text-AXVN-gold font-semibold text-sm tracking-widest hover:bg-AXVN-gold/10 transition-all duration-300"
            >
              LIÊN HỆ TRỰC TIẾP
            </Link>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
