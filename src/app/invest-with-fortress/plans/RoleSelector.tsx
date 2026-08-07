"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Monitor,
  Landmark,
  Rocket,
  Scale,
  Globe,
  User,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

// ─── Role Data ─────────────────────────────────────────────────────────────────

export interface RoleDoc {
  name: string
  note: string
  required: boolean
  templateUrl?: string
}

export interface RoleTask {
  label: string
  detail: string
  deadline: string
}

export interface PartnerRole {
  id: string
  Icon: React.ComponentType<{ className?: string }>
  color: string;           // Tailwind bg gradient class
  accentText: string;      // Tailwind text color
  accentBorder: string;    // Tailwind border color
  iconBg: string;          // Tailwind icon bg
  title: string
  subtitle: string
  tagline: string
  minCapital: string
  equity: string
  requirements: string[];  // điều kiện bắt buộc
  rights: string[];        // quyền lợi
  obligations: string[];   // nghĩa vụ
  tasks: RoleTask[];       // công việc cụ thể cần hoàn thành
  docs: RoleDoc[];         // hồ sơ cần chuẩn bị
}

export const ROLES: PartnerRole[] = [
  {
    id: "tech",
    Icon: Monitor,
    color: "from-blue-500/15 to-blue-500/5",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/30",
    iconBg: "bg-blue-500/15",
    title: "Đối Tác Công Nghệ",
    subtitle: "Technology Partner",
    tagline: "Xây dựng nền tảng — Trái tim của dự án",
    minCapital: "Góp công sức / IP",
    equity: "15–25% (hoán đổi cổ phần theo định giá IP)",
    requirements: [
      "Có năng lực xây dựng hệ thống giao dịch tài sản mã hóa quy mô lớn",
      "Đội ngũ ≥10 kỹ sư CNTT (backend, security, blockchain)",
      "Kinh nghiệm thực tế với hệ thống tài chính / fintech",
    ],
    rights: [
      "Quyền điều hành bộ phận công nghệ (CTO và đội ngũ)",
      "Cổ phần được định giá theo IP / sản phẩm đóng góp",
      "Quyền biểu quyết trong hội đồng quản trị kỹ thuật",
      "Ưu tiên mở rộng dịch vụ kỹ thuật sau khi được cấp phép",
    ],
    obligations: [
      "Xây dựng hệ thống giao dịch TSMH đạt chuẩn NQ5/2025",
      "Đảm bảo an toàn thông tin cấp độ 4 (Bộ Công an thẩm định)",
      "Hoàn thiện 10 quy trình nghiệp vụ theo Điều 8 NQ5",
      "Vận hành hệ thống sau khi được cấp phép — không được dừng trong 30 ngày",
      "Cử ≥10 nhân sự đạt chứng chỉ an toàn thông tin mạng",
    ],
    tasks: [
      { label: "Thiết kế kiến trúc hệ thống", detail: "Matching engine, custody wallet, settlement module, KYC/AML module, admin dashboard", deadline: "Tháng 1–3" },
      { label: "Xây dựng 10 quy trình nghiệp vụ", detail: "Quản trị rủi ro, giao dịch, thanh toán, lưu ký, tự doanh, AML, kiểm soát nội bộ, CBTT, ngăn xung đột lợi ích, giải quyết khiếu nại", deadline: "Tháng 2–4" },
      { label: "Đạt chuẩn an toàn CNTT cấp 4", detail: "Phối hợp Bộ Công an thẩm định — ISMS, pen test, audit trail, DR/BCP", deadline: "Tháng 4–6" },
      { label: "Cử nhân sự đạt chứng chỉ", detail: "≥10 chứng chỉ ATTT mạng (CISSP, CISM hoặc tương đương VN) + ≥10 chứng chỉ hành nghề chứng khoán", deadline: "Song song" },
      { label: "UAT & Security Audit", detail: "Kiểm thử toàn bộ hệ thống trước khi nộp hồ sơ", deadline: "Tháng 5–7" },
    ],
    docs: [
      { name: "Bản thuyết minh hệ thống CNTT", note: "Mô tả kiến trúc, công nghệ, quy trình bảo mật", required: true },
      { name: "Văn bản thẩm định ATTT cấp 4 — Bộ Công an", note: "Bắt buộc trước khi nộp hồ sơ", required: true },
      { name: "10 Quy trình nghiệp vụ (bản chính thức)", note: "Đăng tải trên website công ty + website BTC", required: true },
      { name: "Danh sách nhân sự CNTT + chứng chỉ ATTT", note: "≥10 người kèm bản scan chứng chỉ", required: true },
      { name: "Hợp đồng IP / chuyển nhượng công nghệ", note: "Nếu đóng góp bằng IP thay tiền mặt", required: false },
    ],
  },
  {
    id: "financial",
    Icon: Landmark,
    color: "from-fortress-gold/20 to-fortress-gold/5",
    accentText: "text-fortress-gold",
    accentBorder: "border-fortress-gold/40",
    iconBg: "bg-fortress-gold/15",
    title: "Đối Tác Tài Chính Tổ Chức",
    subtitle: "Institutional Finance Partner",
    tagline: "Ngân hàng / Quản lý quỹ / Chứng khoán / Bảo hiểm",
    minCapital: "≥3.500 tỷ VNĐ (>35% từ ≥2 tổ chức)",
    equity: "18–35% mỗi tổ chức (tổng >35% bắt buộc)",
    requirements: [
      "Là ngân hàng thương mại, công ty quản lý quỹ, công ty chứng khoán, hoặc bảo hiểm",
      "Có tư cách pháp nhân tại Việt Nam",
      "BCTC 2 năm gần nhất có lãi, được kiểm toán và chấp thuận toàn phần",
      "Chưa góp vốn tại tổ chức DVCVTSMH nào khác được BTC cấp phép",
    ],
    rights: [
      "Cổ phần ưu đãi theo tỷ lệ góp vốn",
      "Quyền phủ quyết các quyết định chiến lược (nếu >25%)",
      "Đại diện trong HĐQT theo tỷ lệ vốn",
      "Ưu tiên cung cấp dịch vụ ngân hàng / thanh toán cho sàn",
    ],
    obligations: [
      "Góp đủ vốn bằng đồng Việt Nam (tối thiểu phần cam kết)",
      "Cung cấp BCTC 2 năm được kiểm toán (ý kiến chấp thuận toàn phần)",
      "Ký biên bản thỏa thuận góp vốn chính thức",
      "Không đồng thời góp vốn tại sàn TSMH khác được BTC cấp phép",
      "Tuân thủ yêu cầu công bố thông tin định kỳ",
    ],
    tasks: [
      { label: "Xác nhận năng lực tài chính", detail: "Chuẩn bị BCTC 2 năm được kiểm toán (ý kiến chấp thuận toàn phần)", deadline: "Ngay lập tức" },
      { label: "Ký biên bản góp vốn", detail: "Biên bản thỏa thuận góp vốn theo Mẫu số 2 NQ5 — xác nhận số vốn, thời hạn, phương thức", deadline: "Tháng 1–2" },
      { label: "Chuyển vốn đợt 1", detail: "Tối thiểu 50% vốn cam kết — chuyển khoản VNĐ vào tài khoản công ty", deadline: "Tháng 2–3" },
      { label: "Cung cấp tài liệu pháp lý tổ chức", detail: "ĐKKD, điều lệ, quyết định cử người đại diện vốn góp, giấy ủy quyền", deadline: "Tháng 1" },
      { label: "Hoàn tất chuyển vốn đợt 2", detail: "Đủ 100% vốn cam kết trước ngày nộp hồ sơ BTC", deadline: "Tháng 4–5" },
    ],
    docs: [
      { name: "Giấy chứng nhận đăng ký doanh nghiệp", note: "Bản sao công chứng còn hiệu lực", required: true },
      { name: "Điều lệ công ty", note: "Bản mới nhất có xác nhận của cơ quan đăng ký", required: true },
      { name: "BCTC 2 năm được kiểm toán (ý kiến chấp thuận toàn phần)", note: "Năm T-1 và T-2 so với năm nộp hồ sơ", required: true },
      { name: "Biên bản thỏa thuận góp vốn", note: "Theo mẫu nội bộ + ký công chứng nếu cần", required: true, templateUrl: "#" },
      { name: "Tài liệu chứng minh vốn góp bằng VNĐ", note: "Giấy xác nhận số dư / Giấy chứng nhận vốn góp", required: true },
      { name: "Quyết định cử người đại diện phần vốn góp", note: "Bổ nhiệm chính thức từ HĐQT/HĐTV tổ chức góp vốn", required: true },
    ],
  },
  {
    id: "tech-company",
    Icon: Rocket,
    color: "from-purple-500/15 to-purple-500/5",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    iconBg: "bg-purple-500/15",
    title: "Cổ Đông Doanh Nghiệp Công Nghệ",
    subtitle: "Technology Company Shareholder",
    tagline: "Startup / Công ty công nghệ / Fintech tham gia góp vốn tổ chức",
    minCapital: "Tham gia trong nhóm >35% cùng tổ chức tài chính",
    equity: "5–15% (trong cơ cấu >35% bắt buộc)",
    requirements: [
      "Là công ty hoạt động trong lĩnh vực công nghệ (có ĐKKD)",
      "BCTC 2 năm có lãi, được kiểm toán chấp thuận toàn phần",
      "Có tư cách pháp nhân — không phải cá nhân",
      "Chưa góp vốn tại sàn TSMH khác được BTC cấp phép",
    ],
    rights: [
      "Cổ phần theo tỷ lệ góp vốn",
      "Đại diện trong HĐQT nếu đủ tỷ lệ",
      "Ưu tiên hợp tác cung ứng dịch vụ công nghệ cho sàn",
      "Tiếp cận hệ sinh thái FinTech được cấp phép",
    ],
    obligations: [
      "Góp đủ vốn bằng đồng Việt Nam theo cam kết",
      "Cung cấp BCTC được kiểm toán chấp thuận toàn phần 2 năm liền",
      "Ký biên bản góp vốn chính thức",
      "Không đồng thời góp vốn tại sàn TSMH khác",
      "Hỗ trợ tài nguyên công nghệ / nhân sự khi cần",
    ],
    tasks: [
      { label: "Kiểm tra tư cách pháp lý", detail: "Xác nhận ĐKKD ngành công nghệ, kiểm tra điều kiện BCTC 2 năm có lãi", deadline: "Ngay" },
      { label: "Chuẩn bị BCTC kiểm toán", detail: "Đảm bảo 2 năm gần nhất có lãi và được kiểm toán chấp thuận toàn phần", deadline: "Tháng 1" },
      { label: "Đàm phán cơ cấu vốn góp", detail: "Thống nhất tỷ lệ cổ phần, định giá, quyền biểu quyết trong nhóm >35%", deadline: "Tháng 1–2" },
      { label: "Ký biên bản góp vốn", detail: "Xác nhận cam kết vốn bằng văn bản pháp lý", deadline: "Tháng 2" },
      { label: "Chuyển vốn theo tiến độ", detail: "Theo lịch thanh toán đã thỏa thuận — 100% trước ngày nộp hồ sơ", deadline: "Tháng 3–5" },
    ],
    docs: [
      { name: "Giấy chứng nhận đăng ký doanh nghiệp", note: "Bản sao công chứng — ngành CNTT/Fintech", required: true },
      { name: "Điều lệ công ty", note: "Bản cập nhật mới nhất", required: true },
      { name: "BCTC 2 năm được kiểm toán (ý kiến chấp thuận toàn phần)", note: "Bắt buộc — nếu chưa có cần thuê kiểm toán ngay", required: true },
      { name: "Biên bản thỏa thuận góp vốn", note: "Ký với công ty mẹ dự án", required: true },
      { name: "Tài liệu chứng minh vốn góp VNĐ", note: "Giấy xác nhận chuyển khoản / số dư", required: true },
    ],
  },
  {
    id: "individual",
    Icon: User,
    color: "from-emerald-500/15 to-emerald-500/5",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    iconBg: "bg-emerald-500/15",
    title: "Cổ Đông Cá Nhân / Nhỏ",
    subtitle: "Individual / Small Shareholder",
    tagline: "Tham gia trong nhóm 35% vốn cá nhân + tổ chức nhỏ",
    minCapital: "Tham gia trong khối 35% còn lại (không phải >35% bắt buộc)",
    equity: "0.5–5% (gộp vào nhóm cá nhân ≤35%)",
    requirements: [
      "Là cá nhân hoặc tổ chức không thuộc nhóm tài chính/công nghệ bắt buộc",
      "Có khả năng góp vốn bằng đồng Việt Nam",
      "Chưa tham gia góp vốn tại sàn TSMH khác được BTC cấp phép",
      "Chấp nhận quyền biểu quyết hạn chế theo tỷ lệ vốn nhỏ",
    ],
    rights: [
      "Cổ phần theo tỷ lệ vốn góp",
      "Nhận cổ tức theo quyết định HĐQT / ĐHCĐ",
      "Quyền biểu quyết hạn chế (theo tỷ lệ)",
      "Quyền chuyển nhượng cổ phần sau thời hạn lock-up",
    ],
    obligations: [
      "Góp đủ vốn bằng đồng Việt Nam theo cam kết",
      "Ký biên bản góp vốn / hợp đồng cổ đông",
      "Không đồng thời tham gia sàn TSMH khác được BTC cấp phép",
      "Tuân thủ điều lệ công ty và nghị quyết ĐHCĐ",
    ],
    tasks: [
      { label: "Xác nhận khả năng góp vốn", detail: "Xác nhận số tiền, thời hạn, phương thức chuyển khoản VNĐ", deadline: "Ngay" },
      { label: "Ký hợp đồng góp vốn / mua cổ phần", detail: "Hợp đồng song phương hoặc biên bản góp vốn có công chứng", deadline: "Tháng 1–2" },
      { label: "Chuyển vốn theo lịch", detail: "Chuyển khoản VNĐ vào tài khoản công ty đúng hạn", deadline: "Tháng 2–5" },
      { label: "Nhận giấy chứng nhận vốn góp", detail: "Giấy chứng nhận phần vốn góp / cổ phiếu sau khi chuyển đủ vốn", deadline: "Sau khi góp đủ" },
    ],
    docs: [
      { name: "CMND / CCCD / Hộ chiếu", note: "Cá nhân — bản sao công chứng", required: true },
      { name: "Biên bản / Hợp đồng góp vốn", note: "Ký với công ty — ghi rõ số tiền, tỷ lệ, quyền lợi", required: true, templateUrl: "#" },
      { name: "Giấy chứng nhận góp vốn", note: "Nhận sau khi chuyển đủ vốn", required: true },
      { name: "Chứng từ chuyển khoản VNĐ", note: "Lưu trữ đầy đủ cho hồ sơ quyết toán", required: true },
    ],
  },
  {
    id: "legal",
    Icon: Scale,
    color: "from-amber-500/15 to-amber-500/5",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/30",
    iconBg: "bg-amber-500/15",
    title: "Đối Tác Pháp Lý & Tuân Thủ",
    subtitle: "Legal & Compliance Partner",
    tagline: "Luật sư / Tư vấn pháp lý / Chuyên gia tuân thủ",
    minCapital: "Góp công sức / dịch vụ (hoán đổi cổ phần)",
    equity: "2–8% (hoán đổi theo gói dịch vụ pháp lý)",
    requirements: [
      "Luật sư / công ty luật chuyên về tài chính, chứng khoán, FinTech",
      "Kinh nghiệm với hồ sơ cấp phép tài chính tại Bộ Tài chính",
      "Am hiểu NQ 5/2025/NQ-CP và toàn bộ quy định liên quan",
    ],
    rights: [
      "Cổ phần hoán đổi theo định giá gói dịch vụ",
      "Hợp đồng dịch vụ pháp lý dài hạn sau cấp phép",
      "Vai trò Giám đốc Tuân thủ (Chief Compliance Officer) nếu phù hợp",
      "Ưu tiên trong các vụ kiện / tranh chấp của công ty",
    ],
    obligations: [
      "Soạn thảo toàn bộ hồ sơ pháp lý cho hồ sơ cấp phép",
      "Tư vấn cơ cấu cổ đông đúng quy định NQ5/2025",
      "Chuẩn bị điều lệ công ty, biên bản góp vốn, quy trình nội bộ",
      "Đại diện nộp và theo dõi hồ sơ tại Bộ Tài chính",
      "Tư vấn AML/CFT theo quy định Nghị quyết 5",
    ],
    tasks: [
      { label: "Soạn thảo điều lệ công ty", detail: "Điều lệ CTCP hoặc TNHH phù hợp NQ5 — ghi rõ cơ cấu cổ đông, quyền biểu quyết", deadline: "Tháng 1" },
      { label: "Tư vấn cơ cấu vốn góp", detail: "Đảm bảo đúng: ≥65% tổ chức, >35% tài chính/công nghệ, ≤49% nước ngoài", deadline: "Tháng 1" },
      { label: "Soạn biên bản góp vốn cho tất cả cổ đông", detail: "Mỗi cổ đông một biên bản, công chứng nếu cần", deadline: "Tháng 1–3" },
      { label: "Chuẩn bị hồ sơ cấp phép đầy đủ", detail: "11 loại giấy tờ theo Điều 9 NQ5 — đóng gói đúng quy cách", deadline: "Tháng 5–6" },
      { label: "Nộp hồ sơ và theo dõi tại BTC", detail: "Nộp 1 bộ hồ sơ, theo dõi 20 ngày xác nhận + 30 ngày xét duyệt", deadline: "Tháng 6–7" },
    ],
    docs: [
      { name: "Điều lệ công ty (CTCP hoặc TNHH)", note: "Soạn thảo mới theo cơ cấu NQ5 — không dùng mẫu thông thường", required: true, templateUrl: "https://ketoananpha.vn/mau-dieu-le-cong-ty-co-phan" },
      { name: "Giấy đề nghị cấp phép — Mẫu số 2 NQ5", note: "Điền đầy đủ thông tin công ty + dịch vụ đăng ký", required: true, templateUrl: "https://ketoananpha.vn/thu-tuc-xin-cap-giay-phep-cung-cap-dich-vu-to-chuc-thi-truong-giao-dich-tai-san-ma-hoa" },
      { name: "Quy trình AML/CFT/CFTF nội bộ", note: "Phòng chống rửa tiền + chống tài trợ khủng bố theo NQ5", required: true },
      { name: "Quy trình kiểm soát nội bộ", note: "Internal control framework theo tiêu chuẩn", required: true },
      { name: "Hợp đồng dịch vụ pháp lý + hoán đổi cổ phần", note: "Ghi rõ phạm vi, thời hạn, định giá cổ phần", required: false },
    ],
  },
  {
    id: "foreign",
    Icon: Globe,
    color: "from-rose-500/15 to-rose-500/5",
    accentText: "text-rose-400",
    accentBorder: "border-rose-500/30",
    iconBg: "bg-rose-500/15",
    title: "Nhà Đầu Tư Nước Ngoài",
    subtitle: "Foreign Investor",
    tagline: "Cá nhân / Tổ chức nước ngoài — Tối đa 49% vốn điều lệ",
    minCapital: "Theo thỏa thuận (trong giới hạn 49%)",
    equity: "Tối đa 49% tổng vốn điều lệ",
    requirements: [
      "Tổng vốn nước ngoài KHÔNG vượt quá 49% vốn điều lệ (bắt buộc)",
      "Cần thực hiện thủ tục M&A / góp vốn có yếu tố nước ngoài tại Sở KHĐT",
      "Phải chuyển vốn qua tài khoản vốn đầu tư gián tiếp (IICA) tại ngân hàng VN",
      "Tuân thủ quy định ngoại hối Ngân hàng Nhà nước",
    ],
    rights: [
      "Cổ phần theo tỷ lệ góp vốn (max 49%)",
      "Quyền biểu quyết theo tỷ lệ cổ phần",
      "Quyền chuyển lợi nhuận về nước qua tài khoản IICA",
      "Tiếp cận thị trường TSMH Việt Nam hợp pháp",
    ],
    obligations: [
      "Tổng vốn nước ngoài không vượt 49% — bắt buộc pháp lý",
      "Chuyển vốn qua tài khoản vốn đầu tư gián tiếp (IICA)",
      "Nộp thủ tục góp vốn có yếu tố nước ngoài tại Sở KHĐT tỉnh/thành",
      "Cung cấp đủ tài liệu pháp lý theo yêu cầu nhà nước VN",
      "Tuân thủ quy định ngoại hối và báo cáo giao dịch ngoại tệ",
    ],
    tasks: [
      { label: "Mở tài khoản IICA tại ngân hàng VN", detail: "Indirect Investment Capital Account — điều kiện bắt buộc để góp vốn hợp pháp", deadline: "Ngay" },
      { label: "Nộp thủ tục góp vốn nước ngoài", detail: "Thủ tục M&A theo Điều 26 Luật Đầu tư — nộp tại Sở KHĐT", deadline: "Tháng 1–2" },
      { label: "Chuyển vốn qua tài khoản IICA", detail: "Chuyển khoản quốc tế → IICA → tài khoản công ty VN", deadline: "Tháng 2–4" },
      { label: "Cung cấp tài liệu pháp lý", detail: "Passport / ĐKKD, báo cáo tài chính, lý lịch tư pháp (nếu cần)", deadline: "Tháng 1" },
      { label: "Nhận giấy chứng nhận góp vốn", detail: "Sau khi Sở KHĐT xác nhận và công ty cấp GCN vốn góp", deadline: "Tháng 3–5" },
    ],
    docs: [
      { name: "Hộ chiếu / ĐKKD (bản dịch công chứng)", note: "Cá nhân: hộ chiếu. Tổ chức: ĐKKD bản dịch sang tiếng Việt", required: true },
      { name: "Thông báo góp vốn / mua cổ phần của NĐTNN", note: "Nộp tại Sở KHĐT theo Điều 26 Luật Đầu tư", required: true },
      { name: "Giấy xác nhận tài khoản IICA tại ngân hàng VN", note: "Bắt buộc trước khi chuyển vốn", required: true },
      { name: "Chứng từ chuyển tiền quốc tế qua IICA", note: "Lưu lại đầy đủ cho hồ sơ thuế, ngoại hối", required: true },
      { name: "Biên bản góp vốn / Hợp đồng mua cổ phần", note: "Song ngữ Anh-Việt, công chứng và hợp pháp hóa lãnh sự nếu cần", required: true },
    ],
  },
];

