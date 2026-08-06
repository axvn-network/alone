

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Fortress Investment Holdings",
  description:
    "Chính sách bảo mật thông tin của Fortress Investment Holdings. Tìm hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      

      <section className="bg-white pt-24 md:pt-32 pb-12 md:pb-20 text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="text-fortress-gold text-xs md:text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
            Pháp Lý
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-fortress-navy mb-4">
            Chính Sách Bảo Mật Quyền Riêng Tư
          </h1>
          <p className="text-fortress-charcoal/70 text-sm">
            Cập nhật lần cuối: 2026
          </p>
        </div>
      </section>

      <section className="bg-white my-8 md:my-12 mx-2 sm:mx-4 rounded-2xl py-12 md:py-20 px-6 lg:px-20">
        <div className="max-w-[860px] mx-auto">
          <div className="space-y-10 text-fortress-charcoal/70 leading-relaxed text-sm sm:text-base">

            <p>
              Fortress Investment Holdings luôn tôn trọng quyền riêng tư của mọi người dùng truy cập website, liên hệ với chúng tôi hoặc gửi thông tin qua các biểu mẫu trực tuyến.
            </p>
            <p>
              Chính sách bảo mật này giải thích cách thức chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.
            </p>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Thông Tin Chúng Tôi Thu Thập</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Họ và tên, tên công ty và chức danh</li>
                <li>Địa chỉ Email, số điện thoại và quốc gia</li>
                <li>Thông tin chi tiết về đề xuất kinh doanh, đầu tư hoặc hợp tác</li>
                <li>Các tài liệu được tải lên qua trang web</li>
                <li>Thông tin sử dụng trang web, thiết bị và trình duyệt, bao gồm địa chỉ IP</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Cách Thức Sử Dụng Thông Tin</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Phản hồi các câu hỏi và giao tiếp trực tiếp với người dùng</li>
                <li>Đánh giá các cơ hội đầu tư và đề xuất thâu tóm doanh nghiệp</li>
                <li>Thẩm định các yêu cầu hợp tác liên doanh</li>
                <li>Cung cấp thông tin theo yêu cầu của đối tác</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Bảo Mật Tài Liệu Tải Lên</h2>
              <p>
                Tài liệu tải lên qua website được cam kết bảo mật theo tiêu chuẩn nội bộ. Vui lòng chỉ cung cấp các thông tin bạn được quyền chia sẻ.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Cookie & Công Nghệ Theo Dõi</h2>
              <p>
                Website có thể sử dụng cookie để nâng cao trải nghiệm người dùng, phân tích lưu lượng truy cập và hỗ trợ tối ưu hóa nội dung thông qua Google Analytics và Meta Pixel.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Bảo Mật Dữ Liệu</h2>
              <p>
                Chúng tôi áp dụng các biện pháp quản lý, kỹ thuật và tổ chức phù hợp để bảo vệ thông tin khỏi các truy cập trái phép, rò rỉ hoặc mất mát.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Liên Hệ</h2>
              <p>Mọi thắc mắc liên quan đến quyền riêng tư, vui lòng liên hệ:</p>
              <div className="mt-3 space-y-1 font-medium">
                <p>Fortress Investment Holdings</p>
                <p>Email: info@fortressih.com</p>
                <p>Địa chỉ: Dubai, Các Quốc Gia Ả Rập Thống Nhất</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      
    </main>
  );
}
