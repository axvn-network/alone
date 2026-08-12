import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cách Chúng Tôi Xây Dựng | GVI Tech Holding",
  description:
    "Quy trình đầu tư 5 bước và 9 tiêu chí đánh giá không thể thỏa hiệp của GVI Tech Holding — minh bạch, có thể kiểm chứng.",
};

export default function OurApproachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
