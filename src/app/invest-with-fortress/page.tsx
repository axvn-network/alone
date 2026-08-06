import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestorForm from "@/components/InvestorForm";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hợp Tác Đầu Tư | Fortress Investment Holdings",
  description:
    "Hợp tác đầu tư cùng Fortress Investment Holdings. Phân bổ nguồn vốn hiệu quả vào các cơ hội chọn lọc tại UAE và quốc tế với quy trình quản trị rủi ro kỷ luật.",
  openGraph: {
    title: "Hợp Tác Đầu Tư | Fortress Investment Holdings",
    description:
      "Nguồn vốn của bạn xứng đáng được quản trị bằng sự kỷ luật, cơ hội vượt trội và giá trị bền vững.",
  },
};

const investmentCards = [
  "Truy Cập Danh Mục Đầu Tư Đa Ngành",
  "Quy Trình Thẩm Định Nghiêm Ngặt",
  "Phân Bổ Vốn Chiến Lược Tối Ưu",
  "Quản Trị Đầu Tư Chủ Động",
  "Quyết Định Dựa Trên Quản Trị Rủi Ro",
  "Kiến Tạo Giá Trị Bền Vững Dài Hạn",
];

const sectorCards = [
  "Bất Động Sản",
  "Thâu Tóm Doanh Nghiệp (M&A)",
  "Đầu Tư Tư Nhân (Private Equity)",
  "Công Nghệ AI & Đột Phá",
  "Khách Sạn & Nghỉ Dưỡng",
  "Tài Sản Số & Blockchain",
  "Năng Lượng & Hàng Hóa",
  "Tài Sản Sang Trọng",
  "Liên Doanh Chiến Lược",
];

const modelSteps = [
  {
    title: "Hiểu Rõ Mục Tiêu Của Bạn",
    body: "Mọi mối quan hệ hợp tác đều bắt đầu từ bạn. Chúng tôi xác định rõ ưu tiên, quy mô vốn, lĩnh vực quan tâm, thời hạn và khẩu vị rủi ro trước khi đưa ra quyết định.",
  },
  {
    title: "Xác Định Chiến Lược Đầu Tư",
    body: "Chuyển hóa mục tiêu của bạn thành phương pháp tiếp cận đầu tư rõ ràng, được thống nhất, cam kết và tuân thủ xuyên suốt quá trình.",
  },
  {
    title: "Tìm Kiếm Cơ Hội Chất Lượng",
    body: "Tìm kiếm các doanh nghiệp, dự án và tài sản tiềm năng thông qua mạng lưới uy tín, chỉ theo đuổi các dự án đạt tiêu chuẩn khắt khe.",
  },
  {
    title: "Thẩm Định Chuyên Sâu (Due Diligence)",
    body: "Đánh giá chi tiết các yếu tố tài chính, rủi ro, pháp lý và năng lực thực thi trước khi giải ngân vốn.",
  },
  {
    title: "Cấu Trúc Và Giải Ngân Vốn",
    body: "Khoản đầu tư được cấu trúc nhằm tối ưu lợi ích và bảo vệ vị thế của bạn, giải ngân vào các cơ hội đã qua phê duyệt.",
  },
  {
    title: "Quản Lý, Giám Sát & Báo Cáo",
    body: "Sự đồng hành của chúng tôi không dừng lại sau khi giải ngân. Chúng tôi liên tục giám sát hiệu quả và chịu trách nhiệm cho tăng trưởng dài hạn.",
  },
];

const featureList = [
  "Định Hướng Chiến Lược",
  "Hỗ Trợ Quản Trị Doanh Nghiệp",
  "Phát Triển Thương Mại",
  "Giám Sát Vận Hành",
  "Mở Rộng Thị Trường Quốc Tế",
  "Giám Sát Hiệu Quả Đầu Tư",
];

