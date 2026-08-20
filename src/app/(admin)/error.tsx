"use client";

import Link from "next/link";

/**
 * Route-level error boundary for the admin panel.
 * Catches unhandled errors within (admin)/** routes without bubbling
 * to the global root error.tsx — preserves admin navigation context.
 */
export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
        <p className="text-red-500 text-xs font-semibold tracking-[3px] uppercase mb-3">
          Lỗi Hệ Thống
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Đã Xảy Ra Lỗi
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Trang quản trị gặp sự cố không mong muốn. Vui lòng thử lại hoặc
          quay về trang tổng quan.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-AXVN-navy text-white text-sm font-semibold rounded-lg hover:bg-AXVN-navy/90 transition-colors"
          >
            Thử Lại
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Về Tổng Quan
          </Link>
        </div>
      </div>
    </div>
  );
}
