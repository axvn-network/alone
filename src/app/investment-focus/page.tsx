import Image from "next/image";
import {
  TrendingUp,
  Wifi,
  BookOpen,
  Layers,
  ShoppingCart,
  Handshake,
  Coins,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lĩnh Vực Đầu Tư",
  description:
    "Khám phá các lĩnh vực đầu tư chiến lược của Fortress Investment Holdings: Dịch vụ tài sản mã hóa hợp pháp, FinTech, Công nghệ AI, EdTech, Blockchain và Kinh tế số — phù hợp với Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025.",
  openGraph: {
    title: "Lĩnh Vực Đầu Tư | Fortress Investment Holdings",
    description:
      "Đầu tư vào FinTech, tài sản mã hóa hợp pháp, AI và kinh tế số tại Việt Nam — bám sát Nghị quyết 5/2025/NQ-CP.",
  },
};

const sectors = [
  {
    id: "crypto-asset-services",
    icon: Coins,
    title: "Dịch Vụ Tài Sản Mã Hóa (Có Cấp Phép)",
    subtitle: "Tiên Phong Trên Thị Trường Thí Điểm Tài Sản Mã Hóa Hợp Pháp Của Việt Nam",
    image: "/2.png",
    body: "Nghị quyết 5/2025/NQ-CP có hiệu lực từ ngày 9/9/2025 đánh dấu bước ngoặt lịch sử: Việt Nam chính thức cho phép thí điểm giao dịch tài sản mã hóa hợp pháp trong vòng 5 năm. Đây là cửa sổ cơ hội tiên phong hiếm có cho các nhà đầu tư và doanh nghiệp có tầm nhìn.\n\nFortress Investment Holdings định vị sớm để đồng hành cùng các tổ chức cung cấp dịch vụ tài sản mã hóa được Bộ Tài chính cấp phép — từ tổ chức thị trường giao dịch, lưu ký, phát hành đến tự doanh tài sản mã hóa — trong một thị trường được quản lý chặt chẽ, minh bạch và bền vững.",
    items: [
      { heading: "Tổ Chức Thị Trường Giao Dịch Tài Sản Mã Hóa", desc: "Đầu tư vào các nền tảng được cấp phép cung cấp hạ tầng trao đổi, khớp lệnh mua/bán và thanh toán tài sản mã hóa theo Điều 3 NQ5/2025." },
      { heading: "Dịch Vụ Lưu Ký Tài Sản Mã Hóa", desc: "Hỗ trợ xây dựng và đầu tư vào các tổ chức lưu ký tài sản mã hóa an toàn, tuân thủ tiêu chuẩn bảo mật quốc tế." },
      { heading: "Nền Tảng Phát Hành Tài Sản Mã Hóa", desc: "Đầu tư vào các doanh nghiệp xây dựng hạ tầng phát hành tài sản mã hóa dựa trên tài sản cơ sở thực, theo điều kiện NQ5/2025." },
      { heading: "Tự Doanh Tài Sản Mã Hóa", desc: "Các doanh nghiệp được cấp phép thực hiện hoạt động tự doanh tài sản mã hóa trong khuôn khổ pháp lý được Bộ Tài chính quản lý." },
      { heading: "Mã Hóa Tài Sản Thực (Tokenisation)", desc: "Nền tảng mã hóa tài sản vật lý như bất động sản, hàng hóa, quỹ đầu tư thành tài sản mã hóa được pháp luật công nhận." },
      { heading: "Tuân Thủ Pháp Lý & Quản Trị Rủi Ro", desc: "Hỗ trợ doanh nghiệp xây dựng hệ thống tuân thủ, kiểm soát nội bộ và quản trị rủi ro đáp ứng yêu cầu cấp phép của Bộ Tài chính." },
    ],
    subheading: "Khung Pháp Lý Theo Nghị Quyết 5/2025/NQ-CP",
    subitems: [
      "Có hiệu lực từ ngày 9/9/2025 — thí điểm trong vòng 5 năm",
      "Nhà đầu tư trong nước được mở tài khoản tại tổ chức cung cấp dịch vụ được Bộ Tài chính cấp phép để lưu ký, mua, bán tài sản mã hóa",
      "Nhà đầu tư nước ngoài được phép giao dịch tài sản mã hóa tại Việt Nam qua các tổ chức được cấp phép",
      "Tổ chức phát hành tài sản mã hóa phải là doanh nghiệp Việt Nam — TNHH hoặc Cổ phần theo Luật Doanh nghiệp",
      "Tài sản mã hóa phải dựa trên tài sản cơ sở thực (không bao gồm chứng khoán, tiền pháp định)",
      "Sau 6 tháng kể từ khi tổ chức đầu tiên được cấp phép, giao dịch ngoài khuôn khổ sẽ bị xử lý vi phạm",
    ],
    disclaimer:
      "Fortress Investment Holdings không khuyến khích đầu cơ ngắn hạn. Mọi hoạt động đầu tư liên quan đến tài sản mã hóa phải tuân thủ quy định pháp luật hiện hành.",
    closing:
      "Đây là thời điểm vàng để định vị sớm trong thị trường tài sản mã hóa hợp pháp đầu tiên của Việt Nam. Fortress đồng hành cùng doanh nghiệp và nhà đầu tư tận dụng cửa sổ pháp lý lịch sử 5 năm này — với sự thận trọng, tuân thủ và tầm nhìn dài hạn.",
  },
  {
    id: "fintech-payments",
    icon: TrendingUp,
    title: "FinTech & Thanh Toán Số",
    subtitle: "Hạ Tầng Tài Chính Số Cho Thị Trường 100 Triệu Người",
    image: "/3.png",
    body: "Việt Nam có trên 78 triệu người dùng internet, tỷ lệ thanh toán số tăng trưởng mạnh mẽ và thị trường tài chính với hàng triệu người chưa được phục vụ đầy đủ — tạo ra nền tảng lý tưởng cho FinTech.\n\nFortress đầu tư vào các doanh nghiệp FinTech xây dựng hạ tầng tài chính số thiết thực, giải quyết nhu cầu thực của thị trường Việt Nam và tích hợp tự nhiên vào hệ sinh thái tài sản mã hóa đang hình thành.",
    items: [
      { heading: "Hạ Tầng Thanh Toán Số", desc: "Cổng thanh toán, ví điện tử, QR code và giải pháp thanh toán không tiền mặt tích hợp sâu vào hành vi tiêu dùng Việt Nam." },
      { heading: "Cho Vay Số & Tín Dụng Thay Thế", desc: "Nền tảng cho vay P2P, cho vay doanh nghiệp nhỏ và tín dụng thay thế cho phân khúc chưa tiếp cận được ngân hàng truyền thống." },
      { heading: "Bảo Hiểm Công Nghệ (InsurTech)", desc: "Sản phẩm bảo hiểm số, micro-insurance và bảo hiểm nhúng tích hợp vào nền tảng thương mại điện tử và dịch vụ số." },
      { heading: "Quản Lý Tài Sản Cá Nhân (WealthTech)", desc: "Ứng dụng đầu tư tự động, robo-advisor và nền tảng quản lý danh mục cho nhà đầu tư cá nhân tại Việt Nam." },
      { heading: "Hạ Tầng Thanh Toán Tài Sản Mã Hóa", desc: "Giải pháp thanh toán tích hợp stablecoin, USDT và tài sản mã hóa được cấp phép cho thương mại điện tử và dịch vụ số." },
      { heading: "RegTech & Tuân Thủ Tự Động", desc: "Công nghệ KYC/AML tự động, giám sát giao dịch và tuân thủ pháp lý cho các tổ chức tài chính và FinTech." },
    ],
    closing:
      "Chúng tôi ưu tiên các doanh nghiệp FinTech có mô hình doanh thu rõ ràng, đội ngũ am hiểu thị trường Việt Nam và khả năng tích hợp vào hệ sinh thái tài sản mã hóa hợp pháp đang hình thành từ 9/9/2025.",
  },
  {
    id: "ai-technology",
    icon: Wifi,
    title: "Công Nghệ AI & Đột Phá",
    subtitle: "Trọng Tâm Chiến Lược — Việt Nam, Đông Nam Á & Toàn Cầu",
    image: "/6.png",
    body: "Công nghệ AI là một trong các trọng tâm đầu tư hàng đầu của Fortress. Việt Nam — với hơn 78 triệu người dùng internet, tốc độ tăng trưởng thương mại điện tử hàng đầu Đông Nam Á và hệ sinh thái startup công nghệ năng động — là thị trường chiến lược mà chúng tôi cam kết đầu tư dài hạn.\n\nChúng tôi không chạy theo xu hướng. Chúng tôi đầu tư vào các doanh nghiệp công nghệ giải quyết vấn đề thực tiễn, có mô hình doanh thu rõ ràng và đội ngũ sáng lập đủ năng lực để mở rộng quy mô.",
    items: [
      { heading: "Trí Tuệ Nhân Tạo (AI)", desc: "Nền tảng AI, hệ thống tự động hóa, machine learning và công cụ thông minh ứng dụng thực tiễn trong doanh nghiệp Việt Nam và khu vực." },
      { heading: "SaaS & Phần Mềm Đóng Gói", desc: "Sản phẩm phần mềm có thể mở rộng với mô hình doanh thu định kỳ (subscription), chi phí thấp và biên lợi nhuận cao." },
      { heading: "AI Ứng Dụng Trong FinTech & Crypto", desc: "AI phân tích rủi ro tín dụng, phát hiện gian lận, phân tích giá tài sản mã hóa và giám sát tuân thủ tự động." },
      { heading: "Tự Động Hóa & Chuyển Đổi Số", desc: "Công nghệ giúp doanh nghiệp truyền thống số hóa quy trình, tăng năng suất và giảm chi phí vận hành đáng kể." },
      { heading: "Phân Tích Dữ Liệu & Business Intelligence", desc: "Nền tảng chuyển đổi dữ liệu thành thông tin chiến lược, hỗ trợ doanh nghiệp ra quyết định chính xác và nhanh hơn." },
      { heading: "Thương Mại Điện Tử & Marketplace", desc: "Nền tảng thương mại điện tử, marketplace ngành dọc và doanh nghiệp bán lẻ dựa trên công nghệ với lộ trình tăng trưởng rõ ràng." },
    ],
    closing:
      "Chúng tôi đặc biệt quan tâm đến các startup và doanh nghiệp công nghệ tại Việt Nam đang tìm kiếm nguồn vốn tăng trưởng, đối tác chiến lược quốc tế và hỗ trợ mở rộng thị trường. Nếu bạn đang xây dựng thứ gì đó thực sự có giá trị — hãy nói chuyện với chúng tôi.",
  },
  {
    id: "edtech",
    icon: BookOpen,
    title: "Công Nghệ Giáo Dục (EdTech)",
    subtitle: "Xây Dựng Nguồn Nhân Lực Số Cho Kỷ Nguyên Tài Sản Mã Hóa",
    image: "/4.png",
    body: "Với hơn 100 triệu dân, tỷ lệ phổ cập internet cao và văn hóa đề cao học tập, Việt Nam là một trong những thị trường EdTech hấp dẫn nhất Đông Nam Á.\n\nSự ra đời của thị trường tài sản mã hóa hợp pháp từ 9/9/2025 tạo ra nhu cầu đào tạo khổng lồ — từ kiến thức tài chính số cơ bản cho nhà đầu tư cá nhân đến đào tạo chuyên sâu blockchain, FinTech và quản trị tài sản số cho chuyên gia.",
    items: [
      { heading: "Nền Tảng Học Trực Tuyến (E-Learning)", desc: "LMS, MOOC và ứng dụng học tập thích ứng phục vụ sinh viên, người đi làm và doanh nghiệp tại Việt Nam." },
      { heading: "Đào Tạo Tài Chính Số & Blockchain", desc: "Chương trình giáo dục tài chính số, blockchain, crypto và quản lý tài sản mã hóa dành cho nhà đầu tư cá nhân và tổ chức." },
      { heading: "Phát Triển Kỹ Năng Công Nghệ", desc: "Đào tạo lập trình, AI, data science, cybersecurity và các kỹ năng số cần thiết cho nền kinh tế số." },
      { heading: "Chứng Chỉ Chuyên Môn & Đào Tạo Doanh Nghiệp", desc: "Chương trình chứng chỉ nghề nghiệp, đào tạo nội bộ doanh nghiệp và phát triển kỹ năng lãnh đạo số." },
      { heading: "EdTech Cho Trẻ Em & Phổ Thông", desc: "Giáo dục STEM, lập trình cho thiếu nhi và nền tảng bổ trợ học tập phổ thông tích hợp công nghệ AI." },
      { heading: "Nền Tảng Đào Tạo Nghề & Kết Nối Việc Làm", desc: "HRTech và WORKTech kết nối đào tạo nghề với nhu cầu tuyển dụng thực tế, đặc biệt trong lĩnh vực kinh tế số." },
    ],
    closing:
      "Chúng tôi đặc biệt quan tâm đến các nền tảng EdTech tập trung vào kỹ năng số, tài chính số và kiến thức blockchain — lĩnh vực sẽ bùng nổ nhu cầu khi thị trường tài sản mã hóa Việt Nam chính thức đi vào hoạt động hợp pháp.",
  },
  {
    id: "blockchain-infrastructure",
    icon: Layers,
    title: "Hạ Tầng Blockchain",
    subtitle: "Nền Tảng Kỹ Thuật Cho Nền Kinh Tế Tài Sản Mã Hóa",
    image: "/5.png",
    body: "Sự phát triển của thị trường tài sản mã hóa hợp pháp tại Việt Nam đòi hỏi hạ tầng blockchain vững chắc, an toàn và có khả năng mở rộng.\n\nFortress đầu tư vào các công ty xây dựng hạ tầng kỹ thuật thiết yếu — từ mạng lưới blockchain cấp doanh nghiệp đến các giao thức bảo mật, hợp đồng thông minh và giải pháp tương tác liên chuỗi — tạo nền tảng cho hệ sinh thái tài sản mã hóa Việt Nam.",
    items: [
      "Mạng Lưới Blockchain Cấp Doanh Nghiệp: blockchain riêng, consortium và các giải pháp Layer-2 tối ưu hiệu suất cho dịch vụ tài chính",
      "Hợp Đồng Thông Minh & DApps: nền tảng tự động hóa quy trình tài chính, phát hành tài sản mã hóa và thực thi điều khoản pháp lý",
      "Bảo Mật & Kiểm Tra Mã Nguồn: dịch vụ audit smart contract, penetration testing và giải pháp bảo mật blockchain",
      "Hạ Tầng Tương Tác Liên Chuỗi (Interoperability): giải pháp kết nối đa blockchain, bridge protocol và tiêu chuẩn tương tác",
      "Công Nghệ Lưu Ký & Khóa Mã Hóa: HSM, multi-signature và giải pháp quản lý khóa mật mã an toàn cấp tổ chức",
      "Phân Tích & Giám Sát On-Chain: công cụ phân tích dữ liệu blockchain phục vụ tuân thủ AML/KYC và giám sát thị trường",
    ],
    closing:
      "Với sự ra đời của khung pháp lý tài sản mã hóa tại Việt Nam, nhu cầu hạ tầng blockchain đáng tin cậy, được kiểm chứng và tuân thủ sẽ tăng trưởng mạnh mẽ trong 5 năm thí điểm.",
  },
  {
    id: "digital-economy",
    icon: ShoppingCart,
    title: "Kinh Tế Số & Thương Mại Điện Tử",
    subtitle: "Đầu Tư Vào Hạ Tầng Nền Tảng Của Kinh Tế Số Việt Nam",
    image: "/7.png",
    body: "Kinh tế số Việt Nam đang tăng trưởng với tốc độ hàng đầu Đông Nam Á — thương mại điện tử, nội dung số, dịch vụ trực tuyến và hạ tầng logistics số tất cả đều đang trong giai đoạn mở rộng mạnh mẽ.\n\nFortress đầu tư vào các doanh nghiệp xây dựng hạ tầng nền tảng và mô hình kinh doanh bền vững trong kinh tế số — những doanh nghiệp tạo ra giá trị thực và có lộ trình tích hợp với hệ sinh thái tài sản số đang hình thành.",
    items: [
      { heading: "Sàn Thương Mại Điện Tử & Marketplace", desc: "Nền tảng B2B, B2C và marketplace ngành dọc với mô hình doanh thu rõ ràng và đội ngũ vận hành có kinh nghiệm." },
      { heading: "Hạ Tầng Logistics & Chuỗi Cung Ứng Số", desc: "Công nghệ tối ưu hóa vận chuyển, quản lý kho bãi, theo dõi đơn hàng và tích hợp nhà bán/người mua trên nền tảng số." },
      { heading: "Nội Dung Số & Truyền Thông Kỹ Thuật Số", desc: "Media tech, content platforms, streaming và nền tảng sáng tạo nội dung với mô hình kiếm tiền số bền vững." },
      { heading: "SaaS & Công Cụ Kinh Doanh Số", desc: "Phần mềm quản lý doanh nghiệp, CRM, ERP và công cụ số hóa vận hành cho SME Việt Nam." },
      { heading: "Hạ Tầng Dữ Liệu & Điện Toán Đám Mây", desc: "Trung tâm dữ liệu, cloud infrastructure và dịch vụ lưu trữ dữ liệu phục vụ nhu cầu số hóa của doanh nghiệp Việt Nam." },
      { heading: "Thanh Toán Tích Hợp & Super Apps", desc: "Ứng dụng siêu tổng hợp kết hợp thương mại điện tử, thanh toán, dịch vụ tài chính và tài sản mã hóa trong một hệ sinh thái." },
    ],
    closing:
      "Chúng tôi tập trung vào các doanh nghiệp kinh tế số có nền tảng công nghệ vững chắc, mô hình doanh thu đã được kiểm chứng và khả năng mở rộng sang thị trường khu vực Đông Nam Á.",
  },
  {
    id: "private-equity",
    icon: TrendingUp,
    title: "Đầu Tư Tư Nhân (Private Equity) & Vốn Tăng Trưởng",
    subtitle: "Đồng Hành Cùng Startup & Doanh Nghiệp Tăng Trưởng Cao Trong Kỷ Nguyên Số",
    image: "/9.png",
    body: "Việt Nam đang sản sinh ra thế hệ doanh nghiệp tư nhân mạnh mẽ tiếp theo, đặc biệt trong các lĩnh vực FinTech, công nghệ và kinh tế số. Chúng tôi tìm kiếm và đồng hành cùng các startup công nghệ, doanh nghiệp FinTech tăng trưởng nhanh và công ty tiềm năng đang cần nguồn vốn thông minh và đối tác chiến lược để bứt phá.",
    items: [
      "Vốn tăng trưởng — tài trợ mở rộng quy mô, phát triển sản phẩm và gia nhập thị trường mới trong và ngoài Việt Nam",
      "Hỗ trợ chiến lược — định hướng sản phẩm, chiến lược go-to-market và dẫn dắt thương mại cấp hội đồng quản trị",
      "Kết nối toàn cầu — mở ra mạng lưới đối tác, khách hàng và nhà đầu tư tại UAE, Đông Nam Á và quốc tế",
      "Hướng dẫn quản trị — xây dựng cấu trúc công ty đủ chuẩn để thu hút vốn các vòng tiếp theo",
      "Hỗ trợ pháp lý — tư vấn điều hướng khung pháp lý tài sản mã hóa và FinTech tại Việt Nam",
      "Hỗ trợ vận hành thực chất — từ tuyển dụng, tài chính đến xây dựng thương hiệu và mở rộng thị trường",
    ],
    closing:
      "Chúng tôi đầu tư vào con người trước, sản phẩm sau. Mục tiêu rõ ràng: cùng người sáng lập kiến tạo giá trị thực — không phải tạo ra giá trị bằng cách tổn hại họ. Nếu bạn đang xây dựng doanh nghiệp tăng trưởng cao tại Việt Nam, hãy liên hệ với chúng tôi.",
  },
  {
    id: "strategic-investment-management",
    icon: Handshake,
    title: "Quản Lý Đầu Tư Chiến Lược",
    subtitle: "Phân Bổ Vốn Kỷ Luật. Kiến Tạo Giá Trị Bền Vững.",
    image: "/8.png",
    body: "Chúng tôi xác định và quản lý các cơ hội đầu tư được lựa chọn kỹ lưỡng trong lĩnh vực FinTech, tài sản mã hóa và kinh tế số — với trọng tâm kỷ luật vào quản lý rủi ro, tiềm năng thu nhập và tăng trưởng vốn dài hạn.\n\nPhương pháp tiếp cận của chúng tôi được thiết kế dành cho các nhà đầu tư tìm kiếm sự tham gia được quản lý chuyên nghiệp vào hệ sinh thái tài sản số và kinh tế kỹ thuật số Việt Nam.",
    items: [
      { heading: "Phân Bổ Đầu Tư Đa Dạng", desc: "Phân bổ vốn trên các lĩnh vực FinTech, crypto, AI và EdTech để tạo danh mục đầu tư cân bằng và tối ưu hóa rủi ro-lợi nhuận." },
      { heading: "Liên Doanh & Đồng Đầu Tư", desc: "Hợp tác với các đối tác định chế tài chính uy tín cho các cơ hội đầu tư quy mô lớn trong kinh tế số." },
      { heading: "Quỹ Đầu Tư Chuyên Biệt", desc: "Xây dựng và quản lý các quỹ đầu tư tập trung vào FinTech và tài sản số tại Việt Nam và Đông Nam Á." },
      { heading: "Cơ Hội Thị Trường Tư Nhân", desc: "Tiếp cận các cơ hội đầu tư đã được thẩm định kỹ lưỡng ngoài thị trường đại chúng trong lĩnh vực công nghệ và tài sản số." },
    ],
    closing: "",
  },
];

