export function ArticleSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
      {/* Thumbnail placeholder */}
      <div className="skeleton-shimmer aspect-[16/10] w-full" />

      {/* Content placeholder */}
      <div className="flex flex-1 flex-col p-4">
        {/* Badge + date */}
        <div className="mb-2 flex items-center gap-2">
          <div className="skeleton-shimmer h-4 w-14 rounded-full" />
          <div className="skeleton-shimmer ml-auto h-3 w-12 rounded" />
        </div>
        {/* Title lines */}
        <div className="skeleton-shimmer mb-1.5 h-4 w-full rounded" />
        <div className="skeleton-shimmer mb-3 h-4 w-3/4 rounded" />
        {/* Description */}
        <div className="skeleton-shimmer mb-1 h-3.5 w-full rounded" />
        <div className="skeleton-shimmer mb-3 h-3.5 w-5/6 rounded" />
        {/* Author */}
        <div className="mt-auto flex items-center gap-1.5">
          <div className="skeleton-shimmer h-5 w-5 rounded-full" />
          <div className="skeleton-shimmer h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
