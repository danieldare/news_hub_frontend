import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-3 text-base text-gray-500">This page could not be found.</p>
      <Link href="/" className={buttonStyles({ className: 'mt-6' })}>
        Go home
      </Link>
    </div>
  );
}