// ─── Document groups for licensing application ────────────────────────────────

export const DOC_GROUPS = [
  {
    group: "Hồ Sơ Pháp Lý Doanh Nghiệp",
    Icon: Building2,
    color: "bg-blue-500/10 border-blue-500/20",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    items: [
      { name: "Giấy đề nghị cấp phép — Mẫu số 2 NQ5/2025", note: "Bắt buộc nộp BTC", required: true, templateUrl: "https://ketoananpha.vn/thu-tuc-xin-cap-giay-phep-cung-cap-dich-vu-to-chuc-thi-truong-giao-dich-tai-san-ma-hoa" },
      { name: "Giấy chứng nhận đăng ký doanh nghiệp", note: "Bản sao công chứng — CTCP hoặc TNHH", required: true },
      { name: "Điều lệ công ty", note: "Bản mới nhất — phù hợp NQ5", required: true, templateUrl: "https://ketoananpha.vn/mau-dieu-le-cong-ty-co-phan" },
      { name: "Giấy tờ trụ sở (sở hữu / thuê)", note: "Chứng minh quyền sử dụng trụ sở làm việc", required: true },
      { name: "Bản thuyết minh cơ sở vật chất kỹ thuật", note: "Mô tả văn phòng, trang thiết bị, hạ tầng CNTT", required: true },
    ],
  },
  {
    group: "Hồ Sơ Cổ Đông & Vốn Góp",
    Icon: Landmark,
    color: "bg-fortress-gold/10 border-fortress-gold/25",
    iconBg: "bg-fortress-gold/15",
    iconColor: "text-fortress-gold",
    items: [
      { name: "Danh sách cổ đông / thành viên góp vốn", note: "Đầy đủ thông tin: tên, địa chỉ, tỷ lệ, số vốn", required: true },
      { name: "Biên bản thỏa thuận góp vốn (từng cổ đông)", note: "Mỗi cổ đông tổ chức ký riêng một biên bản", required: true, templateUrl: "#" },
      { name: "BCTC 2 năm liền kề được kiểm toán (cổ đông tổ chức)", note: "Ý kiến kiểm toán: chấp thuận TOÀN PHẦN — bắt buộc", required: true },
      { name: "Tài liệu chứng minh VĐL đã góp bằng VNĐ", note: "Xác nhận số dư / chứng từ chuyển khoản", required: true },
      { name: "BCTC năm được kiểm toán của công ty (nếu đã có)", note: "Hoặc báo cáo VĐL đã góp xác nhận bởi kiểm toán", required: true },
      { name: "ĐKKD của cổ đông tổ chức", note: "Bản sao công chứng từng tổ chức", required: true },
    ],
  },
  {
    group: "Hồ Sơ Nhân Sự",
    Icon: User,
    color: "bg-purple-500/10 border-purple-500/20",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    items: [
      { name: "Danh sách nhân sự + lý lịch cá nhân", note: "TGĐ, GĐ CN, nhân sự CNTT, nhân sự chứng khoán", required: true },
      { name: "CV + bằng cấp TGĐ / Giám đốc", note: "≥2 năm KN tại ngân hàng / tài chính / chứng khoán / bảo hiểm", required: true },
      { name: "CV + bằng cấp Giám đốc Công nghệ (CTO)", note: "≥5 năm KN CNTT tại DN công nghệ hoặc tổ chức tài chính", required: true },
      { name: "Chứng chỉ ATTT mạng (≥10 nhân sự)", note: "CISSP, CISM, CEH hoặc chứng chỉ tương đương theo quy định VN", required: true },
      { name: "Chứng chỉ hành nghề chứng khoán (≥10 nhân sự)", note: "Chứng chỉ CFA, chứng chỉ hành nghề do UBCKNN cấp", required: true },
    ],
  },
  {
    group: "Hồ Sơ Hệ Thống CNTT & Quy Trình",
    Icon: Monitor,
    color: "bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    items: [
      { name: "Văn bản thẩm định ATTT cấp độ 4 — Bộ Công an", note: "BẮT BUỘC — phải có trước khi nộp hồ sơ BTC", required: true },
      { name: "Quy trình quản trị rủi ro & bảo mật thông tin", note: "Điều 8 NQ5 — 1 trong 10 quy trình bắt buộc", required: true },
      { name: "Quy trình thực hiện giao dịch, thanh toán", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình giám sát giao dịch", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình lưu ký, quản lý TSMH của khách hàng", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình tự doanh TSMH", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình nền tảng phát hành TSMH", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình công bố thông tin", note: "Điều 8 NQ5 — đăng tải trên website công ty + BTC", required: true },
      { name: "Quy trình kiểm soát nội bộ", note: "Điều 8 NQ5", required: true },
      { name: "Quy trình AML/CFT/CFTF", note: "Phòng chống rửa tiền, tài trợ khủng bố, VKHDHL — Điều 8 NQ5", required: true },
      { name: "Quy trình ngăn xung đột lợi ích & khiếu nại", note: "Điều 8 NQ5", required: true },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoleSelector() {
  const [activeRole, setActiveRole] = useState<string>("tech");
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [expandedDocGroup, setExpandedDocGroup] = useState<number | null>(0);

  const role = ROLES.find((r) => r.id === activeRole)!;

  return (
    <div className="space-y-8">
      {/* ── Role tab strip ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ROLES.map((r) => {
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-br ${r.color} ${r.accentBorder} ${r.accentText}`
                  : "bg-white border-gray-200 text-fortress-charcoal/60 hover:border-fortress-gold/30"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center ${isActive ? r.iconBg : "bg-gray-100"}`}>
                <r.Icon className={`w-3 h-3 ${isActive ? r.accentText : "text-fortress-charcoal/40"}`} />
              </div>
              <span className="hidden sm:block">{r.title}</span>
              <span className="sm:hidden text-xs">{r.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* ── Role detail card ── */}
      <div className={`rounded-2xl border bg-gradient-to-br ${role.color} ${role.accentBorder} p-6 md:p-8`}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center shrink-0`}>
            <role.Icon className={`w-6 h-6 ${role.accentText}`} />
          </div>
          <div>
            <h3 className={`font-black text-xl ${role.accentText}`}>{role.title}</h3>
            <p className="text-fortress-charcoal/50 text-xs font-mono tracking-widest uppercase">{role.subtitle}</p>
            <p className="text-fortress-charcoal/70 text-sm mt-1 leading-relaxed">{role.tagline}</p>
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white/60 rounded-xl p-4">
            <p className="text-fortress-charcoal/50 text-[10px] uppercase tracking-widest mb-1">Mức tham gia</p>
            <p className={`font-black text-base ${role.accentText}`}>{role.minCapital}</p>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <p className="text-fortress-charcoal/50 text-[10px] uppercase tracking-widest mb-1">Cổ phần mục tiêu</p>
            <p className={`font-black text-base ${role.accentText}`}>{role.equity}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Requirements */}
          <div className="bg-white/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${role.accentText}`} />
              <p className="font-semibold text-fortress-charcoal text-xs uppercase tracking-wider">Điều Kiện Tham Gia</p>
            </div>
            <ul className="space-y-2">
              {role.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-fortress-charcoal/70 leading-relaxed">
                  <span className={`shrink-0 mt-0.5 font-bold ${role.accentText}`}>·</span>{r}
                </li>
              ))}
            </ul>
          </div>
          {/* Rights */}
          <div className="bg-white/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${role.accentText}`} />
              <p className="font-semibold text-fortress-charcoal text-xs uppercase tracking-wider">Quyền Lợi</p>
            </div>
            <ul className="space-y-2">
              {role.rights.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${role.accentText}`} />
                  <span className="text-xs text-fortress-charcoal/70 leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Obligations */}
          <div className="bg-white/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${role.accentText}`} />
              <p className="font-semibold text-fortress-charcoal text-xs uppercase tracking-wider">Nghĩa Vụ</p>
            </div>
            <ul className="space-y-2">
              {role.obligations.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-fortress-charcoal/70 leading-relaxed">
                  <ArrowRight className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tasks */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className={`w-3.5 h-3.5 shrink-0 ${role.accentText}`} />
            <p className="font-semibold text-fortress-charcoal text-xs uppercase tracking-wider">Công Việc Cụ Thể Cần Hoàn Thành</p>
          </div>
          <div className="space-y-2">
            {role.tasks.map((task, i) => (
              <div key={i} className="bg-white/60 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/80 transition-colors"
                  onClick={() => setExpandedTask(expandedTask === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-black ${role.accentText}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-semibold text-fortress-charcoal text-sm">{task.label}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-fortress-charcoal/40 hidden sm:block">{task.deadline}</span>
                    {expandedTask === i
                      ? <ChevronUp className="w-4 h-4 text-fortress-charcoal/40" />
                      : <ChevronDown className="w-4 h-4 text-fortress-charcoal/40" />}
                  </div>
                </button>
                {expandedTask === i && (
                  <div className="px-4 pb-4 border-t border-white/60">
                    <p className="text-fortress-charcoal/65 text-xs leading-relaxed mt-3">{task.detail}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock className={`w-3 h-3 shrink-0 ${role.accentText}`} />
                      <p className={`text-xs font-semibold ${role.accentText}`}>{task.deadline}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documents for this role */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className={`w-3.5 h-3.5 shrink-0 ${role.accentText}`} />
            <p className="font-semibold text-fortress-charcoal text-xs uppercase tracking-wider">Hồ Sơ Cần Chuẩn Bị</p>
          </div>
          <div className="space-y-2">
            {role.docs.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3.5">
                <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${doc.required ? role.accentText : "text-fortress-charcoal/30"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-fortress-charcoal font-medium text-xs">{doc.name}</p>
                  <p className="text-fortress-charcoal/50 text-[11px] mt-0.5">{doc.note}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.required && (
                    <span className="text-[10px] bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded font-semibold">Bắt buộc</span>
                  )}
                  {doc.templateUrl && (
                    <a href={doc.templateUrl} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1 text-[11px] font-semibold ${role.accentText} hover:underline`}>
                      <ExternalLink className="w-3 h-3" /> Mẫu
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 pt-5 border-t border-white/40 flex flex-col sm:flex-row gap-3">
          <Link
            href="/invest-with-fortress#enquiry"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-xs uppercase tracking-[0.12em] rounded-xl transition-all bg-gradient-to-r from-fortress-gold to-fortress-champagne text-fortress-navy hover:opacity-90 shadow-lg"
          >
            Đăng Ký Vai Trò {role.title} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-fortress-charcoal/20 text-fortress-charcoal font-semibold text-xs uppercase tracking-[0.12em] rounded-xl hover:bg-fortress-navy/5 transition-all"
          >
            Tư Vấn Trực Tiếp
          </Link>
        </div>
      </div>

      {/* ── Full document checklist ── */}
      <div>
        <div className="text-center mb-6">
          <span className="section-tag">Toàn Bộ Hồ Sơ Cấp Phép</span>
          <h3 className="font-light text-fortress-navy uppercase mt-3 leading-tight"
            style={{ fontSize: "var(--text-h2)", letterSpacing: "var(--tracking-heading)" }}>
            11 Nhóm Giấy Tờ Theo Điều 9 NQ5/2025
          </h3>
          <p className="text-fortress-charcoal/60 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Toàn bộ hồ sơ phải nộp 1 bộ cho Bộ Tài chính. Dưới đây là danh mục đầy đủ — phân theo nhóm để các đối tác dễ chuẩn bị.
          </p>
        </div>
        <div className="space-y-3 max-w-4xl mx-auto">
          {DOC_GROUPS.map((grp, gi) => (
            <div key={gi} className={`rounded-xl border ${grp.color} overflow-hidden`}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-black/5 transition-colors"
                onClick={() => setExpandedDocGroup(expandedDocGroup === gi ? null : gi)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${grp.iconBg}`}>
                    <grp.Icon className={`w-4 h-4 ${grp.iconColor}`} />
                  </div>
                  <span className="font-semibold text-fortress-navy text-sm">{grp.group}</span>
                  <span className="text-fortress-charcoal/40 text-xs">({grp.items.length} tài liệu)</span>
                </div>
                {expandedDocGroup === gi
                  ? <ChevronUp className="w-4 h-4 text-fortress-charcoal/40" />
                  : <ChevronDown className="w-4 h-4 text-fortress-charcoal/40" />}
              </button>
              {expandedDocGroup === gi && (
                <div className="px-5 pb-4 space-y-2 border-t border-black/5">
                  {grp.items.map((doc, di) => (
                    <div key={di} className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                      <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${doc.required ? grp.iconColor : "text-fortress-charcoal/30"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-fortress-charcoal font-medium text-xs">{doc.name}</p>
                        <p className="text-fortress-charcoal/50 text-[11px] mt-0.5">{doc.note}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.required && (
                          <span className="text-[10px] bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded font-semibold">Bắt buộc</span>
                        )}
                        {doc.templateUrl && (
                          <a href={doc.templateUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] font-semibold text-fortress-gold hover:underline">
                            <ExternalLink className="w-3 h-3" /> Tải mẫu
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
