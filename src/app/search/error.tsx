'use client';

import Link from 'next/link';

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
        <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h2 className="mb-1.5 text-lg font-semibold text-gray-900">Search failed</h2>
      <p className="mb-5 max-w-md text-sm text-gray-500">
        {error.message || 'We couldn\'t complete your search. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
