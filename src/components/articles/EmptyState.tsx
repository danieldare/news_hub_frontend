import { DocumentIcon } from '@/components/icons';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = 'No articles found',
  description = 'Try adjusting your search or filter criteria.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
        <DocumentIcon className="h-10 w-10 text-gray-300" strokeWidth={1} />
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-gray-900">{message}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