const investorTypes = [
  "Nhà Đầu Tư Cá Nhân",
  "Cá Nhân Có Tài Sản Lớn (HNWI)",
  "Family Offices",
  "Doanh Nghiệp Đầu Tư",
  "Định Chế Tài Chính",
  "Quỹ Đầu Tư Định Chế",
];

const capitalTypes = [
  "Đầu Tư Trực Tiếp",
  "Phân Bổ Vốn Đa Dạng",
  "Đồng Đầu Tư (Co-Investment)",
  "Đầu Tư Theo Dự Án",
  "Đầu Tư Ngành Cụ Thể",
  "Góp Vốn Tăng Trưởng Dài Hạn",
];

export default function InvestWithFortressPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-white text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Hợp Tác Đầu Tư Cùng Fortress</p>
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-fortress-navy">Nguồn Vốn Xứng Đáng Được Quản Trị Bằng<br />Kỷ Luật &amp;<br /></span>
              <span className="bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
                Giá Trị Bền Vững.
              </span>
            </h1>
            <p className="text-fortress-charcoal/70 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
              Fortress Investment Holdings đồng hành cùng các nhà đầu tư để phân bổ vốn vào các cơ hội được lựa chọn kỹ lưỡng tại UAE và quốc tế. Chúng tôi tìm kiếm, thẩm định, cấu trúc và quản trị nguồn vốn với sự tập trung kỷ luật vào việc kiểm soát rủi ro và gia tăng giá trị.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-xs md:text-sm tracking-widest hover:shadow-2xl hover:shadow-fortress-gold/25 transition-all duration-300 rounded-sm"
              >
                Gửi Đề Xuất Đầu Tư
              </a>
              <a
                href="#sectors"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 border border-fortress-gold text-fortress-gold font-bold text-xs md:text-sm tracking-widest hover:bg-fortress-gold/10 transition-all duration-300 rounded-sm"
              >
                Khám Phá Lĩnh Vực Đầu Tư
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-12 md:py-20 bg-fortress-navy my-8 md:my-12 sm:mx-4 rounded-2xl" id="invest">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Dành Cho Nhà Đầu Tư</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">Nguồn Vốn Của Bạn. Kỷ Luật Của Chúng Tôi. Cam Kết Tăng Trưởng Bền Vững.</h2>
            <p className="text-fortress-silver text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              Khi bạn đầu tư cùng Fortress, nguồn vốn chỉ được giải ngân sau khi chúng tôi đã thấu hiểu rõ mục tiêu, khẩu vị rủi ro và kỳ vọng của bạn. Từ đó xây dựng một chiến lược tối ưu nhất.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {investmentCards.map((item, i) => (
              <div key={i} className="p-4 md:p-5 bg-fortress-deep border border-fortress-gold/10 rounded-sm">
                <p className="text-fortress-silver text-xs md:text-sm leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diversified Investment Access */}
      <section className="py-12 md:py-20 my-8 md:my-12 sm:mx-4 rounded-2xl bg-white" id="sectors">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Đa Dạng Hóa Danh Mục Đầu Tư</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-navy mb-4 md:mb-6">Một Mối Quan Hệ. Tiếp Cận Đa Dạng Lớp Tài Sản.</h2>
            <p className="text-fortress-charcoal/70 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              Đa dạng hóa giúp nhà đầu tư quản trị rủi ro tập trung và mở rộng cơ hội trên nhiều ngành nghề. Thông qua hợp tác với Fortress, bạn tiếp cận các lĩnh vực giàu tiềm năng tăng trưởng.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {sectorCards.map((item, i) => (
              <div key={i} className="p-4 md:p-5 bg-fortress-navy border border-fortress-gold/10 rounded-sm">
                <p className="text-fortress-silver text-xs md:text-sm leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Fortress Investment Model */}
      <section className="py-12 md:py-20 bg-fortress-deep my-8 md:my-12 sm:mx-4 rounded-2xl" id="model">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Mô Hình Đầu Tư Fortress</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">Hành Trình Kỷ Luật Từ Cam Kết Đến Giá Trị</h2>
            <p className="text-fortress-ivory/80 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              Đầu tư thành công dựa trên một quy trình chặt chẽ. Mọi quyết định tại Fortress đều đi qua 6 giai đoạn thẩm định và quản trị rủi ro khoa học.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {modelSteps.map((step, i) => (
              <div key={i} className="p-5 md:p-6 bg-fortress-navy border border-fortress-gold/20 rounded-sm">
                <span className="text-fortress-gold text-[10px] md:text-xs font-medium tracking-[3px] uppercase block mb-3 md:mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-fortress-ivory text-sm md:text-base font-bold mb-2">{step.title}</h3>
                <p className="text-fortress-silver/80 text-xs md:text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Investment Management */}
      <section className="py-12 md:py-20 my-8 md:my-12 sm:mx-4 rounded-2xl bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-16 items-center">
            <div className="lg:col-span-2">
              <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Quản Trị Đầu Tư Chủ Động</p>
              <h2 className="text-xl md:text-4xl font-bold text-fortress-navy mb-4 md:mb-6">Chúng Tôi Không Chỉ Giải Ngân. Chúng Tôi Đồng Hành Trực Tiếp.</h2>
              <p className="text-fortress-charcoal/70 text-sm md:text-base leading-relaxed mb-4">
                Không giống như các đơn vị chỉ phân bổ vốn rồi đứng ngoài, Fortress trực tiếp tham gia hỗ trợ chiến lược, quản trị doanh nghiệp và mở rộng quy mô.
              </p>
            </div>
            <div className="lg:col-span-3 bg-fortress-navy p-6 md:p-10 rounded-2xl">
              <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Cách Chúng Tôi Gia Tăng Giá Trị</p>
              <h2 className="text-xl md:text-3xl font-bold text-fortress-ivory mb-6 md:mb-8">Đồng Hành Xuyên Suốt Vòng Đời Đầu Tư</h2>
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                {featureList.map((item, i) => (
                  <div key={i} className="p-4 md:p-5 bg-fortress-deep border border-fortress-gold/10 rounded-sm">
                    <p className="text-fortress-ivory text-xs md:text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-20 bg-white my-8 md:my-12 sm:mx-4 rounded-2xl" id="enquiry">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-16">
            <div className="lg:col-span-2">
              <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Gửi Yêu Cầu Hợp Tác</p>
              <h2 className="text-xl md:text-4xl font-bold text-fortress-navy mb-4 md:mb-6">Bắt Đầu Thảo Luận Cùng Fortress</h2>
              <p className="text-fortress-charcoal/70 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                Chia sẻ thông tin và kỳ vọng của bạn dưới đây. Đội ngũ chuyên gia sẽ thẩm định và phản hồi trong 2-3 ngày làm việc với cam kết bảo mật cao nhất.
              </p>
              <div className="space-y-3 md:space-y-4">
                {[
                  "Bảo mật tuyệt đối mọi thông tin cung cấp",
                  "Thẩm định trực tiếp bởi đội ngũ chuyên gia",
                  "Không phát sinh nghĩa vụ ràng buộc ở bước tư vấn",
                  "Phản hồi cá nhân hóa trong 2–3 ngày làm việc",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-fortress-gold flex-shrink-0" />
                    <span className="text-fortress-charcoal/60 text-xs md:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-fortress-navy border border-fortress-gold/10 p-6 md:p-10 rounded-2xl">
                <InvestorForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confidentiality Note */}
      <section className="py-12 md:py-20 bg-fortress-navy my-8 md:my-12 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">Cam Kết Bảo Mật</p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">Thông Tin Của Bạn Được Bảo Vệ An Toàn</h2>
            <p className="text-fortress-silver text-sm md:text-base leading-relaxed">
              Mọi dữ liệu gửi qua website đều chỉ được sử dụng cho mục đích đánh giá cơ hội đầu tư. Chúng tôi tuân thủ nghiêm ngặt nguyên tắc bảo mật và quyền riêng tư của khách hàng.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

