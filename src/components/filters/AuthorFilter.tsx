'use client';

import { CloseIcon } from '@/components/icons';

interface AuthorFilterProps {
  value: string;
  onChange: (author: string) => void;
}

export function AuthorFilter({ value, onChange }: AuthorFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Author</h3>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter by author..."
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear author"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
