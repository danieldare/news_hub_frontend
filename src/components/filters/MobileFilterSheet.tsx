'use client';

import { useEffect } from 'react';
import type { SearchParams } from '@/lib/types';
import { FilterPanel } from './FilterPanel';

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  params: SearchParams;
  onParamChange: (updates: Partial<SearchParams>) => void;
}

export function MobileFilterSheet({
  open,
  onClose,
  params,
  onParamChange,
}: MobileFilterSheetProps) {
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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="animate-fade-in fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div className="animate-slide-up fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl">
        {/* Drag handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-white pb-2 pt-3">
          <div className="h-1 w-8 rounded-full bg-gray-300" />
        </div>

        <div className="px-6 pb-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close filters"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <FilterPanel params={params} onParamChange={onParamChange} />

          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
