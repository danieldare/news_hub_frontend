import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-3 text-base text-gray-500">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Go home
      </Link>
    </div>
  );
}
