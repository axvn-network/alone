"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-AXVN-navy">
      <section className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-AXVN-gold text-sm font-medium tracking-[4px] uppercase mb-4">Lỗi Hệ Thống</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Đã Xảy Ra Lỗi</h1>
          <p className="text-AXVN-silver/60 text-lg max-w-xl mx-auto mb-10">
            Hệ thống gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ với chúng tôi nếu vấn đề tiếp diễn.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy font-bold text-sm tracking-widest hover:opacity-90 transition-opacity rounded-sm"
            >
              Thử Lại
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 border border-AXVN-gold text-AXVN-gold font-bold text-sm tracking-widest hover:bg-AXVN-gold/10 transition-all duration-300 rounded-sm"
            >
              Về Trang Chủ
            </Link>
          </div>
          <div className="mt-16 max-w-lg mx-auto bg-AXVN-deep p-8 md:p-10 rounded-2xl border border-AXVN-gold/10">
            <p className="text-AXVN-silver text-sm md:text-base leading-relaxed">
              Nếu vấn đề vẫn tiếp diễn, vui lòng{" "}
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
