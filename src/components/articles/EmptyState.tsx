interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = 'No articles found',
  description = 'Try adjusting your search or filter criteria.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="mb-4 h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
      <h3 className="mb-1 text-lg font-medium text-gray-900">{message}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
