'use client';

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
        <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mb-1.5 text-lg font-semibold text-gray-900">Something went wrong</h2>
      <p className="mb-5 max-w-md text-sm text-gray-500">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
      >
        Try again
      </button>
    </div>
  );
}
