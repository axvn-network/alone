import PageHero from "@/shared/components/blocks/PageHero";
import ProseDoc, { ProseNote } from "@/shared/components/blocks/ProseSection";
import type { Metadata } from "next";

// Static page — no DB queries. Cached at build time.
export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Tuyên Bố Miễn Trừ Trách Nhiệm",
  description:
    "Cảnh báo rủi ro và tuyên bố miễn trừ trách nhiệm đầu tư của AXVN Tech Holding.",
};

export default function InvestmentDisclaimerPage() {
  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      <PageHero
        tag="Pháp Lý"
        heading="Tuyên Bố Miễn Trừ Trách Nhiệm Đầu Tư"
        description="Thông tin trên website này được cung cấp chỉ nhằm mục đích tham khảo chung và không cấu thành lời khuyên đầu tư, tư vấn tài chính, pháp lý hay thuế dưới bất kỳ hình thức nào."
      />

      <section
        className="bg-white section-mx section-my"
        style={{
          paddingTop: "var(--section-py)",
          paddingBottom: "var(--section-py)",
        }}
      >
        <div className="max-w-[860px] mx-auto section-px">
          {/* Banner cảnh báo */}
          <div className="mb-10 md:mb-14 p-5 md:p-6 border border-amber-400/30 bg-amber-50/60 rounded-sm flex gap-4 items-start">
            <div className="w-5 h-5 rounded-full bg-amber-400/80 flex items-center justify-center shrink-0 mt-0.5">
              <svg
                viewBox="0 0 20 20"
                className="w-3 h-3 fill-white"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-amber-800/80 text-sm leading-relaxed">
              <strong className="font-semibold text-amber-900">
                Cảnh Báo Rủi Ro Đầu Tư:
              </strong>{" "}
              Mọi hình thức đầu tư đều tiềm ẩn rủi ro, bao gồm khả năng mất toàn
              bộ vốn. Không có bất kỳ cam kết bảo đảm lợi nhuận nào từ phía AXVN
              Tech Holding.
            </p>
          </div>

          <ProseDoc
            sections={[
              {
                id: "investment-risk",
                title: "Rủi Ro Đầu Tư",
                content: (
                  <>
                    <p>
                      Tất cả các hình thức đầu tư đều tiềm ẩn rủi ro. Giá trị
                      các khoản đầu tư — bao gồm bất động sản, công ty tư nhân,
                      tài sản số — có thể tăng hoặc giảm. Nhà đầu tư có thể mất
                      một phần hoặc toàn bộ số vốn đã giải ngân.
                    </p>
                    <ProseNote>
                      Kết quả hoạt động trong quá khứ không phải là chỉ báo hay
                      sự bảo đảm cho hiệu quả trong tương lai.
                    </ProseNote>
                  </>
                ),
              },
              {
                id: "liquidity",
                title: "Tính Thanh Khoản Của Tài Sản",
                content: (
                  <p>
                    Các khoản đầu tư vào doanh nghiệp tư nhân, thâu tóm M&amp;A
                    hay bất động sản thường có tính thanh khoản thấp. Nhà đầu tư
                    có thể không rút vốn được trong thời gian ngắn hoặc gặp khó
                    khăn khi thoái vốn theo mong muốn.
                  </p>
                ),
              },
              {
                id: "digital-assets",
                title: "Rủi Ro Tài Sản Số",
                content: (
                  <>
                    <p>
                      Các khoản đầu tư liên quan đến tài sản số có thể chịu biến
                      động giá mạnh, bất ổn pháp lý, rủi ro an ninh mạng, rủi ro
                      công nghệ, rủi ro thanh khoản, rủi ro lưu ký và khả năng
                      mất toàn bộ vốn.
                    </p>
                    <ProseNote>
                      Việc đề cập đến blockchain hoặc tài sản số trên website
                      này không được hiểu là khuyến nghị mua, bán hay nắm giữ
                      bất kỳ tài sản số nào.
                    </ProseNote>
                  </>
                ),
              },
              {
                id: "independent-advice",
                title: "Tư Vấn Độc Lập",
                content: (
                  <p>
                    Bất kỳ cá nhân hay tổ chức nào cân nhắc đầu tư, mua lại, hợp
                    tác hay giao dịch đều nên tự thực hiện thẩm định độc lập và
                    tham khảo ý kiến từ các chuyên gia tài chính, pháp lý, thuế
                    và kế toán có chuyên môn phù hợp trước khi ra quyết định.
                  </p>
                ),
              },
              {
                id: "no-guarantee",
                title: "Không Bảo Đảm Lợi Nhuận",
                content: (
                  <>
                    <p>
                      AXVN Tech Holding không bảo đảm lợi nhuận đầu tư, bảo vệ
                      vốn, thu nhập, khả năng sinh lợi, tăng giá trị tài sản,
                      hoàn thành thành công bất kỳ giao dịch nào, hay khả năng
                      thoái vốn theo kỳ vọng.
                    </p>
                    <p className="mt-3">
                      Mọi dự báo, kế hoạch, mục tiêu hay kỳ vọng đều chịu ảnh
                      hưởng của sự không chắc chắn và có thể không đạt được.
                    </p>
                  </>
                ),
              },
              {
                id: "legal-status",
                title: "Tình Trạng Pháp Lý & Quy Định",
                content: (
                  <p>
                    Việc đăng tải thông tin liên quan đến đầu tư trên website
                    này không có nghĩa là AXVN Tech Holding cung cấp các dịch vụ
                    tài chính được quản lý, trừ khi các dịch vụ đó được cơ quan
                    quản lý có thẩm quyền cấp phép cụ thể.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
