

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
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Digital Asset Risk</h2>
              <p>
                Digital asset-related investments may involve significant volatility, regulatory uncertainty, cybersecurity risk, technology risk, liquidity risk, custody risk, and the possibility of complete loss.
              </p>
              <p className="mt-4">
                References to blockchain or digital assets on this website should not be interpreted as a recommendation to purchase, sell, or hold any digital asset.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Independent Advice</h2>
              <p>
                Any person considering an investment, acquisition, partnership, or transaction should conduct independent due diligence and obtain advice from qualified financial, legal, tax, accounting, and regulatory professionals.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">No Guarantee</h2>
              <p>
                Fortress Investment Holdings does not guarantee investment returns, capital protection, income, profitability, business performance, asset appreciation, successful completion of any transaction, or availability of an exit.
              </p>
              <p className="mt-4">
                Any forecasts, projections, targets, or expectations are subject to uncertainty and may not be achieved.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Regulatory Status</h2>
              <p>
                The inclusion of investment-related information on this website does not imply that Fortress Investment Holdings provides regulated financial services unless such services are specifically authorised by the relevant regulatory authority.
              </p>
              <p className="mt-4 text-fortress-charcoal/50 text-xs">
                The final legal wording should accurately reflect the company&apos;s incorporation, licensing, activities, and regulatory permissions, and be reviewed by qualified UAE legal counsel.
              </p>
            </div>

          </div>
        </div>
      </section>

      
    </main>
  );
}
