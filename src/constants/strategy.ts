import {
  Building2,
  CalendarRange,
  CircleDollarSign,
  Clapperboard,
  Code2,
  Eye,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  ROADMAP_PHASES,
  type RoadmapPhase,
} from "@/data/roadmap";

export type StrategyValueId =
  | "sovereignty"
  | "compliance"
  | "transparency"
  | "innovation"
  | "inclusion";

export interface StrategyValue {
  id: StrategyValueId;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Public-safe synthesis; verify before changing:
 * [chien-luoc-2026-2031-chien-luoc-2026-2031-chien-luoc-tong-the | _extracted/CHIEN_LUOC_2026_2031/CHIEN_LUOC_2026_2031/CHIEN_LUOC_TONG_THE.md]
 */
export const CORE_VALUES: readonly StrategyValue[] = [
  { id: "sovereignty", title: "Chủ Quyền Số", description: "Củng cố năng lực làm chủ hạ tầng, dữ liệu và sở hữu trí tuệ của hệ sinh thái.", icon: Network },
  { id: "compliance", title: "Tuân Thủ", description: "Đối chiếu yêu cầu pháp lý áp dụng, an toàn thông tin và thẩm quyền phê duyệt trước triển khai.", icon: Scale },
  { id: "transparency", title: "Minh Bạch", description: "Công bố thông tin có nguồn, nêu rõ giới hạn và không diễn giải kế hoạch là kết quả đã đạt được.", icon: Eye },
  { id: "innovation", title: "Đổi Mới", description: "Duy trì nghiên cứu, phát triển và thử nghiệm năng lực công nghệ theo nhu cầu thực tiễn.", icon: Sparkles },
  { id: "inclusion", title: "Tiếp Cận Có Trách Nhiệm", description: "Thiết kế trải nghiệm số có tính bao trùm trong phạm vi phù hợp với điều kiện triển khai.", icon: WalletCards },
];

export interface Subsidiary {
  id: string;
  name: string;
  description: string;
  services: readonly string[];
  icon: LucideIcon;
}

/** Public-safe operating model synthesis; see source citation above. */
export const SUBSIDIARIES: readonly Subsidiary[] = [
  {
    id: "financial-trading",
    name: "Tài chính số & quản trị tài sản số",
    description: "Nghiên cứu năng lực tài chính số và quản trị tài sản số, phụ thuộc đánh giá pháp lý, rủi ro và phê duyệt phù hợp.",
    services: ["Nghiên cứu sản phẩm", "Tuân thủ", "Quản trị rủi ro"],
    icon: Landmark,
  },
  {
    id: "payment-commerce",
    name: "Thanh toán & thương mại",
    description: "Nghiên cứu trải nghiệm thanh toán, thương mại và kết nối đối tác theo các điều kiện triển khai phù hợp.",
    services: ["Trải nghiệm số", "Tích hợp đối tác", "Nghiên cứu thị trường"],
    icon: CircleDollarSign,
  },
  {
    id: "entertainment-web3",
    name: "Web3 & trải nghiệm số",
    description: "Khám phá ứng dụng Web3, nội dung và trải nghiệm số trong phạm vi an toàn, phù hợp và có trách nhiệm.",
    services: ["Trải nghiệm số", "R&D", "Quản trị nội dung"],
    icon: Clapperboard,
  },
  {
    id: "holding-rd",
    name: "R&D & hạ tầng công nghệ",
    description: "Phát triển năng lực nghiên cứu, hạ tầng, an toàn thông tin và định hướng kiến trúc chung.",
    services: ["An toàn thông tin", "Nghiên cứu & phát triển", "Kiến trúc hệ thống"],
    icon: Code2,
  },
];

/**
 * Compatibility alias for legacy consumers.
 * The canonical roadmap lives in src/data/roadmap.ts.
 */
export type StrategicRoadmapPhase = RoadmapPhase;
export const STRATEGIC_ROADMAP = ROADMAP_PHASES;

/** Structural counts only; not financial, performance, or completion metrics. */
export const STRATEGY_AT_A_GLANCE = [
  {
    value: STRATEGIC_ROADMAP.length,
    label: "giai đoạn tham chiếu",
    description: "Trải từ 2026 đến 2031; trình bày theo thứ tự để dễ theo dõi.",
    icon: CalendarRange,
  },
  {
    value: SUBSIDIARIES.length,
    label: "mảng năng lực",
    description: "Được đặt trong cùng một mô hình điều phối định hướng của GVI Group.",
    icon: Building2,
  },
  {
    value: CORE_VALUES.length,
    label: "nguyên tắc định hướng",
    description: "Là khung đọc nội dung, không phải chỉ số đánh giá hiệu quả hay kết quả thực hiện.",
    icon: ShieldCheck,
  },
] as const;

export const STRATEGY_KEYS = {
  section: "strategy.section",
  vision: "strategy.vision",
  mission: "strategy.mission",
  values: "strategy.coreValues",
  operatingModel: "strategy.operatingModel",
  roadmap: "strategy.roadmap",
} as const;
