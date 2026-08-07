export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
}

export const categoryColors: Record<string, string> = {
  "Bất Động Sản": "border-l-fortress-gold",
  "Thâu Tóm Doanh Nghiệp (M&A)": "border-l-blue-400",
  "Đầu Tư Tư Nhân (Private Equity)": "border-l-green-400",
  "Công Nghệ AI": "border-l-purple-400",
  "Tài Sản Số & Blockchain": "border-l-orange-400",
  "Khách Sạn & Nghỉ Dưỡng": "border-l-pink-400",
  "Thương Mại & Phân Phối": "border-l-cyan-400",
  "Góc Nhìn Thị Trường": "border-l-amber-400",
  "Tin Tức Tập Đoàn": "border-l-red-400",
  "Quản Lý Đầu Tư Chiến Lược": "border-l-teal-400",
};

export const categories = [
  { label: "Bất Động Sản" },
  { label: "Thâu Tóm Doanh Nghiệp (M&A)" },
  { label: "Đầu Tư Tư Nhân (Private Equity)" },
  { label: "Công Nghệ AI" },
  { label: "Tài Sản Số & Blockchain" },
  { label: "Khách Sạn & Nghỉ Dưỡng" },
  { label: "Thương Mại & Phân Phối" },
  { label: "Góc Nhìn Thị Trường" },
  { label: "Tin Tức Tập Đoàn" },
  { label: "Quản Lý Đầu Tư Chiến Lược" },
];
