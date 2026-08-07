import PageHero from "@/components/PageHero";
import ProseDoc, { ProseNote } from "@/components/ProseSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng",
  description:
    "Điều khoản sử dụng website Fortress Investment Holdings. Vui lòng đọc kỹ các điều khoản trước khi truy cập dịch vụ.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag="Pháp Lý"
        heading="Điều Khoản Sử Dụng Website"
        description="Khi truy cập hoặc sử dụng website Fortress Investment Holdings, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng tạm dừng sử dụng website."
      />

      <section
        className="bg-white section-mx section-my"
        style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
      >
        <div className="max-w-[860px] mx-auto section-px">
          {/* Ngày cập nhật */}
          <div className="flex items-center gap-3 mb-10 md:mb-14 pb-6 border-b border-fortress-gold/15">
            <div className="w-1.5 h-1.5 rounded-full bg-fortress-gold/60" />
            <p className="text-fortress-charcoal/45 text-xs font-mono tracking-widest uppercase">Cập nhật lần cuối: 2025</p>
          </div>

          <ProseDoc
            sections={[
              {
                id: "purpose",
                title: "Mục Đích Website",
                content: (
                  <>
                    <p>
                      Website này cung cấp thông tin tổng quan về Fortress Investment Holdings, các hoạt động đầu tư,
                      lĩnh vực quan tâm và đối tác chiến lược.
                    </p>
                    <ProseNote>
                      Nội dung trên website không cấu thành lời đề nghị, khuyến nghị hay chào mời mua bán, đầu tư
                      vào bất kỳ sản phẩm tài chính hoặc tài sản nào.
                    </ProseNote>
                  </>
                ),
              },
              {
                id: "accuracy",
                title: "Tính Chính Xác Của Thông Tin",
                content: (
                  <p>
                    Chúng tôi nỗ lực cung cấp thông tin chính xác nhưng không bảo đảm tính hoàn toàn đầy đủ hay không có sai sót.
                    Nội dung có thể được cập nhật mà không cần thông báo trước.
                  </p>
                ),
              },
              {
                id: "no-advice",
                title: "Miễn Trừ Tư Vấn Chuyên Môn",
                content: (
                  <>
                    <p>
                      Thông tin được cung cấp chỉ mang tính chất tham khảo chung và không được coi là tư vấn
                      tài chính, đầu tư, pháp lý hay thuế.
                    </p>
                    <p className="mt-3">
                      Vui lòng tham khảo ý kiến cố vấn độc lập có chuyên môn trước khi đưa ra bất kỳ quyết định
                      đầu tư hay tài chính nào.
                    </p>
                  </>
                ),
              },
              {
                id: "proposals",
                title: "Gửi Đề Xuất Đầu Tư",
                content: (
                  <>
                    <p>
                      Việc gửi đề xuất qua website này không bảo đảm rằng đề xuất sẽ được xem xét hay chấp nhận,
                      và không tạo ra bất kỳ cam kết đầu tư, quan hệ đối tác hay nghĩa vụ hợp đồng nào.
                    </p>
                    <ProseNote>
                      Fortress Investment Holdings có toàn quyền chấp nhận, từ chối hoặc không phản hồi bất kỳ đề xuất nào
                      mà không cần nêu lý do.
                    </ProseNote>
                  </>
                ),
              },
              {
                id: "ip",
                title: "Sở Hữu Trí Tuệ",
                content: (
                  <p>
                    Trừ khi có quy định khác, toàn bộ nội dung website bao gồm thương hiệu, logo, thiết kế, văn bản,
                    đồ họa và tài liệu đều thuộc sở hữu hoặc được cấp phép cho Fortress Investment Holdings.
                    Nội dung không được sao chép, chỉnh sửa, tái bản, phân phối hay sử dụng cho mục đích thương mại
                    khi chưa có sự cho phép bằng văn bản.
                  </p>
                ),
              },
              {
                id: "third-party",
                title: "Liên Kết Bên Thứ Ba",
                content: (
                  <p>
                    Website có thể chứa liên kết đến các website bên thứ ba. Fortress Investment Holdings không chịu trách nhiệm
                    về nội dung, chính sách bảo mật, tính khả dụng hay độ chính xác của các trang đó.
                    Việc truy cập các website bên thứ ba hoàn toàn theo quyết định của bạn.
                  </p>
                ),
              },
              {
                id: "liability",
                title: "Giới Hạn Trách Nhiệm",
                content: (
                  <p>
                    Trong phạm vi tối đa được pháp luật cho phép, Fortress Investment Holdings không chịu trách nhiệm
                    về các tổn thất, thiệt hại, chi phí hoặc nghĩa vụ phát sinh từ việc sử dụng website, phụ thuộc vào nội dung,
                    gián đoạn kỹ thuật, sự cố bảo mật ngoài tầm kiểm soát, liên kết bên thứ ba, hoặc các quyết định đầu tư,
                    kinh doanh của người dùng.
                  </p>
                ),
              },
              {
                id: "law",
                title: "Luật Điều Chỉnh",
                content: (
                  <p>
                    Các điều khoản sử dụng này được điều chỉnh bởi pháp luật hiện hành của Các Tiểu Vương Quốc Ả Rập Thống Nhất
                    và các quy định của tiểu vương quốc nơi Fortress Investment Holdings đăng ký hoạt động.
                  </p>
                ),
              },
              {
                id: "contact",
                title: "Liên Hệ",
                content: (
                  <>
                    <p>Mọi thắc mắc về các điều khoản này, vui lòng liên hệ:</p>
                    <div className="mt-4 p-5 bg-fortress-navy/3 border border-fortress-gold/12 rounded-sm space-y-1.5">
                      <p className="font-semibold text-fortress-navy">Fortress Investment Holdings</p>
                      <p>Email: <a href="mailto:legal@fortressih.com" className="text-fortress-gold hover:underline font-medium">legal@fortressih.com</a></p>
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
