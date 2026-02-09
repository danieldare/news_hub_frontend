export function ArticleSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Thumbnail placeholder */}
      <div className="aspect-video w-full animate-pulse bg-gray-200" />

      {/* Content placeholder */}
      <div className="flex flex-1 flex-col p-4">
        {/* Badge + date */}
        <div className="mb-2 flex items-center gap-2">
          <div className="h-4 w-14 animate-pulse rounded-full bg-gray-200" />
          <div className="ml-auto h-3 w-12 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Title lines */}
        <div className="mb-1 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        {/* Description */}
        <div className="mb-1 h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="mb-3 h-3 w-5/6 animate-pulse rounded bg-gray-100" />
        {/* Author */}
        <div className="mt-auto h-3 w-24 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
