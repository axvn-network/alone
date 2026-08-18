"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "@/shared/components/animations/PageTransition";
import Reveal from "@/shared/components/animations/Reveal";
import Stagger from "@/shared/components/animations/Stagger";
import StaggerItem from "@/shared/components/animations/StaggerItem";
import PageHero from "@/modules/content/components/PageHero";
import {
  Search,
  ClipboardCheck,
  TrendingUp,
  BarChart3,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  Shield,
  Star,
  Zap,
  Activity,
  BarChart2,
  Leaf,
  ChevronRight,
  CheckCheck,
} from "lucide-react";

// ─── Dữ Liệu ─────────────────────────────────────────────────────────────────

const processSteps = [
  {
    step: "01",
    icon: Search,
    title: "Nhận Diện Cơ Hội",
    subtitle: "Tìm Kiếm Doanh Nghiệp Và Tài Sản Có Tiềm Năng",
    description:
      "Những cơ hội xuất sắc hiếm khi tự tìm đến. Chúng tôi tìm kiếm chúng thông qua mạng lưới chuyên nghiệp, đề xuất trực tiếp, nghiên cứu thị trường, cố vấn uy tín, chủ doanh nghiệp, nhà phát triển, nhà đầu tư và đối tác chiến lược. Chúng tôi tập trung vào các cơ hội đáp ứng nhu cầu thị trường thực sự và có lý do tồn tại dài hạn rõ ràng – không phải xu hướng, không phải đầu cơ, không phải tâm lý sợ bỏ lỡ.",
  },
  {
    step: "02",
    icon: ClipboardCheck,
    title: "Đánh Giá Rủi Ro Và Tiềm Năng",
    subtitle: "Nhìn Xa Hơn Bản Trình Bày",
    description:
      "Mọi doanh nghiệp đều trông hấp dẫn trong bản thuyết trình. Công việc của chúng tôi là hiểu nó trông như thế nào vào một ngày Thứ Ba khó khăn trong một quý đầy thách thức.",
    checklist: [
      { label: "Mô hình kinh doanh", desc: "cách công ty thực sự kiếm tiền" },
      { label: "Nhu cầu thị trường", desc: "bằng chứng về nhu cầu khách hàng thực sự và bền vững" },
      { label: "Vị thế cạnh tranh", desc: "lý do doanh nghiệp này chiến thắng" },
      { label: "Lãnh đạo và ban quản lý", desc: "những người sẽ thực hiện kế hoạch" },
      { label: "Hiệu suất tài chính lịch sử", desc: "những gì con số thực sự cho thấy" },
      { label: "Chất lượng doanh thu và dòng tiền", desc: "sự khác biệt giữa tăng trưởng và sức khỏe" },
      { label: "Cấu trúc pháp lý", desc: "nền tảng pháp lý sạch sẽ" },
      { label: "Yêu cầu vận hành", desc: "những gì cần thiết để vận hành và mở rộng" },
      { label: "Định giá", desc: "mức giá để tất cả các bên cùng thành công" },
    ],
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Đầu Tư Chiến Lược",
    subtitle: "Cấu Trúc Mọi Khoản Đầu Tư Với Mục Đích Rõ Ràng",
    description:
      "Khi cơ hội đáp ứng các tiêu chí của chúng tôi, chúng tôi thiết kế cấu trúc đầu tư phù hợp với nhu cầu doanh nghiệp và lợi ích của tất cả các bên. Mục tiêu trong mọi trường hợp: cấu trúc rõ ràng, có trách nhiệm với quản trị phù hợp, trách nhiệm giải trình và sự liên kết. Sự mơ hồ là nguyên nhân thất bại của các mối quan hệ – nên chúng tôi loại bỏ nó ngay từ đầu.",
    structures: [
      { label: "Thâu tóm toàn bộ", desc: "chuyển giao quyền sở hữu hoàn toàn" },
      { label: "Đầu tư cổ phần kiểm soát hoặc thiểu số", desc: "vị thế vốn linh hoạt" },
      { label: "Vốn tăng trưởng", desc: "tài trợ gắn với kế hoạch mở rộng rõ ràng" },
      { label: "Liên doanh hoặc đồng đầu tư", desc: "sở hữu chung với đối tác liên kết" },
      { label: "Mua lại tài sản", desc: "mua tài sản cụ thể thay vì toàn bộ pháp nhân" },
      { label: "Tài chính có cấu trúc", desc: "giải pháp tùy chỉnh cho các tình huống phức tạp" },
    ],
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Quản Lý Và Phát Triển Giá Trị",
    subtitle: "Đóng Góp Vượt Trên Nguồn Vốn",
    description:
      "Ký kết thỏa thuận là nơi công việc của chúng tôi bắt đầu – không phải kết thúc. AXVN Tech Holding tích cực hỗ trợ phát triển thông qua lập kế hoạch chiến lược, giám sát tài chính, hỗ trợ quản lý, phát triển kinh doanh, xây dựng thương hiệu, triển khai công nghệ, cải thiện vận hành, quản trị và phát triển quan hệ đối tác.",
    supportAreas: [
      { label: "Lập kế hoạch chiến lược", desc: "định hướng rõ ràng và mục tiêu đo lường được" },
      { label: "Giám sát tài chính", desc: "báo cáo kỷ luật và quản lý hiệu suất" },
      { label: "Hỗ trợ quản lý", desc: "củng cố đội ngũ" },
      { label: "Phát triển kinh doanh", desc: "mở cửa, mở rộng thị trường" },
      { label: "Xây dựng thương hiệu", desc: "tạo dựng nhận diện và niềm tin" },
      { label: "Công nghệ", desc: "hiện đại hóa vận hành" },
      { label: "Cải thiện vận hành", desc: "tăng hiệu quả thực tiễn" },
      { label: "Quản trị", desc: "trách nhiệm bảo vệ giá trị" },
      { label: "Phát triển quan hệ đối tác", desc: "kết nối tạo ra cơ hội" },
    ],
  },
  {
    step: "05",
    icon: Handshake,
    title: "Quản Lý Vì Giá Trị Dài Hạn",
    subtitle: "Giám Sát Kỷ Luật. Hiệu Suất Bền Vững.",
    description:
      "Giá trị dài hạn được tạo ra thông qua quản lý kỷ luật, giám sát nhất quán và ra quyết định dựa trên thông tin. Chúng tôi duy trì mục tiêu đầu tư rõ ràng, báo cáo minh bạch và giám sát có cấu trúc trong suốt vòng đời đầu tư.\n\nĐội ngũ của chúng tôi liên tục xem xét hiệu suất, quản lý rủi ro và phản ứng với các điều kiện thị trường thay đổi trong khi luôn tập trung vào thu nhập bền vững và tăng trưởng vốn dài hạn. Mọi khoản đầu tư được quản lý với trách nhiệm giải trình, sự rõ ràng và sự liên kết với chiến lược đã thống nhất.",
  },
];

