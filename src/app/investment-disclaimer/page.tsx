import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuyên Bố Miễn Trừ Trách Nhiệm | Fortress Investment Holdings",
  description:
    "Cảnh báo rủi ro và tuyên bố miễn trừ trách nhiệm đầu tư của Fortress Investment Holdings.",
};

export default function InvestmentDisclaimerPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-white pt-24 md:pt-32 pb-12 md:pb-20 text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="text-fortress-gold text-xs md:text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
            Pháp Lý
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-fortress-navy mb-4">
            Tuyên Bố Miễn Trừ Trách Nhiệm Đầu Tư
          </h1>
          <p className="text-fortress-charcoal/70 text-sm">Cảnh Báo Rủi Ro Đầu Tư</p>
        </div>
      </section>

      <section className="bg-white my-8 md:my-12 mx-2 sm:mx-4 rounded-2xl py-12 md:py-20 px-6 lg:px-20">
        <div className="max-w-[860px] mx-auto">
          <div className="space-y-10 text-fortress-charcoal/70 leading-relaxed text-sm sm:text-base">

            <p>
              Thông tin trên website này được cung cấp chỉ nhằm mục đích tham khảo chung.
            </p>
            <p>
              Không có bất kỳ nội dung nào cấu thành lời khuyên đầu tư, tư vấn tài chính, pháp lý, thuế hay một cam kết đảm bảo lợi nhuận nào từ phía Fortress.
            </p>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Rủi Ro Đầu Tư</h2>
              <p>
                Tất cả các hình thức đầu tư đều tiềm ẩn rủi ro. Giá trị các khoản đầu tư bao gồm bất động sản, công ty tư nhân, tài sản số có thể tăng hoặc giảm. Nhà đầu tư có thể mất một phần hoặc toàn bộ số vốn đã giải ngân.
              </p>
              <p className="mt-4">
                Kết quả hoạt động trong quá khứ không phải là chỉ báo hay sự bảo đảm cho hiệu quả trong tương lai.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Tính Thanh Khoản Của Tài Sản</h2>
              <p>
                Các khoản đầu tư vào doanh nghiệp tư nhân, M&A hay bất động sản có thể có tính thanh khoản thấp.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Rủi Ro Tài Sản Số</h2>
              <p>
                Các khoản đầu tư liên quan đến tài sản số có thể chịu biến động mạnh, bất ổn pháp lý, rủi ro an ninh mạng, rủi ro công nghệ, rủi ro thanh khoản, rủi ro lưu ký và khả năng mất toàn bộ vốn.
              </p>
              <p className="mt-4">
                Việc đề cập đến blockchain hoặc tài sản số trên website này không được hiểu là khuyến nghị mua, bán hay nắm giữ bất kỳ tài sản số nào.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Tư Vấn Độc Lập</h2>
              <p>
                Bất kỳ cá nhân nào cân nhắc đầu tư, mua lại, hợp tác hay giao dịch đều nên tự thực hiện thẩm định độc lập và tham khảo ý kiến từ các chuyên gia tài chính, pháp lý, thuế, kế toán và pháp lý có chuyên môn.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Không Bảo Đảm Lợi Nhuận</h2>
              <p>
                Fortress Investment Holdings không bảo đảm lợi nhuận đầu tư, bảo vệ vốn, thu nhập, khả năng sinh lợi, hiệu quả kinh doanh, tăng giá trị tài sản, hoàn thành thành công bất kỳ giao dịch nào hay khả năng thoái vốn.
              </p>
              <p className="mt-4">
                Mọi dự báo, kế hoạch, mục tiêu hay kỳ vọng đều chịu ảnh hưởng của sự không chắc chắn và có thể không đạt được.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Tình Trạng Pháp Lý</h2>
              <p>
                Việc đăng tải thông tin liên quan đến đầu tư trên website này không có nghĩa là Fortress Investment Holdings cung cấp các dịch vụ tài chính được quản lý trừ khi các dịch vụ đó được cơ quan quản lý có thẩm quyền cấp phép cụ thể.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
