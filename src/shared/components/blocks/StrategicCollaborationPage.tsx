import Link from "next/link";
import { ArrowRight, Users, Scale, ShieldCheck } from "lucide-react";
import PageHero from "@/shared/components/blocks/PageHero";
import { Section } from "@/shared/components/ui/Primitives";
import SectionHeader from "@/shared/components/blocks/SectionHeader";
import StrategyNotice from "@/shared/components/blocks/StrategyNotice";

const POINTS = [
  {
    icon: Users,
    title: "Hợp Tác Năng Lực",
    description:
      "AXVN tiếp nhận trao đổi với tổ chức, chuyên gia và đối tác có năng lực phù hợp với từng hướng phát triển.",
  },
  {
    icon: Scale,
    title: "Theo Điều Kiện Áp Dụng",
    description:
      "Mọi thỏa thuận, dịch vụ và hoạt động triển khai chỉ được xem xét sau đánh giá pháp lý, quản trị và phê duyệt phù hợp.",
  },
  {
    icon: ShieldCheck,
    title: "Minh Bạch Về Rủi Ro",
    description:
      "Trang này không chào bán chứng khoán, không nhận góp vốn trực tuyến và không cam kết kết quả hay giấy phép.",
  },
] as const;

export default function StrategicCollaborationPage({
  variant,
}: {
  variant: "overview" | "plans" | "charter";
}) {
  const copy = {
    overview: {
      tag: "Kết Nối Hợp Tác",
      heading: "Cùng Phát Triển Năng Lực Hệ Sinh Thái",
      description:
        "Trao đổi định hướng và năng lực hợp tác với AXVN Tech Holding.",
    },
    plans: {
      tag: "Khung Hợp Tác",
      heading: "Vai Trò Được Xác Định Theo Từng Thỏa Thuận",
      description:
        "Không có gói đầu tư công khai; mọi đề xuất được đánh giá theo năng lực, pháp lý và phê duyệt nội bộ.",
    },
    charter: {
      tag: "Nguyên Tắc Hợp Tác",
      heading: "Rõ Vai Trò. Đúng Thẩm Quyền. Tôn Trọng Tuân Thủ.",
      description:
        "Các quyền và nghĩa vụ chỉ phát sinh từ văn bản được ký kết hợp lệ.",
    },
  }[variant];
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero {...copy} />
      <Section dark>
        <SectionHeader
          tag="Nguyên Tắc Chung"
          heading="Hợp Tác Có Trách Nhiệm"
          description="AXVN ưu tiên năng lực thực chất, quản trị rủi ro và sự phù hợp với định hướng hệ sinh thái."
          dark
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border border-AXVN-gold/15 bg-AXVN-deep p-6"
            >
              <Icon className="h-6 w-6 text-AXVN-gold" />
              <h2 className="mt-5 font-semibold text-AXVN-ivory">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-AXVN-silver/70">
                {description}
              </p>
            </article>
          ))}
        </div>
        <StrategyNotice dark className="mt-10" />
      </Section>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader
            tag="Bước Tiếp Theo"
            heading="Tìm Hiểu Nguồn Tham Chiếu"
            description="Đọc lộ trình chiến lược và gửi yêu cầu liên hệ để được phản hồi theo quy trình phù hợp."
          />
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 bg-AXVN-navy px-6 py-3 text-xs font-semibold text-AXVN-ivory"
            >
              LỘ TRÌNH <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="border border-AXVN-gold/40 px-6 py-3 text-xs font-semibold text-AXVN-gold"
            >
              LIÊN HỆ
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
