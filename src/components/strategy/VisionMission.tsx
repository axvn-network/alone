"use client";

import { Eye, Target } from "lucide-react";
import Stagger from "@/components/animations/Stagger";
import StaggerItem from "@/components/animations/StaggerItem";
import { Heading, SectionTag } from "@/components/ui/Primitives";

const statements = [
  {
    title: "Tầm Nhìn",
    headline: "Hệ Sinh Thái Số Có Chủ Quyền Và Trách Nhiệm",
    content: "Định hướng dài hạn là xây dựng hệ sinh thái công nghệ tài chính số có năng lực hạ tầng, quản trị và sở hữu trí tuệ; việc phát triển thị trường chỉ được xem xét khi điều kiện phù hợp.",
    icon: Eye,
    className: "bg-gvi-navy",
  },
  {
    title: "Sứ Mệnh",
    headline: "Kết Nối Hạ Tầng, Công Nghệ Và Quản Trị",
    content: "Nghiên cứu và phát triển các năng lực kết nối thanh toán, tài sản số, thương mại điện tử và trải nghiệm Web3 theo yêu cầu tuân thủ áp dụng, quản trị rủi ro và thẩm quyền phê duyệt.",
    icon: Target,
    className: "bg-gvi-deep",
  },
] as const;

export default function VisionMission() {
  return (
    <Stagger className="grid md:grid-cols-2 gap-5 md:gap-8">
      {statements.map(({ title, headline, content, icon: Icon, className }) => (
        <StaggerItem
          key={title}
          className={`${className} border border-gvi-gold/10 hover:border-gvi-gold/30 transition-all duration-300 rounded-2xl p-7 md:p-10`}
        >
          <div className="w-11 h-11 bg-gvi-gold/10 border border-gvi-gold/20 flex items-center justify-center rounded-sm mb-6">
            <Icon className="w-5 h-5 text-gvi-gold" aria-hidden="true" />
          </div>
          <SectionTag>{title}</SectionTag>
          <Heading level={3} className="text-gvi-ivory mb-4 leading-snug">
            {headline}
          </Heading>
          <p className="text-gvi-silver/80 leading-[1.8] text-body">
            {content}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
