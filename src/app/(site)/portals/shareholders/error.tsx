"use client";

import Link from "next/link";

/**
 * Route-level error boundary for the shareholder portal.
 * Catches errors within portals/shareholders/** without losing portal layout.
 */
export default function ShareholderPortalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-AXVN-deep border border-AXVN-gold/10 rounded-2xl p-8 text-center">
        <p className="text-AXVN-gold text-xs font-semibold tracking-[3px] uppercase mb-3">
          Lỗi Cổng Thông Tin
        </p>
        <h2 className="text-2xl font-bold text-white mb-3">
          Đã Xảy Ra Sự Cố
        </h2>
        <p className="text-AXVN-silver/60 text-sm mb-6 leading-relaxed">
          Cổng thông tin cổ đông gặp sự cố không mong muốn. Vui lòng thử lại
          hoặc liên hệ hỗ trợ nếu vấn đề tiếp diễn.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-gradient-to-r from-AXVN-gold to-AXVN-champagne text-AXVN-navy text-sm font-bold rounded-sm hover:opacity-90 transition-opacity"
          >
            Thử Lại
          </button>
          <Link
            href="/portals/shareholders/login"
            className="px-5 py-2.5 border border-AXVN-gold/40 text-AXVN-gold text-sm font-semibold rounded-sm hover:bg-AXVN-gold/10 transition-all"
          >
            Đăng Nhập Lại
          </Link>
        </div>
        <p className="mt-6 text-AXVN-silver/40 text-xs">
          Cần hỗ trợ?{" "}
          <Link href="/content/contact" className="text-AXVN-gold/70 hover:text-AXVN-gold underline">
            Liên hệ chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
