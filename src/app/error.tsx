'use client';

import { Button } from '@/components/ui/Button';
import { WarningIcon } from '@/components/icons';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
        <WarningIcon className="h-10 w-10 text-red-400" strokeWidth={1} />
      </div>
      <h2 className="mb-1.5 text-lg font-semibold text-gray-900">Something went wrong</h2>
      <p className="mb-5 max-w-md text-sm text-gray-500">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
