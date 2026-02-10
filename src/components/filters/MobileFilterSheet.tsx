'use client';

import { useEffect, useRef } from 'react';
import type { SearchParams } from '@/lib/types';
import { FilterPanel } from './FilterPanel';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/icons';

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
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      sheetRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="animate-fade-in fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        tabIndex={-1}
        className="animate-slide-up fixed bottom-0 left-1/2 flex max-h-[85vh] w-full max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl focus:outline-none"
      >
        <div className="flex shrink-0 justify-center bg-white pb-2 pt-3">
          <div className="h-1 w-8 rounded-full bg-gray-300" />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="filter-sheet-title" className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="Close filters"
            >
              <CloseIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <FilterPanel params={params} onParamChange={onParamChange} />
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4">
          <Button type="button" onClick={onClose} size="lg" fullWidth>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
