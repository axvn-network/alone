import Image from "next/image";
import { Shield, Eye, Target, Award, Users, Scale, Lock, Hexagon, Heart } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới Thiệu",
  description:
    "Tìm hiểu về tầm nhìn, sứ mệnh, giá trị cốt lõi và đội ngũ lãnh đạo của Fortress Investment Holdings — tập đoàn đầu tư tiên phong trong FinTech, tài sản mã hóa hợp pháp và kinh tế số Việt Nam.",
  openGraph: {
    title: "Giới Thiệu | Fortress Investment Holdings",
    description:
      "Tầm nhìn, sứ mệnh, giá trị cốt lõi và đội ngũ lãnh đạo của Fortress Investment Holdings — tiên phong FinTech và tài sản mã hóa hợp pháp tại Việt Nam.",
  },
};

const values = [
  { icon: Shield,   title: "Liêm Chính",             description: "Trung thực, trách nhiệm và minh bạch trong mọi quyết định và giao dịch — không có ngoại lệ." },
  { icon: Hexagon,  title: "Kỷ Luật",                description: "Quyết định dựa trên phân tích, không phải cảm xúc. Biết khi nào nên tiến và khi nào nên dừng." },
  { icon: Eye,      title: "Tầm Nhìn Dài Hạn",       description: "Nhìn xa hơn lợi nhuận trước mắt để xác định giá trị bền vững mà thị trường đang bỏ qua." },
  { icon: Users,    title: "Quan Hệ Đối Tác",         description: "Xây dựng mối quan hệ trên niềm tin, tôn trọng và mục tiêu chung. Thành công của đối tác là thành công của chúng tôi." },
  { icon: Award,    title: "Tiêu Chuẩn Xuất Sắc",    description: "Giữ chuẩn mực cao trong mọi khoản đầu tư, quan hệ đối tác và tương tác kinh doanh." },
  { icon: Scale,    title: "Trách Nhiệm Giải Trình",  description: "Chịu trách nhiệm hoàn toàn với quyết định, cam kết và hiệu suất. Chúng tôi làm đúng những gì đã nói." },
  { icon: Lock,     title: "Bảo Mật Tuyệt Đối",       description: "Bảo vệ thông tin, lợi ích và quyền riêng tư của đối tác và các bên liên quan — luôn luôn." },
  { icon: Heart,    title: "Lấy Đối Tác Làm Trung Tâm", description: "Đặt lợi ích đối tác vào trung tâm mọi quyết định — minh bạch, tin cậy và tạo giá trị dài hạn." },
];