const evaluationPrinciples = [
  { number: "01", title: "Lãnh đạo mạnh mẽ và có đạo đức", desc: "tính cách đến trước năng lực", icon: Star },
  { number: "02", title: "Nhu cầu khách hàng thực sự", desc: "doanh thu thực từ khách hàng thực", icon: Users },
  { number: "03", title: "Thông tin tài chính minh bạch", desc: "sự rõ ràng là điều kiện xuất phát", icon: BarChart2 },
  { number: "04", title: "Định giá thực tế", desc: "mức giá phản ánh bằng chứng, không phải nhiệt tình", icon: Target },
  { number: "05", title: "Vận hành có thể mở rộng", desc: "tăng trưởng không gãy vỡ cấu trúc", icon: TrendingUp },
  { number: "06", title: "Khác biệt hóa cạnh tranh", desc: "lý do để chiến thắng và duy trì vị thế", icon: Zap },
  { number: "07", title: "Quản trị có trách nhiệm", desc: "cấu trúc bảo vệ tất cả các bên liên quan", icon: Shield },
  { number: "08", title: "Rủi ro có thể quản lý", desc: "mức rủi ro chúng tôi có thể hiểu và hấp thụ", icon: Activity },
  { number: "09", title: "Tiềm năng tăng trưởng bền vững", desc: "giá trị tích lũy theo thời gian", icon: Leaf },
];

