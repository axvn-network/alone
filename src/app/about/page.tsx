import Image from "next/image";


import { Shield, Eye, Target, Award, Users, Scale, Lock, Hexagon, Heart } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới Thiệu Về Chúng Tôi",
  description:
    "Tìm hiểu về tầm nhìn, sứ mệnh, giá trị cốt lõi và đội ngũ lãnh đạo chuyên nghiệp của Tập đoàn Fortress Investment Holdings.",
  openGraph: {
    title: "Giới Thiệu Về Chúng Tôi | Fortress Investment Holdings",
    description:
      "Tìm hiểu về tầm nhìn, sứ mệnh, giá trị cốt lõi và đội ngũ lãnh đạo của Fortress Investment Holdings.",
  },
};

const values = [
  { icon: Shield, title: "Liêm Chính", description: "Chúng tôi kinh doanh trung thực, có trách nhiệm và minh bạch trong mọi giao dịch, không có ngoại lệ." },
  { icon: Hexagon, title: "Vững Mạnh", description: "Chúng tôi ra quyết định với kỷ luật, sự tự tin và cân nhắc cẩn thận. Niềm tin một cần thiết; sự biết khi nào nên bước đi cũng vậy." },
  { icon: Eye, title: "Tầm Nhìn", description: "Chúng tôi nhìn xa hơn lợi nhuận trước mắt để xác định giá trị dài hạn và tiềm năng tương lai mà người khác có thể bỏ qua." },
  { icon: Users, title: "Quan Hệ Đối Tác", description: "Chúng tôi xây dựng mối quan hệ dựa trên niềm tin, sự tôn trọng, sự liên kết và mục tiêu chung. Thành công của đối tác chính là thành công của chúng tôi." },
  { icon: Award, title: "Xuất Sắc", description: "Chúng tôi giữ tiêu chuẩn cao trong mọi khoản đầu tư, quan hệ đối tác và tương tác kinh doanh." },
  { icon: Scale, title: "Trách Nhiệm", description: "Chúng tôi chịu trách nhiệm hoàn toàn về quyết định, cam kết và hiệu suất của mình. Chúng tôi làm điều mình nói." },
  { icon: Lock, title: "Bảo Mật", description: "Chúng tôi bảo vệ thông tin, lợi ích và quyền riêng tư của đối tác và các bên liên quan – luôn luôn." },
  { icon: Heart, title: "Khách Hàng Là Trung Tâm", description: "Chúng tôi đặt khách hàng vào trung tâm mọi quyết định, tập trung vào niềm tin, sự minh bạch và tạo ra giá trị dài hạn." },
];

