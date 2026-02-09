'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-64 bg-white p-6 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold">Menu</span>
          <button
            type="button"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/search"
            className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Search
          </Link>
          <Link
            href="/preferences"
            className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Preferences
          </Link>
        </nav>
      </div>
    </div>
  );
}
