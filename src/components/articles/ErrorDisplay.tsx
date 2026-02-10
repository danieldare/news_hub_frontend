'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WarningIcon, SpinnerIcon } from '@/components/icons';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = 'Something went wrong while fetching articles.',
  onRetry,
}: ErrorDisplayProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
        <WarningIcon className="h-10 w-10 text-red-400" strokeWidth={1} />
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-gray-900">Error loading articles</h3>
      <p className="mb-5 max-w-xs text-sm leading-relaxed text-gray-500">{message}</p>
      {onRetry && (
        <Button type="button" onClick={handleRetry} disabled={retrying}>
          {retrying ? (
            <>
              <SpinnerIcon className="h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            'Try again'
          )}
        </Button>
      )}
    </div>
  );
}
