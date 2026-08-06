

import Image from "next/image";
import {
  Building2,
  Cpu,
  Briefcase,
  TrendingUp,
  UtensilsCrossed,
  Wifi,
  Truck,
  Gem,
  Handshake,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lĩnh Vực Đầu Tư",
  description:
    "Khám phá các lĩnh vực đầu tư chiến lược của Fortress Investment Holdings: Bất động sản, thâu tóm M&A, Private Equity, Công nghệ AI, Khách sạn & Nghỉ dưỡng, Năng lượng và Liên minh chiến lược.",
  openGraph: {
    title: "Lĩnh Vực Đầu Tư | Fortress Investment Holdings",
    description:
      "Khám phá các lĩnh vực đầu tư chiến lược của Fortress Investment Holdings.",
  },
};

const sectors = [
  {
    id: "real-estate",
    icon: Building2,
    title: "Bất Động Sản",
    subtitle: "Kiến Tạo Giá Trị Thông Qua Đầu Tư Bất Động Sản Chiến Lược",
    image: "/1.png",
    body: "UAE là thị trường bất động sản trọng tâm của chúng tôi, được hậu thuẫn bởi tăng trưởng dân số mạnh mẽ, môi trường pháp lý thân thiện với nhà đầu tư, hạ tầng đẳng cấp thế giới và nhu cầu quốc tế bền vững. Bên cạnh trọng tâm UAE, chúng tôi cũng xem xét các cơ hội bất động sản được lựa chọn kỹ lưỡng tại các thị trường quốc tế phát triển và mới nổi có tiềm năng tăng trưởng và hồ sơ rủi ro phù hợp với chiến lược đầu tư của chúng tôi.",
    items: [
      { heading: "Bất Động Sản Nhà Ở", desc: "Căn hộ, biệt thự và khu đô thị tại các vị trí có nhu cầu cao ở UAE và các thị trường quốc tế được chọn lọc." },
      { heading: "Bất Động Sản Thương Mại", desc: "Văn phòng, mặt bằng bán lẻ và tài sản đa năng có tỷ lệ lấp đầy ổn định và hồ sơ thu nhập đáng tin cậy." },
      { heading: "Bất Động Sản Nghỉ Dưỡng", desc: "Khách sạn, khu nghỉ dưỡng, căn hộ dịch vụ và các dự án phát triển dịch vụ lưu trú tại các điểm đến chiến lược." },
      { heading: "Công Nghiệp & Logistics", desc: "Kho bãi, cơ sở phân phối, trung tâm logistics và hạ tầng chuỗi cung ứng." },
      { heading: "Phát Triển & Đất Đai", desc: "Các khu đất tọa lạc chiến lược và dự án phát triển có nền tảng vững chắc và kế hoạch thi công khả thi." },
      { heading: "Tài Sản Tạo Thu Nhập", desc: "Bất động sản ổn định có khả năng tạo thu nhập cho thuê đều đặn và giá trị dài hạn." },
    ],
    closing:
      "Hoạt động bất động sản của chúng tôi bao gồm mua trực tiếp, hợp tác phát triển, cơ hội đất đai, đầu tư có cấu trúc và tham gia dự án. UAE luôn là trọng tâm chiến lược, trong khi các cơ hội quốc tế được chọn lọc giúp đa dạng hóa và mở rộng danh mục sang các thị trường tăng trưởng mới. Trong mọi khoản đầu tư, chúng tôi ưu tiên chất lượng, vị trí, nền tảng thị trường, phát triển có trách nhiệm và lợi suất bền vững dài hạn hơn đầu cơ ngắn hạn.",
  },
  {
    id: "business-acquisitions",
    icon: Briefcase,
    title: "Thâu Tóm Doanh Nghiệp (M&A)",
    subtitle:
      "Chúng tôi thâu tóm và đầu tư vào các doanh nghiệp đã khẳng định vị thế với nền tảng vững chắc và tiềm năng tăng trưởng bền vững rõ ràng.",
    image: "/3.png",
    body: "Đằng sau mỗi doanh nghiệp lâu năm là nhiều năm nỗ lực, mối quan hệ và hiểu biết thị trường. Chúng tôi tôn trọng di sản đó và tiếp cận mỗi giao dịch với sự chuyên nghiệp, bảo mật và tầm nhìn dài hạn.\n\nChúng tôi xem xét các doanh nghiệp có vận hành đã được kiểm chứng, nhu cầu khách hàng đáng tin cậy, đội ngũ lãnh đạo kinh nghiệm và cơ hội cải thiện hiệu suất hoặc mở rộng sang thị trường mới.",
    items: [
      { heading: "Thâu Tóm Toàn Bộ Doanh Nghiệp", desc: "Chuyển giao quyền sở hữu hoàn toàn được thực hiện chuyên nghiệp và bảo mật tuyệt đối." },
      { heading: "Nắm Giữ Cổ Phần Kiểm Soát", desc: "Vị thế kiểm soát có sự tiếp tục tham gia của người sáng lập hoặc ban quản lý." },
      { heading: "Đầu Tư Cổ Phần Chiến Lược Thiểu Số", desc: "Cổ phần quan trọng được hỗ trợ bởi sự tham gia chiến lược chủ động." },
      { heading: "Mua Lại Do Ban Quản Lý Dẫn Dắt (MBO)", desc: "Hỗ trợ các đội ngũ lãnh đạo tài năng thâu tóm và phát triển doanh nghiệp họ đang quản lý." },
      { heading: "Thâu Tóm Đồng Đầu Tư", desc: "Hợp tác với các nhà đồng đầu tư cho các cơ hội quy mô lớn hoặc chuyên biệt." },
      { heading: "Giao Dịch Chuyển Giao Thế Hệ", desc: "Giải pháp có cấu trúc cho các chủ doanh nghiệp lên kế hoạch thoái vốn an toàn và bài bản." },
      { heading: "Hợp Tác Cấp Vốn Tăng Trưởng", desc: "Đầu tư kết hợp với hỗ trợ chiến lược cho mở rộng và phát triển." },
    ],
    closing:
      "Trọng tâm chính là UAE, đồng thời chúng tôi cũng đánh giá các cơ hội chọn lọc tại GCC và thị trường quốc tế. Thông qua sự tham gia chủ động, quản lý kỷ luật và hỗ trợ chiến lược, chúng tôi hướng đến củng cố vận hành, mở rộng thị trường và tạo ra giá trị bền vững cho tất cả các bên liên quan.",
  },
  {
    id: "private-equity",
    icon: TrendingUp,
    title: "Đầu Tư Tư Nhân (Private Equity)",
    subtitle: "Hỗ Trợ Các Công Ty Tư Nhân Tiềm Năng Cao",
    image: "/4.png",
    body: "Những công ty giá trị nhất của thập kỷ tới vẫn đang là doanh nghiệp tư nhân hôm nay. Tìm kiếm chúng – và giúp họ tăng trưởng – chính là sứ mệnh của hoạt động private equity tại Fortress.",
    items: [
      "Vốn tăng trưởng – tài trợ mở rộng, phát triển sản phẩm và gia nhập thị trường mới",
      "Hỗ trợ chiến lược – định hướng cấp hội đồng quản trị và dẫn dắt thương mại",
      "Tiếp cận thị trường – kết nối qua mạng lưới UAE và quốc tế của chúng tôi",
      "Hướng dẫn quản trị – cấu trúc xây dựng uy tín định chế",
      "Nguồn lực phát triển kinh doanh – hỗ trợ thực tiễn thúc đẩy tăng trưởng",
    ],
    closing:
      "Mục tiêu của chúng tôi rất rõ ràng: cùng nhau kiến tạo giá trị với người sáng lập, ban quản lý và các cổ đông – không phải tạo ra giá trị bằng cách tổn hại họ.",
  },
  {
    id: "ai-technology",
    icon: Wifi,
    title: "Công Nghệ AI & Đột Phá",
    subtitle: "Đầu Tư Vào Tương Lai Của Đổi Mới Thông Minh",
    image: "/6.png",
    body: "Chúng tôi đầu tư vào các công ty trí tuệ nhân tạo và công nghệ mới nổi có tiềm năng chuyển đổi ngành công nghiệp, cải thiện hiệu suất và tạo ra giá trị thương mại có thể mở rộng.\n\nTrọng tâm của chúng tôi là các công nghệ thực tiễn, tăng trưởng cao – giải quyết các vấn đề kinh doanh thực tế, hỗ trợ chuyển đổi số và tạo ra giá trị dài hạn tại UAE, GCC và thị trường toàn cầu.",
    items: [
      { heading: "Trí Tuệ Nhân Tạo (AI)", desc: "Nền tảng AI, hệ thống tự động hóa, giải pháp machine learning và công cụ thông minh với ứng dụng thương mại rõ ràng." },
      { heading: "Tự Động Hóa Doanh Nghiệp", desc: "Công nghệ cải thiện năng suất, giảm chi phí vận hành và nâng cao hiệu suất kinh doanh." },
      { heading: "Nền Tảng Phần Mềm & SaaS", desc: "Doanh nghiệp phần mềm có thể mở rộng với mô hình doanh thu định kỳ và nhu cầu thị trường mạnh mẽ." },
      { heading: "FinTech", desc: "Giải pháp thanh toán số, nền tảng cho vay, hạ tầng tài chính và công nghệ cải thiện khả năng tiếp cận dịch vụ tài chính." },
      { heading: "PropTech", desc: "Công nghệ bất động sản hỗ trợ đầu tư, mua bán, cho thuê, quản lý và thông tin thị trường thông minh hơn." },
      { heading: "An Ninh Mạng", desc: "Giải pháp bảo vệ doanh nghiệp, dữ liệu, hạ tầng số và giao dịch trực tuyến." },
      { heading: "Phân Tích Dữ Liệu", desc: "Nền tảng chuyển đổi dữ liệu thành thông tin chiến lược, giúp doanh nghiệp ra quyết định nhanh hơn và chính xác hơn." },
      { heading: "Thương Mại Điện Tử", desc: "Thương mại điện tử, nền tảng marketplace và doanh nghiệp bán lẻ dựa trên công nghệ với tiềm năng tăng trưởng cao." },
    ],
    closing:
      "Chúng tôi đầu tư vào công nghệ có mục đích – các doanh nghiệp kết hợp đổi mới sáng tạo, thực thi mạnh mẽ, nhu cầu thị trường và lộ trình tăng trưởng thương mại dài hạn rõ ràng.",
  },
  {
    id: "hospitality",
    icon: UtensilsCrossed,
    title: "Khách Sạn & Nghỉ Dưỡng",
    subtitle: "Đầu Tư Vào Trải Nghiệm, Du Lịch Và Phong Cách Sống",
    image: "/5.png",
    body: "UAE là trọng tâm chính, được bổ sung bởi các cơ hội chọn lọc tại GCC và thị trường toàn cầu. Với nhu cầu du lịch mạnh mẽ, hạ tầng đẳng cấp thế giới và nền kinh tế phong cách sống đang phát triển, khu vực này tiếp tục mang lại tiềm năng đầu tư khách sạn hấp dẫn.",
    items: [
      { heading: "Khách Sạn & Khu Nghỉ Dưỡng", desc: "Tài sản dịch vụ lưu trú đã vận hành và các dự án phát triển uy tín có vị trí, nhu cầu và tiềm năng khai thác tốt." },
      { heading: "Căn Hộ Dịch Vụ & Du Lịch", desc: "Cơ hội lưu trú ngắn và trung hạn có nhu cầu cao, đặc biệt tại các thị trường có du lịch và công tác phát triển mạnh." },
      { heading: "Nhà Hàng & Ẩm Thực (F&B)", desc: "Mô hình ẩm thực đã được kiểm chứng với bản sắc thương hiệu rõ ràng, kinh tế đơn vị vững chắc và tiềm năng mở rộng." },
      { heading: "Giải Trí & Trải Nghiệm Du Lịch", desc: "Địa điểm giải trí, trải nghiệm và doanh nghiệp liên quan đến du lịch phục vụ cư dân địa phương, du khách và khách quốc tế." },
      { heading: "Chăm Sóc Sức Khỏe & Wellness", desc: "Doanh nghiệp sức khỏe, thể thao, spa và wellbeing có nhu cầu khách hàng mạnh và tiềm năng doanh thu lặp lại." },
      { heading: "Công Nghệ Khách Sạn", desc: "Nền tảng công nghệ cải thiện cách các doanh nghiệp dịch vụ lưu trú vận hành, phục vụ khách hàng, quản lý đặt phòng và tăng hiệu quả." },
      { heading: "Dịch Vụ Phong Cách Sống Cao Cấp", desc: "Dịch vụ cao cấp dành cho cư dân, du khách, doanh nhân và khách hàng thu nhập cao." },
    ],
    closing:
      "Chúng tôi tập trung vào các mô hình khách sạn có định vị thị trường mạnh, vận hành chuyên nghiệp và khả năng mang lại giá trị khách hàng ổn định tại UAE, với tiềm năng mở rộng sang GCC và quốc tế.",
  },
  {
    id: "digital-assets",
    icon: Cpu,
    title: "Tài Sản Số & Blockchain",
    subtitle: "Tham Gia Có Chọn Lọc Vào Nền Kinh Tế Số",
    image: "/2.png",
    body: "Blockchain và tài sản số đang định hình lại cách thức tạo ra, chuyển giao và bảo đảm giá trị. Tại UAE – một trong những quốc gia tiến bộ nhất thế giới về quy định tài sản số – sự chuyển dịch này đang tạo ra các cơ hội thương mại nghiêm túc và dài hạn.\n\nFortress Investment Holdings tham gia vào lĩnh vực này theo cách tiếp cận nhất quán như mọi lĩnh vực khác: có chọn lọc, có trách nhiệm và tập trung rõ ràng vào giá trị thực thay vì đầu cơ.\n\nChúng tôi không phải nhà giao dịch chạy theo chu kỳ thị trường. Chúng tôi là nhà đầu tư dài hạn, hậu thuẫn cho hạ tầng, nền tảng và doanh nghiệp đang xây dựng nền móng của nền kinh tế số.",
    items: [
      "Hạ tầng Blockchain – mạng lưới, giao thức và hệ thống cấp doanh nghiệp cung cấp năng lực cho giao dịch số an toàn",
      "Nền tảng Tài sản Số – sàn giao dịch có cấp phép, giải pháp lưu ký và công nghệ quản lý tài sản",
      "Token hóa Tài sản – token hóa tài sản thực, bao gồm bất động sản, quỹ đầu tư và hàng hóa",
      "Công Nghệ Tài Chính (FinTech) – hệ thống thanh toán, ngân hàng số và dịch vụ tài chính blockchain",
      "Web3 & Giải Pháp Doanh Nghiệp – doanh nghiệp ứng dụng công nghệ phân tán vào các thách thức thương mại thực tiễn",
    ],
    subheading: "Tiêu Chí Đánh Giá Cơ Hội Tài Sản Số",
    subitems: [
      "Tuân Thủ Pháp Lý – phù hợp với khung pháp lý UAE bao gồm VARA và nhận thức về tiêu chuẩn quốc tế",
      "Giá Trị Ứng Dụng Thực – công nghệ giải quyết vấn đề thị trường thực sự, không phải câu chuyện đầu cơ",
      "Bảo Mật & Lưu Ký – an ninh mạng vững chắc, cơ chế lưu ký minh bạch, quản trị có trách nhiệm",
      "Khả Năng Thương Mại – mô hình doanh thu rõ ràng, lãnh đạo uy tín và lộ trình mở rộng thực tế",
      "Tính Dài Hạn – doanh nghiệp được định vị để hoạt động vượt qua tâm lý thị trường ngắn hạn",
    ],
    disclaimer:
      "Fortress Investment Holdings không khuyến khích đầu cơ ngắn hạn và không bảo đảm lợi nhuận từ tài sản số.",
  },
  {
    id: "energy-commodities",
    icon: Truck,
    title: "Năng Lượng & Hàng Hóa Vật Chất",
    subtitle: "Đầu Tư Vào Tài Nguyên Thiết Yếu Và Dòng Chảy Thương Mại Toàn Cầu",
    image: "/7.png",
    body: "Năng lượng và hàng hóa vật chất vẫn là yếu tố thiết yếu cho tăng trưởng toàn cầu, phát triển công nghiệp, hạ tầng và hoạt động kinh tế hàng ngày.\n\nFortress Investment Holdings tập trung vào các cơ hội gắn với hàng hóa thực, hữu hình – bao gồm sản phẩm năng lượng, nguyên liệu thô và hàng hóa vật chất có nhu cầu thực sự trên thị trường khu vực và toàn cầu.",
    items: [
      "Sản Phẩm Năng Lượng: cơ hội liên quan đến dầu thô, sản phẩm dầu mỏ tinh chế, cung ứng nhiên liệu và giao dịch năng lượng",
      "Hàng Hóa Vật Chất: hàng hóa hữu hình như kim loại, khoáng sản, nông sản, vật liệu xây dựng và các tài nguyên vật chất có nhu cầu cao",
      "Mạng Lưới Cung Ứng & Phân Phối: doanh nghiệp có năng lực thu mua, logistics, lưu trữ và phân phối đã được thiết lập",
      "Đối Tác Thương Mại Đáng Tin Cậy: quan hệ nhà cung cấp và người mua mạnh mẽ với đầy đủ hồ sơ pháp lý, tuân thủ và năng lực giao hàng",
      "Nhu Cầu Khu Vực & Toàn Cầu: hàng hóa có nhu cầu tích cực tại UAE, GCC, châu Phi, châu Á và thị trường quốc tế",
      "Năng Lực Vận Hành Vững Chắc: doanh nghiệp có dòng giao dịch đã được kiểm chứng, biên lợi nhuận cao, kiểm soát rủi ro và thực thi minh bạch",
    ],
    closing:
      "Chúng tôi tập trung vào các cơ hội hàng hóa vật chất được hậu thuẫn bởi nhu cầu thực tế, chuỗi cung ứng đáng tin cậy, thực thi kỷ luật và tiềm năng thị trường khu vực hoặc toàn cầu mạnh mẽ.",
  },
  {
    id: "luxury-assets",
    icon: Gem,
    title: "Tài Sản Sang Trọng",
    subtitle:
      "Đầu Tư Vào Tài Sản Cao Cấp Và Cơ Hội Phong Cách Sống Hạng Sang",
    image: "/8.png",
    body: "Fortress Investment Holdings đầu tư vào các cơ hội tài sản xa xỉ được chọn lọc với nhu cầu thị trường mạnh mẽ, tiềm năng giá trị dài hạn và cơ cấu sở hữu hoặc thương mại rõ ràng.\n\nTrọng tâm của chúng tôi là các tài sản cao cấp và doanh nghiệp liên quan đến xa xỉ có thể tạo ra giá trị thông qua tăng giá tài sản, thu nhập, nhu cầu cho thuê, sức mạnh thương hiệu hoặc định vị thị trường chiến lược.",
    items: [
      { heading: "Bất Động Sản Hạng Sang", desc: "Tài sản biểu tượng, dự án cao cấp, căn hộ có thương hiệu và bất động sản giá trị cao tại các vị trí đắc địa." },
      { heading: "Xe Cao Cấp & Siêu Xe", desc: "Ô tô hiếm, sưu tầm và cao cấp với nhu cầu mạnh, giá trị khan hiếm hoặc tiềm năng thu nhập cho thuê." },
      { heading: "Du Thuyền & Tài Sản Biển", desc: "Sở hữu du thuyền, cơ hội cho thuê, dịch vụ hàng hải và nền tảng quản lý tài sản liên quan đến thị trường phong cách sống xa xỉ." },
      { heading: "Tài Sản Liên Quan Đến Hàng Không", desc: "Cơ hội hàng không tư nhân, dịch vụ liên quan đến máy bay, doanh nghiệp hỗ trợ hàng không và giải pháp di chuyển cao cấp." },
      { heading: "Đồ Sưu Tầm & Nghệ Thuật Cao Cấp", desc: "Đồ sưu tầm, nghệ thuật đương đại, đồng hồ xa xỉ, trang sức và tài sản hiếm có nguồn gốc rõ ràng và độ sâu thị trường." },
      { heading: "Doanh Nghiệp Phong Cách Sống Cao Cấp", desc: "Thương hiệu và doanh nghiệp dịch vụ xa xỉ phục vụ khách hàng thu nhập cao, du khách, doanh nhân và người tiêu dùng phong cách sống premium." },
      { heading: "Nền Tảng Cho Thuê & Quản Lý Tài Sản Hạng Sang", desc: "Doanh nghiệp kiếm tiền từ tài sản cao cấp thông qua cho thuê, cho mướn, quản lý, hội viên hoặc tiếp cận khách hàng được tuyển chọn." },
    ],
    closing:
      "Chúng tôi đầu tư có chọn lọc vào tài sản xa xỉ và cơ hội phong cách sống cao cấp, nơi định giá, nhu cầu, thanh khoản, chi phí sở hữu và tiềm năng lợi suất dài hạn được đánh giá kỹ lưỡng.",
  },
  {
    id: "strategic-investment-management",
    icon: Handshake,
    title: "Quản Lý Đầu Tư Chiến Lược",
    subtitle: "Phân Bổ Vốn Kỷ Luật. Kiến Tạo Giá Trị Bền Vững.",
    image: "/9.png",
    body: "Chúng tôi xác định và quản lý các cơ hội đầu tư được lựa chọn kỹ lưỡng trên nhiều lĩnh vực, với trọng tâm kỷ luật vào quản lý rủi ro, tiềm năng thu nhập và tăng trưởng vốn dài hạn.\n\nPhương pháp tiếp cận của chúng tôi được thiết kế dành cho các nhà đầu tư tìm kiếm sự tham gia được quản lý chuyên nghiệp vào các doanh nghiệp, dự án và tài sản tại UAE, GCC và thị trường toàn cầu được chọn lọc.",
    items: [
      { heading: "Phân Bổ Đầu Tư Đa Dạng", desc: "Phân bổ vốn trên các lĩnh vực và cơ hội được chọn lọc để tạo danh mục đầu tư cân bằng." },
      { heading: "Cơ Hội Tạo Thu Nhập", desc: "Xác định các khoản đầu tư có tiềm năng tạo thu nhập định kỳ và phân phối có cấu trúc." },
      { heading: "Đầu Tư Tăng Trưởng Vốn", desc: "Đầu tư vào doanh nghiệp, dự án và tài sản có nền tảng thương mại vững chắc và tiềm năng tăng giá dài hạn." },
      { heading: "Cơ Hội Thị Trường Tư Nhân", desc: "Cung cấp quyền truy cập vào các cơ hội được đánh giá kỹ lưỡng ngoài thị trường đại chúng truyền thống." },
    ],
    closing: "",
  },
];

