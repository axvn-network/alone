/**
 * Route-level loading skeleton for the admin panel.
 * Displayed by Next.js during navigation between admin pages.
 */
export default function AdminLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {/* Page header skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="h-4 w-72 bg-gray-100 rounded" />

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-7 w-14 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="h-9 w-9 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-56 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