const philosophyPoints = [
  "Nhu cầu thị trường thực sự – khách hàng cần sản phẩm, không phải câu chuyện cần khách hàng",
  "Tiềm năng thương mại rõ ràng – con đường thực tế đến tăng trưởng có lợi nhuận",
  "Lãnh đạo có trách nhiệm – đội ngũ quản lý có năng lực và đạo đức",
  "Vận hành có thể mở rộng – khả năng tăng trưởng mà không gãy vỡ cấu trúc",
  "Lợi thế cạnh tranh bền vững – lý do doanh nghiệp chiến thắng và duy trì vị thế",
  "Thông tin tài chính minh bạch – con số sạch sẽ, trình bày trung thực",
  "Cơ hội tăng trưởng thực tế – tham vọng neo chặt trong bằng chứng cụ thể",
  "Sự liên kết giữa các bên liên quan – tất cả cùng chèo lái về một hướng",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      

      {/* Banner */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-white text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Reveal className="max-w-3xl mx-auto">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Về Chúng Tôi</p>
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-fortress-navy">Xây Dựng Để Bảo Vệ. </span>
              <span className="bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
                Định Vị Để Tăng Trưởng.
              </span>
            </h1>
            <p className="text-fortress-charcoal/70 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
              Fortress Investment Holdings kết hợp vốn kỷ luật, tư duy chiến lược và tầm nhìn dài hạn để xây dựng giá trị bền vững trong các doanh nghiệp, tài sản và thị trường được lựa chọn.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-12 md:py-20 bg-fortress-navy my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Về Fortress Investment Holdings</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">
              Nền Tảng Được Xây Dựng Vì Giá Trị Dài Hạn
            </h2>
            <p className="text-fortress-silver text-sm md:text-lg leading-relaxed">
              Fortress Investment Holdings là tập đoàn đầu tư đa ngành có trụ sở tại Dubai, UAE. Chúng tôi xác định các cơ hội đầu tư giá trị, đầu tư có trách nhiệm và hỗ trợ các doanh nghiệp có tiềm năng tăng trưởng bền vững thực sự.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 md:py-20 my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Stagger className="grid md:grid-cols-2 gap-6 md:gap-12">
            <StaggerItem className="bg-fortress-navy border border-fortress-gold/10 p-6 md:p-10 rounded-2xl">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-fortress-gold/10 flex items-center justify-center mb-4 md:mb-6 rounded-sm">
                <Eye className="w-6 h-6 md:w-7 md:h-7 text-fortress-gold" />
              </div>
              <p className="text-fortress-gold text-sm font-medium tracking-[4px] uppercase mb-3">Tầm Nhìn</p>
              <h3 className="text-lg md:text-2xl font-bold text-fortress-ivory mb-3 md:mb-4">Xây Dựng Tập Đoàn Đầu Tư Uy Tín Toàn Cầu, Lấy Khách Hàng Làm Trung Tâm</h3>
              <p className="text-fortress-silver text-sm md:text-base leading-relaxed">
                Tầm nhìn của chúng tôi là khẳng định Fortress Investment Holdings trở thành một tập đoàn đầu tư đa dạng, được tin cậy và được công nhận quốc tế – được xây dựng xung quanh sự tin tưởng của khách hàng, tăng trưởng kỷ luật và tạo ra giá trị dài hạn. Chúng tôi đo lường thành công bằng sức mạnh danh mục đầu tư và niềm tin chúng tôi xây dựng với mọi khách hàng và đối tác.
              </p>
            </StaggerItem>
            <StaggerItem className="bg-fortress-deep border border-fortress-gold/10 p-6 md:p-10 rounded-2xl">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-fortress-gold/10 flex items-center justify-center mb-4 md:mb-6 rounded-sm">
                <Target className="w-6 h-6 md:w-7 md:h-7 text-fortress-gold" />
              </div>
              <p className="text-fortress-gold text-sm font-medium tracking-[4px] uppercase mb-3">Sứ Mệnh</p>
              <h3 className="text-lg md:text-2xl font-bold text-fortress-ivory mb-3 md:mb-4">Đầu Tư Với Sức Mạnh. Phục Vụ Với Niềm Tin. Tạo Giá Trị Bền Vững.</h3>
              <p className="text-fortress-silver text-sm md:text-base leading-relaxed">
                Sứ mệnh của chúng tôi là xác định các cơ hội tiềm năng cao, triển khai vốn có trách nhiệm và hỗ trợ tăng trưởng bền vững thông qua sự tham gia chiến lược, quản trị mạnh mẽ và quan hệ đối tác dài hạn. Chúng tôi đặt khách hàng vào trung tâm mọi quyết định, tập trung vào sự minh bạch, niềm tin và kết quả địa chỉ giá trị.
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12 md:py-20 bg-fortress-deep my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-8 md:mb-12">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Ban Lãnh Đạo</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory">Lãnh Đạo Xây Dựng Trên Tầm Nhìn Và Trách Nhiệm</h2>
          </Reveal>
          <Stagger className="grid lg:grid-cols-2 gap-6 md:gap-12">
            <StaggerItem className="group bg-gradient-to-br from-fortress-navy to-fortress-charcoal border border-fortress-gold/10 p-6 md:p-10 rounded-2xl transition-all duration-500 hover:border-fortress-gold/40 hover:shadow-2xl hover:shadow-fortress-gold/10 hover:-translate-y-1">
              <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden rounded-lg">
                <Image src="/Azzam-El-Khatib.jpeg" alt="Azzam El-Khatib" fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-fortress-ivory mb-1 transition-colors duration-500 group-hover:text-fortress-gold">Azzam El-Khatib</h3>
              <p className="text-fortress-gold text-sm font-medium mb-4 md:mb-6">Founder and Chief Executive Officer</p>
              <div className="space-y-3 md:space-y-4 text-fortress-silver text-sm md:text-base leading-relaxed">
                <p>Azzam El-Khatib leads Fortress Investment Holdings with a strong commitment to disciplined growth, client service, and responsible investment management.</p>
                <p>With an extensive network across the UAE, GCC and international markets, Azzam plays a central role in building strategic relationships, identifying investment opportunities, and driving the company&rsquo;s long-term vision.</p>
                <p>His leadership is defined by discipline, accountability, and a client-first approach. He is committed to protecting clients&rsquo; interests, creating sustainable value, and delivering strong, well-considered returns on every investment.</p>
              </div>
            </StaggerItem>
            <StaggerItem className="group bg-gradient-to-br from-fortress-navy to-fortress-charcoal border border-fortress-gold/10 p-6 md:p-10 rounded-2xl transition-all duration-500 hover:border-fortress-gold/40 hover:shadow-2xl hover:shadow-fortress-gold/10 hover:-translate-y-1">
              <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden rounded-lg">
                <Image src="/Serhii-Pohrebniak.jpeg" alt="Serhii Pohrebniak" fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-fortress-ivory mb-1 transition-colors duration-500 group-hover:text-fortress-gold">Serhii Pohrebniak</h3>
              <p className="text-fortress-gold text-sm font-medium mb-4 md:mb-6">Business Strategist</p>
              <div className="space-y-3 md:space-y-4 text-fortress-silver text-sm md:text-base leading-relaxed">
                <p>Serhii Pohrebniak is a key member of Fortress Investment Holdings and one of the strategic minds behind the company&rsquo;s vision and direction. With a military background, he brings discipline, resilience, structure, and a strong sense of responsibility to every aspect of the business.</p>
                <p>His diverse life and business experiences allow him to approach challenges with clarity, practical thinking, and a long-term perspective. Serhii plays an important role in shaping business strategies, identifying opportunities, and supporting the company&rsquo;s growth.</p>
                <p>He strongly believes that meaningful goals are achieved through consistency, discipline, and focused action. This philosophy forms the foundation of his approach to both business and life.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-10 md:mb-16">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Giá Trị Cốt Lõi</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-navy">Nguyên Tắc Đằng Sau Mọi Quyết Định</h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {values.map((v) => (
              <StaggerItem key={v.title} className="bg-fortress-navy border border-fortress-gold/10 p-6 md:p-8 hover:border-fortress-gold/30 hover:shadow-xl hover:shadow-fortress-gold/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-fortress-gold/10 flex items-center justify-center mb-4 md:mb-5 rounded-sm">
                  <v.icon className="w-5 h-5 md:w-6 md:h-6 text-fortress-gold" />
                </div>
                <h3 className="text-fortress-ivory font-bold text-base md:text-lg mb-2 md:mb-3">{v.title}</h3>
                <p className="text-fortress-silver text-xs md:text-sm leading-relaxed">{v.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section className="py-12 md:py-20 bg-fortress-navy my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-8 md:mb-12">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Triết Lý Đầu Tư</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-3 md:mb-4">Vốn Kỷ Luật. Tăng Trưởng Chiến Lược.</h2>
            <p className="text-fortress-ivory/80 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
              Giá trị bền vững bắt đầu từ nền tảng cơ bản vững chắc. Tất cả mọi thứ khác chỉ là nhữ́ng làn sóng huyền ảo.
            </p>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
            {philosophyPoints.map((point, i) => (
              <StaggerItem key={i} className="p-4 md:p-5 bg-fortress-deep border border-fortress-gold/10 rounded-sm transition-all duration-300 hover:border-fortress-gold/30 hover:shadow-lg hover:shadow-fortress-gold/5 hover:-translate-y-0.5">
                <p className="text-fortress-silver text-xs md:text-sm leading-relaxed">{point}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      
    </main>
  );
}