const philosophyPoints = [
  { label: "Nhu cầu thị trường thực sự",         desc: "Người dùng cần sản phẩm FinTech/tài sản số có giá trị thực — không phải đầu cơ" },
  { label: "Tuân thủ pháp lý là nền tảng",       desc: "Mọi đầu tư crypto/FinTech phải phù hợp NQ5/2025 và quy định pháp luật hiện hành" },
  { label: "Lãnh đạo có năng lực & đạo đức",    desc: "Đội ngũ quản lý am hiểu pháp lý, có kinh nghiệm và trách nhiệm cao" },
  { label: "Vận hành có thể mở rộng quy mô",    desc: "Tăng trưởng mà không gãy vỡ cấu trúc tuân thủ và quản trị" },
  { label: "Lợi thế cạnh tranh bền vững",        desc: "Doanh nghiệp được cấp phép và định vị đúng trong hệ sinh thái tài sản số" },
  { label: "Thông tin tài chính minh bạch",      desc: "Con số rõ ràng, trình bày trung thực với nhà đầu tư và cơ quan quản lý" },
  { label: "Tiềm năng tăng trưởng thực tế",      desc: "Tham vọng được neo chặt trong nhu cầu thị trường tài sản số Việt Nam" },
  { label: "Liên kết các bên cùng mục tiêu",    desc: "Nhà đầu tư, doanh nghiệp và cơ quan quản lý cùng hướng đến mục tiêu chung" },
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
      className={`rounded-2xl section-mx section-my ${dark ? "bg-fortress-navy" : "bg-white"}`}
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
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
            Vốn Toàn Cầu.{" "}
            <span className="font-bold bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
              FinTech & Tài Sản Số.
            </span>
            <br />
            Kinh Tế Số{" "}
            <span className="font-bold bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
              Việt Nam.
            </span>
          </>
        }
        description="Fortress Investment Holdings kết nối nguồn vốn quốc tế với cơ hội tại Việt Nam — tiên phong đầu tư vào FinTech, dịch vụ tài sản mã hóa hợp pháp, AI và EdTech, đón đầu Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025."
      />

      {/* ── Giới thiệu công ty ── */}
      <Section dark id="about">
        <Reveal className="max-w-3xl mx-auto text-center">
          <SectionHeader
            tag="Tổng Quan"
            heading="Cầu Nối Giữa Vốn Quốc Tế Và Kinh Tế Số Việt Nam"
            description="Fortress Investment Holdings là tập đoàn đầu tư công nghệ có trụ sở tại Dubai, UAE — đặt Việt Nam và hệ sinh thái tài sản mã hóa hợp pháp là trọng tâm chiến lược. Chúng tôi tiên phong đầu tư vào FinTech, dịch vụ tài sản mã hóa được cấp phép, AI và EdTech — bám sát Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025."
            dark
          />
        </Reveal>
      </Section>

      {/* ── Tầm nhìn & Sứ mệnh ── */}
      <Section id="mission">
        <Reveal className="text-center mb-10 md:mb-14">
          <SectionHeader tag="Định Hướng Chiến Lược" heading="Tầm Nhìn & Sứ Mệnh" />
        </Reveal>
        <Stagger className="grid md:grid-cols-2 gap-5 md:gap-8">
          <StaggerItem className="bg-fortress-navy border border-fortress-gold/10 hover:border-fortress-gold/30 transition-all duration-300 rounded-2xl p-7 md:p-10">
            <div className="w-11 h-11 bg-fortress-gold/10 border border-fortress-gold/20 flex items-center justify-center rounded-sm mb-6">
              <Eye className="w-5 h-5 text-fortress-gold" />
            </div>
            <p className="section-tag mb-3">Tầm Nhìn</p>
            <h3
              className="font-semibold text-fortress-ivory mb-4 leading-snug"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Trở Thành Cổng Đầu Tư FinTech & Tài Sản Mã Hóa Hàng Đầu Kết Nối Việt Nam Với Thế Giới
            </h3>
            <p className="text-fortress-silver/80 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              Được công nhận là đối tác đầu tư tin cậy cho doanh nghiệp FinTech, dịch vụ tài sản mã hóa được cấp phép, EdTech và nhà đầu tư muốn tiếp cận hệ sinh thái tài sản số hợp pháp đầu tiên của Việt Nam — được xây dựng trên nền tảng minh bạch, tuân thủ pháp lý và giá trị thực sự đo lường được.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-fortress-deep border border-fortress-gold/10 hover:border-fortress-gold/30 transition-all duration-300 rounded-2xl p-7 md:p-10">
            <div className="w-11 h-11 bg-fortress-gold/10 border border-fortress-gold/20 flex items-center justify-center rounded-sm mb-6">
              <Target className="w-5 h-5 text-fortress-gold" />
            </div>
            <p className="section-tag mb-3">Sứ Mệnh</p>
            <h3
              className="font-semibold text-fortress-ivory mb-4 leading-snug"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Đầu Tư Có Kỷ Luật. Tuân Thủ Pháp Lý. Tạo Giá Trị Bền Vững.
            </h3>
            <p className="text-fortress-silver/80 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              Kết nối nguồn vốn quốc tế với hệ sinh thái FinTech, tài sản mã hóa hợp pháp và kinh tế số tại Việt Nam. Đồng hành cùng nhà sáng lập, doanh nghiệp và nhà đầu tư để xây dựng những tổ chức thực sự bền vững trong thị trường tài sản mã hóa hợp pháp đầu tiên của Việt Nam theo Nghị quyết 5/2025/NQ-CP.
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
                "Azzam El-Khatib lãnh đạo Fortress Investment Holdings với cam kết sâu sắc về tăng trưởng kỷ luật, dịch vụ khách hàng xuất sắc và quản lý đầu tư có trách nhiệm.",
                "Với mạng lưới rộng khắp tại UAE, GCC và các thị trường quốc tế, Azzam đóng vai trò trung tâm trong việc kiến tạo quan hệ chiến lược và định hình tầm nhìn dài hạn của tập đoàn.",
                "Phong cách lãnh đạo của ông được định hình bởi kỷ luật, trách nhiệm và triết lý lấy đối tác làm trung tâm — cam kết bảo vệ lợi ích đối tác và kiến tạo giá trị bền vững.",
              ],
            },
            {
              src: "/Serhii-Pohrebniak.jpeg",
              name: "Serhii Pohrebniak",
              role: "Giám Đốc Chiến Lược Doanh Nghiệp",
              bio: [
                "Serhii Pohrebniak là bộ óc chiến lược đằng sau tầm nhìn và định hướng phát triển của tập đoàn. Với nền tảng quân ngũ, ông mang đến kỷ luật, kiên cường và trách nhiệm cao trong mọi hoạt động kinh doanh.",
                "Kinh nghiệm phong phú trong thương trường và cuộc sống giúp ông tiếp cận thách thức với sự rõ ràng, tư duy thực tế và góc nhìn chiến lược dài hạn.",
                "Ông tin rằng mục tiêu có ý nghĩa chỉ đạt được thông qua kiên trì, kỷ luật và hành động tập trung — triết lý này là nền tảng cho mọi quyết định chiến lược của ông.",
              ],
            },
          ].map((person) => (
            <StaggerItem
              key={person.name}
              className="group bg-gradient-to-br from-fortress-navy to-fortress-charcoal border border-fortress-gold/10 hover:border-fortress-gold/35 hover:shadow-2xl hover:shadow-fortress-gold/8 hover:-translate-y-1 transition-all duration-500 rounded-2xl overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={person.src}
                  alt={person.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fortress-navy/60 to-transparent" />
              </div>
              <div className="p-7 md:p-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3
                      className="font-bold text-fortress-ivory mb-1 group-hover:text-fortress-gold transition-colors duration-300"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {person.name}
                    </h3>
                    <p className="section-tag">{person.role}</p>
                  </div>
                  <div className="w-8 h-px bg-fortress-gold/40 mt-2 shrink-0" />
                </div>
                <div className="space-y-3">
                  {person.bio.map((para, i) => (
                    <p key={i} className="text-fortress-silver/75 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
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
            description="Tám giá trị không thể thỏa hiệp — là la bàn hướng dẫn mọi hành động và cam kết của Fortress."
          />
        </Reveal>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {values.map((v) => (
            <StaggerItem
              key={v.title}
              className="group bg-fortress-navy border border-fortress-gold/10 hover:border-fortress-gold/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-fortress-gold/5 transition-all duration-300 rounded-2xl p-6 md:p-7"
            >
              <div className="w-10 h-10 bg-fortress-gold/10 border border-fortress-gold/15 flex items-center justify-center rounded-sm mb-5 group-hover:bg-fortress-gold/20 transition-colors">
                <v.icon className="w-5 h-5 text-fortress-gold" />
              </div>
              <h3
                className="font-semibold text-fortress-ivory mb-2.5 leading-snug"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {v.title}
              </h3>
              <p className="text-fortress-silver/70 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
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
                <span className="font-bold text-fortress-gold">Tuân Thủ. Tăng Trưởng Bền Vững.</span>
              </>
            }
            description="Giá trị bền vững trong kinh tế số bắt đầu từ tuân thủ pháp lý, nền tảng thị trường vững chắc và đội ngũ đủ năng lực — tất cả những thứ khác chỉ là ảo ảnh nhất thời."
            dark
          />
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
          {philosophyPoints.map((point, i) => (
            <StaggerItem
              key={i}
              className="group flex items-start gap-4 p-5 md:p-6 bg-fortress-deep border border-fortress-gold/10 hover:border-fortress-gold/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-fortress-gold/5 transition-all duration-300 rounded-sm"
            >
              <div className="w-px h-full min-h-[2.5rem] bg-fortress-gold/30 shrink-0 group-hover:bg-fortress-gold/60 transition-colors" />
              <div>
                <p className="font-semibold text-fortress-ivory text-sm mb-1">{point.label}</p>
                <p className="text-fortress-silver/60 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{point.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </main>
  );
}
