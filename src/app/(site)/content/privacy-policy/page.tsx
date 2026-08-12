import PageHero from "@/components/public/PageHero";
import ProseDoc, { ProseList, ProseNote } from "@/components/public/ProseSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Chính sách bảo mật thông tin của GVI Tech Holding — cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag="Pháp Lý"
        heading="Chính Sách Bảo Mật Quyền Riêng Tư"
        description="GVI Tech Holding tôn trọng quyền riêng tư của mọi người dùng. Tài liệu này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn."
      />

      <section
        className="bg-white section-mx section-my"
        style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
      >
        <div className="max-w-[860px] mx-auto section-px">
          {/* Ngày cập nhật */}
          <div className="flex items-center gap-3 mb-10 md:mb-14 pb-6 border-b border-gvi-gold/15">
            <div className="w-1.5 h-1.5 rounded-full bg-gvi-gold/60" />
            <p className="text-gvi-charcoal/45 text-xs font-mono tracking-widest uppercase">Cập nhật lần cuối: 2025</p>
          </div>

          <ProseDoc
            sections={[
              {
                id: "intro",
                title: "Cam Kết Bảo Mật",
                content: (
                  <p>
                    GVI Tech Holding luôn tôn trọng quyền riêng tư của mọi người dùng truy cập website,
                    liên hệ với chúng tôi hoặc gửi thông tin qua các biểu mẫu trực tuyến.
                    Chính sách này giải thích cách thức chúng tôi xử lý dữ liệu cá nhân của bạn một cách minh bạch và có trách nhiệm.
                  </p>
                ),
              },
              {
                id: "collection",
                title: "Thông Tin Chúng Tôi Thu Thập",
                content: (
                  <>
                    <p>Chúng tôi có thể thu thập các loại thông tin sau khi bạn tương tác với website hoặc liên hệ trực tiếp:</p>
                    <ProseList items={[
                      "Họ và tên, tên công ty và chức danh nghề nghiệp",
                      "Địa chỉ email, số điện thoại và quốc gia cư trú",
                      "Thông tin chi tiết về đề xuất kinh doanh, đầu tư hoặc hợp tác",
                      "Tài liệu được tải lên qua trang web",
                      "Dữ liệu sử dụng website: thiết bị, trình duyệt, địa chỉ IP",
                    ]} />
                  </>
                ),
              },
              {
                id: "usage",
                title: "Cách Thức Sử Dụng Thông Tin",
                content: (
                  <>
                    <p>Thông tin thu thập được sử dụng cho các mục đích hợp pháp sau:</p>
                    <ProseList items={[
                      "Phản hồi các câu hỏi và giao tiếp trực tiếp với người dùng",
                      "Đánh giá các cơ hội đầu tư và đề xuất thâu tóm doanh nghiệp",
                      "Thẩm định các yêu cầu hợp tác, liên doanh chiến lược",
                      "Cung cấp thông tin cập nhật theo yêu cầu của đối tác",
                    ]} />
                  </>
                ),
              },
              {
                id: "documents",
                title: "Bảo Mật Tài Liệu Tải Lên",
                content: (
                  <>
                    <p>
                      Tài liệu tải lên qua website được bảo mật theo tiêu chuẩn nội bộ nghiêm ngặt của GVI Tech Holding.
                      Chỉ những nhân sự được ủy quyền mới có quyền truy cập.
                    </p>
                    <ProseNote>
                      Vui lòng chỉ cung cấp các thông tin bạn được quyền chia sẻ và không gửi tài liệu có tính bảo mật cao qua kênh không được mã hóa.
                    </ProseNote>
                  </>
                ),
              },
              {
                id: "cookies",
                title: "Cookie & Công Nghệ Theo Dõi",
                content: (
                  <p>
                    Website có thể sử dụng cookie và công nghệ tương tự để nâng cao trải nghiệm người dùng, phân tích lưu lượng truy cập
                    và hỗ trợ tối ưu hóa nội dung thông qua Google Analytics và Meta Pixel.
                    Bạn có thể điều chỉnh cài đặt cookie trong trình duyệt của mình bất kỳ lúc nào.
                  </p>
                ),
              },
              {
                id: "security",
                title: "Bảo Mật Dữ Liệu",
                content: (
                  <p>
                    Chúng tôi áp dụng các biện pháp quản lý, kỹ thuật và tổ chức phù hợp để bảo vệ thông tin khỏi
                    các truy cập trái phép, rò rỉ hoặc mất mát. Tuy nhiên, không có phương thức truyền tải nào qua Internet
                    được bảo đảm hoàn toàn an toàn tuyệt đối.
                  </p>
                ),
              },
              {
                id: "contact",
                title: "Liên Hệ Về Quyền Riêng Tư",
                content: (
                  <>
                    <p>Mọi thắc mắc liên quan đến quyền riêng tư và dữ liệu cá nhân, vui lòng liên hệ với chúng tôi qua:</p>
                    <div className="mt-4 p-5 bg-gvi-navy/3 border border-gvi-gold/12 rounded-sm space-y-1.5">
                      <p className="font-semibold text-gvi-navy">GVI Tech Holding</p>
                      <p>Email: <a href="mailto:info@gvitech.vn" className="text-gvi-gold hover:underline font-medium">info@gvitech.vn</a></p>
                      <p>Địa chỉ: Dubai, Các Tiểu Vương Quốc Ả Rập Thống Nhất</p>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