export default function OurApproachPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white text-AXVN-ivory relative pb-safe md:pb-0">
        {/* ── 1. Hero Section ── */}
        <PageHero
          tag="Cách Chúng Tôi Xây Dựng"
          heading={
            <>
              Không Có{" "}
              <span className="font-bold bg-gradient-to-r from-AXVN-gold to-AXVN-champagne bg-clip-text text-transparent">
                Đường Tắt.
              </span>{" "}
              Không Có Ảo Tưởng.
            </>
          }
          description="Đây là cách AXVN Tech Holding tiếp cận mọi quyết định — từ lựa chọn đối tác, thẩm định cơ hội, đến xây dựng từng bước của hồ sơ cấp phép. Không vẽ bánh. Không hứa hẹn vô căn cứ."
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="#process"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-xs tracking-[0.18em] uppercase hover:opacity-90 transition-all shadow-lg shadow-AXVN-gold/15 group"
            >
              Xem Cách Chúng Tôi Làm Việc
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#principles"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 border border-AXVN-navy/30 text-AXVN-navy font-semibold text-xs tracking-[0.18em] uppercase hover:bg-AXVN-navy/5 hover:border-AXVN-navy/50 transition-all"
            >
              Tiêu Chuẩn Đánh Giá
            </Link>
          </div>
        </PageHero>

        {/* ── 2. Investment Process Section ──────────────────────────────── */}
        <section
          id="process"
          className="bg-AXVN-navy rounded-2xl section-mx section-my"
          style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
        >
          <div className="max-w-[1400px] mx-auto section-px">

            {/* Section Header */}
            <Reveal className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-AXVN-gold/40" />
                <span className="section-tag">5 Bước Xây Dựng Thực Tế</span>
                <div className="w-8 h-px bg-AXVN-gold/40" />
              </div>
              <h2
                className="font-light text-AXVN-ivory uppercase leading-[1.28] mb-3 sm:mb-4"
                style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
              >
                Quy Trình <span className="font-semibold text-AXVN-gold">Thực Hiện</span>
              </h2>
              <p className="text-AXVN-gold font-semibold mb-3 sm:mb-4" style={{ fontSize: "var(--text-lead)" }}>
                Mỗi cơ hội là duy nhất. Tiêu chuẩn của chúng tôi thì không.
              </p>
              <p className="text-AXVN-silver/80 leading-[1.8] font-light" style={{ fontSize: "var(--text-body)" }}>
                Không phải quy trình để trấn an nhà đầu tư trên PowerPoint — đây là cách AXVN Tech Holding thực sự vận hành. Từ nhận diện cơ hội đến quản lý giá trị dài hạn, mỗi bước đều có mục đích rõ ràng và có thể kiểm chứng được.
              </p>
            </Reveal>

            <div className="space-y-5 sm:space-y-8 md:space-y-12">
              {processSteps.map((stepItem, i) => {
                const Icon = stepItem.icon;
                return (
                  <Reveal key={i}>
                    <div className="group relative bg-AXVN-deep border border-AXVN-gold/15 hover:border-AXVN-gold/40 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 transition-all duration-300">

                      {/* Top bar */}
                      <div className="flex items-center justify-between gap-3 mb-5 border-b border-AXVN-gold/10 pb-5">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-AXVN-gold/10 text-AXVN-gold border border-AXVN-gold/20 flex items-center justify-center shrink-0 group-hover:bg-AXVN-gold group-hover:text-AXVN-navy transition-colors duration-300">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-AXVN-gold text-[10px] font-mono font-bold tracking-widest uppercase block">
                              Bước {stepItem.step}
                            </span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-AXVN-ivory leading-tight">
                              {stepItem.title}
                            </h3>
                          </div>
                        </div>
                        <span className="hidden sm:block text-4xl sm:text-5xl font-black font-mono text-AXVN-gold/20 select-none shrink-0">
                          {stepItem.step}
                        </span>
                      </div>

                      <p className="text-AXVN-gold font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                        {stepItem.subtitle}
                      </p>

                      <div className="text-AXVN-silver/80 text-sm leading-relaxed mb-4 space-y-3 sm:space-y-4">
                        {stepItem.description.split("\n\n").map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Bước 02 – danh sách kiểm tra */}
                      {stepItem.checklist && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-AXVN-gold/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {stepItem.checklist.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 p-3 rounded-xl bg-AXVN-navy border border-AXVN-gold/15"
                              >
                                <CheckCircle2 className="w-4 h-4 text-AXVN-gold shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-xs font-bold text-AXVN-ivory block capitalize">
                                    {item.label}
                                  </span>
                                  <span className="text-[11px] text-AXVN-silver/70 leading-snug">
                                    {item.desc}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bước 03 – cấu trúc đầu tư */}
                      {stepItem.structures && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-AXVN-gold/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            {stepItem.structures.map((struct, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-AXVN-navy border border-AXVN-gold/15"
                              >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-AXVN-gold shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-xs sm:text-sm font-bold text-AXVN-ivory block mb-0.5 sm:mb-1 capitalize">
                                    {struct.label}
                                  </span>
                                  <span className="text-[11px] sm:text-xs text-AXVN-silver/70">
                                    {struct.desc}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bước 04 – lĩnh vực hỗ trợ */}
                      {stepItem.supportAreas && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-AXVN-gold/10">
                          <span className="text-AXVN-ivory text-xs sm:text-sm font-bold uppercase tracking-wider block mb-3 sm:mb-4">
                            Lĩnh Vực Hỗ Trợ Chủ Động
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {stepItem.supportAreas.map((area, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 p-3 rounded-xl bg-AXVN-navy border border-AXVN-gold/15"
                              >
                                <CheckCheck className="w-4 h-4 text-AXVN-gold shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-xs font-bold text-AXVN-ivory block capitalize">
                                    {area.label}
                                  </span>
                                  <span className="text-[11px] text-AXVN-silver/70 leading-snug">
                                    {area.desc}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. Evaluation Principles Section ───────────────────────────── */}
        <section
          id="principles"
          className="bg-AXVN-navy rounded-2xl section-mx section-my"
          style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
        >
          <div className="max-w-[1400px] mx-auto section-px">

            <Reveal className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-AXVN-gold/40" />
                <span className="section-tag">9 Tiêu Chí Không Thể Thỏa Hiệp</span>
                <div className="w-8 h-px bg-AXVN-gold/40" />
              </div>
              <h2
                className="font-light text-AXVN-ivory uppercase leading-[1.28] mb-3 sm:mb-4"
                style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
              >
                Tiêu Chuẩn <span className="font-semibold text-AXVN-gold">Đánh Giá</span>
              </h2>
              <p className="text-AXVN-silver/80 leading-[1.8] font-light" style={{ fontSize: "var(--text-body)" }}>
                Đây không phải checklist marketing. Đây là 9 điều kiện thực sự mà AXVN Tech Holding dùng để quyết định có tiến tới hay không — áp dụng cho mọi cơ hội, không có ngoại lệ.
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {evaluationPrinciples.map((item, i) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={i}>
                    <motion.div
                      whileHover={{ y: -6, borderColor: "rgba(201,162,74,0.4)" }}
                      className="group p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-AXVN-deep border border-AXVN-gold/15 transition-all duration-300 h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-AXVN-gold/10 border border-AXVN-gold/20 flex items-center justify-center text-AXVN-gold group-hover:bg-AXVN-gold group-hover:text-AXVN-navy transition-colors duration-300">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <span className="text-xl sm:text-2xl font-black font-mono text-AXVN-gold/30 group-hover:text-AXVN-gold/50 transition-colors">
                            {item.number}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-AXVN-ivory mb-1.5 sm:mb-2 capitalize">
                          {item.title}
                        </h3>
                        <p className="text-AXVN-silver/70 text-xs sm:text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="h-0.5 bg-gradient-to-r from-AXVN-gold/40 to-transparent mt-5 sm:mt-6 group-hover:from-AXVN-gold transition-colors" />
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>

          </div>
        </section>

        {/* ── 4. CTA ─────────────────────────────────────────────────────── */}
        <section
          className="bg-AXVN-navy rounded-2xl section-mx section-my"
          style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
        >
          <div className="max-w-[1400px] mx-auto section-px text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-8 h-px bg-AXVN-gold/40" />
                <span className="section-tag">Đồng Hành Xây Dựng</span>
                <div className="w-8 h-px bg-AXVN-gold/40" />
              </div>
              <h2
                className="font-light text-AXVN-ivory mb-4 md:mb-6 uppercase leading-[1.28]"
                style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
              >
                Bạn Thấy Cùng Một Lý Tưởng?
              </h2>
              <p className="text-AXVN-silver/80 leading-[1.8] max-w-2xl mx-auto mb-8" style={{ fontSize: "var(--text-lead)" }}>
                AXVN Tech Holding xây dựng theo đúng quy trình này — công khai, có thể kiểm chứng. Nếu bạn tin vào cách tiếp cận này và muốn là một phần của hành trình, chúng tôi muốn nói chuyện với bạn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/invest-with-axvn"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm tracking-widest hover:shadow-2xl hover:shadow-AXVN-gold/25 transition-all duration-300"
                >
                  XEM LỘ TRÌNH & KẾT NỐI
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-AXVN-gold/40 text-AXVN-gold font-semibold text-sm tracking-widest hover:bg-AXVN-gold/10 transition-all duration-300"
                >
                  TÌM HIỂU VỀ CHÚNG TÔI
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
    </PageTransition>
  );
}
