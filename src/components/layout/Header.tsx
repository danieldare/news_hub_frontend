'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MobileNav } from './MobileNav';
import { NewspaperIcon, SettingsIcon, MenuIcon } from '@/components/icons';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 transition-transform group-hover:scale-105">
              <NewspaperIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900">
              News<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <Link
            href="/preferences"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Rendered outside header so it's not trapped in the header's stacking context */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
