'use client';

import type { SearchParams } from '@/lib/types';
import { PROVIDER_LABELS } from '@/utils/constants';

interface ActiveFiltersProps {
  params: SearchParams;
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ params, onRemove, onClearAll }: ActiveFiltersProps) {
  const pills: { key: string; label: string }[] = [];

  if (params.q) pills.push({ key: 'q', label: `"${params.q}"` });
  if (params.from) pills.push({ key: 'from', label: `From: ${params.from}` });
  if (params.to) pills.push({ key: 'to', label: `To: ${params.to}` });
  if (params.category) pills.push({ key: 'category', label: params.category });
  if (params.author) pills.push({ key: 'author', label: `By: ${params.author}` });
  if (params.providers?.length) {
    pills.push({
      key: 'providers',
      label: params.providers.map((p) => PROVIDER_LABELS[p] ?? p).join(', '),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500">Active filters:</span>
      {pills.map((pill) => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
        >
          {pill.label}
          <button
            type="button"
            onClick={() => onRemove(pill.key)}
            className="-mr-1 ml-0.5 rounded-full p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
            aria-label={`Remove ${pill.label} filter`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Clear all
      </button>
    </div>
  );
}
