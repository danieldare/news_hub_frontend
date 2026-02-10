'use client';

import type { SearchParams } from '@/lib/types';
import { PROVIDER_LABELS } from '@/utils/constants';
import { CloseIcon } from '@/components/icons';

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
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm"
        >
          {pill.label}
          <button
            type="button"
            onClick={() => onRemove(pill.key)}
            className="-mr-1 rounded-full p-0.5 text-blue-400 transition-colors hover:bg-blue-200 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
            aria-label={`Remove ${pill.label} filter`}
          >
            <CloseIcon className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        Clear all
      </button>
    </div>
  );
}
