

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng | Fortress Investment Holdings",
  description:
    "Điều khoản sử dụng website Fortress Investment Holdings. Vui lòng đọc kỹ các điều khoản trước khi truy cập dịch vụ.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white">
      

      <section className="bg-white pt-24 md:pt-32 pb-12 md:pb-20 text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="text-fortress-gold text-xs md:text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
            Pháp Lý
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-fortress-navy mb-4">
            Điều Khoản Sử Dụng Website
          </h1>
          <p className="text-fortress-charcoal/70 text-sm">
            Cập nhật lần cuối: 2026
          </p>
        </div>
      </section>

      <section className="bg-white my-8 md:my-12 mx-2 mx-2 sm:mx-4 rounded-2xl py-12 md:py-20 px-6 lg:px-20">
        <div className="max-w-[860px] mx-auto">
          <div className="space-y-10 text-fortress-charcoal/70 leading-relaxed text-sm sm:text-base">
            <p>
              Khi truy cập hoặc sử dụng website Fortress Investment Holdings, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu không đồng ý, vui lòng tạm dừng sử dụng website.
            </p>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Mục Đích Website</h2>
              <p>
                Website này cung cấp thông tin tổng quan về tập đoàn Fortress Investment Holdings, các hoạt động đầu tư, lĩnh vực quan tâm và đối tác chiến lược.
              </p>
              <p className="mt-4">
                Nội dung trên website không cấu thành một lời đề nghị, khuyến nghị hay chào mời mua bán, đầu tư vào bất kỳ sản phẩm tài chính hoặc tài sản nào.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Tính Chính Xác Của Thông Tin</h2>
              <p>
                Chúng tôi nỗ lực cung cấp thông tin chính xác nhưng không bảo đảm tính hoàn toàn đầy đủ hay không có sai sót. Nội dung có thể được cập nhật mà không cần thông báo trước.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Miễn Trừ Tư Vấn Chuyên Môn</h2>
              <p>
                Thông tin được cung cấp chỉ mang tính chất tham khảo chung và không được coi là tư vấn tài chính, đầu tư, pháp lý hay thuế.
              </p>
              <p className="mt-4">
                Vui lòng tham khảo ý kiến cố vấn độc lập trước khi đưa ra bất kỳ quyết định đầu tư hay tài chính nào.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Opportunity Submissions</h2>
              <p>
                Submitting an opportunity through this website does not guarantee review or acceptance, and does not create an investment commitment, partnership, advisory relationship, confidential relationship, agency relationship, or contractual obligation.
              </p>
              <p className="mt-4">
                Fortress Investment Holdings may accept, reject, or decline to respond to any submission at its sole discretion.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Intellectual Property</h2>
              <p>
                Unless otherwise stated, all website content, branding, logos, designs, text, graphics, and materials are owned by or licensed to Fortress Investment Holdings. Content may not be copied, modified, reproduced, distributed, republished, or used commercially without written permission.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Third-Party Links</h2>
              <p>
                The website may include links to third-party websites. Fortress Investment Holdings is not responsible for their content, privacy practices, availability, or accuracy. Accessing third-party websites is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, Fortress Investment Holdings shall not be responsible for losses, damages, costs, or liabilities arising from use of the website, reliance on its content, interruptions, technical errors, security incidents outside our reasonable control, third-party links, or investment or business decisions made by users.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Governing Law</h2>
              <p>
                These Terms of Use are governed by the applicable laws of the United Arab Emirates and the relevant laws and regulations of the Emirate in which Fortress Investment Holdings is registered.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Contact</h2>
              <p>Questions regarding these terms:</p>
              <div className="mt-3 space-y-1">
                <p>Email: [INSERT LEGAL EMAIL]</p>
                <p>Address: [INSERT OFFICE ADDRESS]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </main>
  );
}