export default function InvestmentFocusPage() {
  return (
    <main className="min-h-screen bg-white">
      

      {/* Banner */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-24 overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
              Lĩnh Vực Đầu Tư
            </p>
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6">
              <span className="text-fortress-navy">Đầu Tư Vào </span>
              <span className="bg-gradient-to-r from-fortress-gold to-fortress-champagne bg-clip-text text-transparent">
                Cơ Hội
              </span>
            </h1>
            <p className="text-fortress-charcoal/70 text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
              Fortress Investment Holdings đầu tư vào các lĩnh vực được chọn lọc, nơi nhu cầu dài hạn, nền tảng vững chắc và sự tham gia chiến lược tạo ra giá trị bền vững.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-20 bg-fortress-navy my-8 md:my-12 mx-2 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
              Danh Mục Đầu Tư Đa Dạng
            </p>
            <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">
              Các Lĩnh Vực Chúng Tôi Đầu Tư
            </h2>
            <p className="text-fortress-ivory/80 text-sm md:text-lg leading-relaxed">
              Đa dạng hóa là trọng tâm của chiến lược đầu tư chúng tôi – nhưng đa dạng hóa thiếu kỷ luật chỉ là sự phân tán.
            </p>
            <p className="text-fortress-silver text-sm md:text-base leading-relaxed mt-3 md:mt-4">
              Chúng tôi đánh giá cơ hội trên nhiều ngành khác nhau trong khi duy trì quy trình chọn lọc nghiêm ngặt. Mọi khoản đầu tư phải thể hiện tiềm năng thương mại rõ ràng, rủi ro có thể quản lý được và sự phù hợp thực sự với mục tiêu dài hạn của Fortress Investment Holdings.
            </p>
            <p className="text-fortress-silver/70 text-sm md:text-base leading-relaxed mt-3 md:mt-4">
              Đây là các lĩnh vực mà chúng tôi tập trung nguồn vốn và sự chú ý.
            </p>
          </div>
        </div>
      </section>

      {/* Sector Sections */}
      {sectors.map((sector, index) => (
        <section
          key={sector.title}
          id={sector.id}
          className={`py-12 md:py-28 my-8 md:my-12 mx-2 sm:mx-4 rounded-2xl ${index % 2 === 1 ? "bg-fortress-deep" : "bg-white"}`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            {/* Header */}
            <div className="flex items-start gap-4 md:gap-5 mb-8 md:mb-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-fortress-gold/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                <sector.icon className="w-5 h-5 md:w-7 md:h-7 text-fortress-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-fortress-gold/50 text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-1">
                  Lĩnh Vực {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  className={`text-xl md:text-4xl font-bold mb-1 break-words ${index % 2 === 1 ? "text-fortress-ivory" : "text-fortress-navy"}`}
                >
                  {sector.title}
                </h2>
                <p className="text-fortress-gold text-sm md:text-lg">
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
                  className={`relative aspect-[4/3] overflow-hidden border rounded-sm ${index % 2 === 1 ? "border-fortress-gold/10" : "border-fortress-gold/20"}`}
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
                    className={`absolute inset-0 bg-gradient-to-t ${index % 2 === 1 ? "from-fortress-deep/40" : "from-white/40"} to-transparent`}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                {sector.body.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className={`text-sm md:text-base leading-relaxed mb-4 md:mb-5 last:mb-0 ${index % 2 === 1 ? "text-fortress-silver" : "text-fortress-charcoal/70"}`}
                  >
                    {para}
                  </p>
                ))}

                {/* Investment areas list */}
                <div className="mt-6 md:mt-8">
                  <p className="text-fortress-gold text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-3 md:mb-4">
                    Trọng Tâm Đầu Tư
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {sector.items.map((item, i) => (
                      <li key={i}>
                        {typeof item === "string" ? (
                          <span className={`text-xs md:text-sm leading-relaxed ${index % 2 === 1 ? "text-fortress-silver/80" : "text-fortress-charcoal/60"}`}>
                            {item}
                          </span>
                        ) : (
                          <div>
                            <p className={`text-sm md:text-base font-semibold ${index % 2 === 1 ? "text-fortress-ivory" : "text-fortress-navy"}`}>
                              {item.heading}
                            </p>
                            <p className={`text-xs md:text-sm leading-relaxed mt-0.5 ${index % 2 === 1 ? "text-fortress-silver/70" : "text-fortress-charcoal/60"}`}>
                              {item.desc}
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Digital Assets evaluation criteria */}
                {sector.subheading && sector.subitems && (
                  <div
                    className={`mt-8 md:mt-10 p-5 md:p-8 border-l border-fortress-gold/25 rounded-sm ${index % 2 === 1 ? "bg-fortress-navy" : "bg-fortress-ivory/30"}`}
                  >
                    <p className="text-fortress-gold text-[10px] md:text-xs tracking-[3px] md:tracking-[4px] uppercase font-semibold mb-3 md:mb-4">
                      {sector.subheading}
                    </p>
                    <ul className="space-y-3">
                      {sector.subitems.map((item, i) => (
                        <li
                          key={i}
                          className={`text-xs md:text-sm leading-relaxed ${index % 2 === 1 ? "text-fortress-silver/80" : "text-fortress-charcoal/60"}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    {sector.disclaimer && (
                      <p
                        className={`text-[10px] md:text-xs leading-relaxed mt-3 md:mt-4 ${index % 2 === 1 ? "text-fortress-silver/50" : "text-fortress-charcoal/40"}`}
                      >
                        {sector.disclaimer}
                      </p>
                    )}
                  </div>
                )}

                {/* Closing */}
                {sector.closing && (
                  <p
                    className={`text-sm md:text-base leading-relaxed mt-6 md:mt-8 border-t pt-4 md:pt-6 ${index % 2 === 1 ? "text-fortress-silver/70 border-fortress-gold/10" : "text-fortress-charcoal/60 border-fortress-gold/20"}`}
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
      <section className="py-12 md:py-28 bg-fortress-navy my-8 md:my-12 mx-2 sm:mx-4 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-fortress-gold text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
            Hợp Tác Đầu Tư
          </p>
          <h2 className="text-xl md:text-4xl font-bold text-fortress-ivory mb-4 md:mb-6">
            Gửi Đề Xuất Cơ Hội Tới Fortress
          </h2>
          <p className="text-fortress-silver/80 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8">
            Chúng tôi chào đón các đề xuất được chọn lọc từ chủ doanh nghiệp, nhà khởi nghiệp, cố vấn, nhà đầu tư, nhà phát triển và đối tác chiến lược. Mọi đề xuất được xem xét chuyên nghiệp và xử lý với sự bảo mật tuyệt đối.
          </p>
          <Link
            href="/invest-with-fortress"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy font-bold text-sm tracking-widest hover:shadow-2xl hover:shadow-fortress-gold/25 transition-all duration-300"
          >
            GỬI ĐỀ XUẤT ĐẦU TƯ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      
    </main>
  );
}