export default function InvestmentFocusPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      {/* Banner */}
      <PageHero
        tag="Lĩnh Vực Đầu Tư"
        heading={
          <>
            Đầu Tư Vào{" "}
            <span className="font-bold bg-gradient-to-r from-gvi-gold to-gvi-champagne bg-clip-text text-transparent">
              Kinh Tế Số
            </span>
          </>
        }
        description="Fortress Investment Holdings đặt FinTech, tài sản mã hóa hợp pháp và kinh tế số Việt Nam là trọng tâm chiến lược — tiên phong đón đầu Nghị quyết 5/2025/NQ-CP có hiệu lực từ 9/9/2025."
      />

      {/* Introduction */}
      <section className="bg-gvi-navy rounded-2xl section-mx section-my" style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}>
        <div className="max-w-[1400px] mx-auto section-px">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-px bg-gvi-gold/55" />
              <span className="section-tag">Danh Mục Đầu Tư Công Nghệ & Tài Sản Số</span>
            </div>
            <h2
              className="font-light text-gvi-ivory mb-6 leading-[1.28] uppercase"
              style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
            >
              Các Lĩnh Vực Chiến Lược
            </h2>
            <p className="text-gvi-silver/80 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Nghị quyết 5/2025/NQ-CP có hiệu lực từ ngày 9/9/2025 mở ra kỷ nguyên mới cho thị trường tài sản mã hóa hợp pháp tại Việt Nam — một cột mốc lịch sử tạo ra cơ hội tiên phong cho các nhà đầu tư và doanh nghiệp có tầm nhìn.
            </p>
            <p className="text-gvi-silver/70 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Fortress Investment Holdings định vị tập trung vào FinTech, dịch vụ tài sản mã hóa, blockchain, EdTech và kinh tế số — những lĩnh vực đang hội tụ để tạo ra hệ sinh thái tài chính số hoàn toàn mới tại Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Sector Sections */}
      {sectors.map((sector, index) => (
        <section
          key={sector.title}
          id={sector.id}
          className={`rounded-2xl section-mx section-my ${index % 2 === 1 ? "bg-gvi-deep" : "bg-white"}`}
          style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
        >
          <div className="max-w-[1400px] mx-auto section-px">
            {/* Header */}
            <div className="flex items-start gap-4 md:gap-5 mb-8 md:mb-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gvi-gold/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                <sector.icon className="w-5 h-5 md:w-7 md:h-7 text-gvi-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-gvi-gold/50 text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-1">
                  Lĩnh Vực {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  className={`text-xl md:text-4xl font-bold mb-1 break-words ${index % 2 === 1 ? "text-gvi-ivory" : "text-gvi-navy"}`}
                >
                  {sector.title}
                </h2>
                <p className="text-gvi-gold text-sm md:text-lg">
                  {sector.subtitle}
                </p>
              </div>
            </div>

            {/* Image + Content Grid */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-start">
              {/* Image */}
              <div
                className={`lg:col-span-2 ${index % 2 === 0 ? "lg:order-last" : ""}`}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden border rounded-sm ${index % 2 === 1 ? "border-gvi-gold/10" : "border-gvi-gold/20"}`}
                >
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${index % 2 === 1 ? "from-gvi-deep/40" : "from-white/40"} to-transparent`}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                {sector.body.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className={`text-sm md:text-base leading-relaxed mb-4 md:mb-5 last:mb-0 ${index % 2 === 1 ? "text-gvi-silver" : "text-gvi-charcoal/70"}`}
                  >
                    {para}
                  </p>
                ))}

                {/* Investment areas list */}
                <div className="mt-6 md:mt-8">
                  <p className="text-gvi-gold text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-3 md:mb-4">
                    Trọng Tâm Đầu Tư
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {sector.items.map((item, i) => (
                      <li key={i}>
                        {typeof item === "string" ? (
                          <div className={`flex items-start gap-3 p-3 border-l-2 border-gvi-gold/30 ${index % 2 === 1 ? "bg-gvi-navy/60" : "bg-gvi-ivory/40"} rounded-sm`}>
                            <span className="mt-1 text-gvi-gold text-[10px] font-mono font-bold shrink-0 select-none">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={`text-xs md:text-sm leading-relaxed ${index % 2 === 1 ? "text-gvi-silver/80" : "text-gvi-charcoal/60"}`}>
                              {item}
                            </span>
                          </div>
                        ) : (
                          <div className={`p-3 border border-gvi-gold/15 rounded-sm hover:border-gvi-gold/30 transition-colors ${index % 2 === 1 ? "bg-gvi-navy/40" : "bg-gvi-ivory/30"}`}>
                            <p className={`text-sm font-semibold mb-0.5 ${index % 2 === 1 ? "text-gvi-ivory" : "text-gvi-navy"}`}>
                              {item.heading}
                            </p>
                            <p className={`text-xs leading-relaxed ${index % 2 === 1 ? "text-gvi-silver/70" : "text-gvi-charcoal/60"}`}>
                              {item.desc}
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub-criteria (e.g. regulatory framework) */}
                {sector.subheading && sector.subitems && (
                  <div
                    className={`mt-8 md:mt-10 p-5 md:p-8 border-l border-gvi-gold/25 rounded-sm ${index % 2 === 1 ? "bg-gvi-navy" : "bg-gvi-ivory/30"}`}
                  >
                    <p className="text-gvi-gold text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-3 md:mb-4">
                      {sector.subheading}
                    </p>
                    <ul className="space-y-3">
                      {sector.subitems.map((item, i) => (
                        <li
                          key={i}
                          className={`text-xs md:text-sm leading-relaxed ${index % 2 === 1 ? "text-gvi-silver/80" : "text-gvi-charcoal/60"}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    {sector.disclaimer && (
                      <p
                        className={`text-[10px] md:text-xs leading-relaxed mt-3 md:mt-4 ${index % 2 === 1 ? "text-gvi-silver/50" : "text-gvi-charcoal/40"}`}
                      >
                        {sector.disclaimer}
                      </p>
                    )}
                  </div>
                )}

                {/* Closing */}
                {sector.closing && (
                  <p
                    className={`text-sm md:text-base leading-relaxed mt-6 md:mt-8 border-t pt-4 md:pt-6 ${index % 2 === 1 ? "text-gvi-silver/70 border-gvi-gold/10" : "text-gvi-charcoal/60 border-gvi-gold/20"}`}
                  >
                    {sector.closing}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-gvi-navy rounded-2xl section-mx section-my" style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}>
        <div className="max-w-[1400px] mx-auto section-px text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-gvi-gold/40" />
            <span className="section-tag">Đồng Hành Xây Dựng</span>
            <div className="w-8 h-px bg-gvi-gold/40" />
          </div>
          <h2
            className="font-light text-gvi-ivory mb-4 md:mb-6 uppercase leading-[1.28]"
            style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}
          >
            Bạn Thấy Cùng Một Cơ Hội?
          </h2>
          <p className="text-gvi-silver/80 leading-[1.8] max-w-2xl mx-auto mb-8" style={{ fontSize: "var(--text-lead)" }}>
            Nếu bạn làm việc trong FinTech, tài sản mã hóa, AI hoặc kinh tế số — và bạn tin vào những gì Fortress đang xây dựng — chúng tôi muốn nói chuyện. Không phải về vốn, mà về việc cùng nhau tạo ra điều gì đó có ý nghĩa lâu dài.
          </p>
          <Link
            href="/invest-with-fortress"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gvi-gold to-gvi-champagne text-gvi-navy font-bold text-sm tracking-widest hover:shadow-2xl hover:shadow-gvi-gold/25 transition-all duration-300"
          >
            XEM HÀNH TRÌNH & KẾT NỐI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      
    </main>
  );
}
