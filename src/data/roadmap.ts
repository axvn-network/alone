/**
 * src/data/roadmap.ts
 *
 * Single source of truth cho lộ trình chiến lược 2026–2031.
 * Tất cả component render roadmap đều import từ đây.
 * constants/strategy.ts re-export STRATEGIC_ROADMAP từ file này để backward-compat.
 *
 * Nguồn gốc: tổng hợp công khai từ bộ tài liệu chiến lược GVI 2026–2031.
 * Mọi giai đoạn là kế hoạch có điều kiện, không phải kết quả đã đạt được.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RoadmapPhase {
  /** Số thứ tự, bắt đầu từ 1 */
  sequence: number;
  /** Năm tham chiếu dạng string để dùng trong UI timeline */
  year: string;
  /** Năm tham chiếu dạng number để tính toán */
  yearNum: number;
  /** Tiêu đề ngắn của giai đoạn */
  title: string;
  /** Chủ đề tiếng Anh (badge) */
  theme: string;
  /** Mô tả 1-2 câu */
  detail: string;
  /** Tối đa 4 điểm nổi bật */
  highlights: readonly string[];
  /** Màu accent cho visual — tailwind class */
  accentColor: string;
}

export interface RoadmapMeta {
  /** Năm bắt đầu toàn bộ roadmap */
  startYear: number;
  /** Năm kết thúc */
  endYear: number;
  /** Năm dùng để định vị "hiện tại" khi đọc v1.0.0 */
  referenceYear: number;
  /** Phiên bản tài liệu */
  version: string;
}

// ─── Meta ────────────────────────────────────────────────────────────────────

export const ROADMAP_META: RoadmapMeta = {
  startYear: 2026,
  endYear: 2031,
  referenceYear: 2026,
  version: "1.0.0",
};

// ─── Data ────────────────────────────────────────────────────────────────────

export const ROADMAP_PHASES: readonly RoadmapPhase[] = [
  {
    sequence: 1,
    year: "2026",
    yearNum: 2026,
    title: "Xây Nền Tảng",
    theme: "Build & Govern",
    detail:
      "Củng cố nền tảng quản trị, sở hữu trí tuệ, hạ tầng kỹ thuật và năng lực tuân thủ.",
    highlights: [
      "Rà soát nền tảng quản trị",
      "Chuẩn bị khung tuân thủ",
      "Bảo vệ sở hữu trí tuệ",
    ],
    accentColor: "bg-gvi-gold",
  },
  {
    sequence: 2,
    year: "2027",
    yearNum: 2027,
    title: "Kết Nối Năng Lực",
    theme: "Connect & Learn",
    detail:
      "Đánh giá nhu cầu, trải nghiệm thanh toán – thương mại và các phương án kết nối hệ sinh thái.",
    highlights: [
      "Đánh giá nhu cầu thị trường",
      "Kết nối đối tác chiến lược",
      "Rà soát an toàn thông tin",
    ],
    accentColor: "bg-blue-400",
  },
  {
    sequence: 3,
    year: "2028",
    yearNum: 2028,
    title: "Mở Rộng Có Kiểm Soát",
    theme: "Expand Responsibly",
    detail:
      "Phát triển năng lực hệ sinh thái khi điều kiện pháp lý, thị trường, nguồn lực và phê duyệt phù hợp.",
    highlights: [
      "R&D hạ tầng và nền tảng",
      "Trải nghiệm số có trách nhiệm",
      "Đánh giá điều kiện thị trường",
    ],
    accentColor: "bg-emerald-400",
  },
  {
    sequence: 4,
    year: "2029",
    yearNum: 2029,
    title: "Củng Cố Hạ Tầng",
    theme: "Strengthen & Secure",
    detail:
      "Tập trung vào kiến trúc, khả năng phục hồi, an toàn thông tin và quản trị vận hành.",
    highlights: [
      "Kiến trúc hệ thống vững chắc",
      "Quản trị dữ liệu và bảo mật",
      "Nâng cao năng lực vận hành",
    ],
    accentColor: "bg-purple-400",
  },
  {
    sequence: 5,
    year: "2030",
    yearNum: 2030,
    title: "Nâng Chuẩn Quản Trị",
    theme: "Mature & Align",
    detail:
      "Nâng năng lực quản trị, hợp tác chuyên môn và đánh giá khả năng mở rộng có kiểm soát.",
    highlights: [
      "Quản trị rủi ro toàn diện",
      "Hợp tác chuyên môn sâu",
      "Đánh giá khả thi mở rộng",
    ],
    accentColor: "bg-amber-400",
  },
  {
    sequence: 6,
    year: "2031",
    yearNum: 2031,
    title: "Định Hướng Dài Hạn",
    theme: "Sustain & Evolve",
    detail:
      "Rà soát kết quả, cập nhật định hướng và chuẩn bị giai đoạn tiếp theo theo các quyết định được phê duyệt.",
    highlights: [
      "Đánh giá kết quả toàn kỳ",
      "Cập nhật định hướng chiến lược",
      "Chuẩn bị giai đoạn tiếp theo",
    ],
    accentColor: "bg-sky-400",
  },
] as const;
