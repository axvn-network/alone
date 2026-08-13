import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-AXVN-navy">
      <section className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-AXVN-gold text-sm font-medium tracking-[4px] uppercase mb-4">404</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Không Tìm Thấy Trang
          </h1>
          <p className="text-AXVN-silver/60 text-lg max-w-xl mx-auto mb-10">
            Trang bạn đang tìm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm tracking-widest hover:opacity-90 transition-opacity rounded-sm"
          >
            Về Trang Chủ
          </Link>
          <div className="mt-16 max-w-lg mx-auto bg-AXVN-deep p-8 md:p-10 rounded-2xl border border-AXVN-gold/10">
            <p className="text-AXVN-silver text-sm md:text-base leading-relaxed">
              Nếu bạn cho rằng đây là lỗi, vui lòng{" "}
              <Link href="/contact" className="text-AXVN-gold hover:underline">
                liên hệ với chúng tôi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
