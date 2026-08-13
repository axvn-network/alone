import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cách Chúng Tôi Xây Dựng | AXVN Tech Holding",
  description:
    "Quy trình đầu tư 5 bước và 9 tiêu chí đánh giá không thể thỏa hiệp của AXVN Tech Holding — minh bạch, có thể kiểm chứng.",
};

export default function OurApproachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
