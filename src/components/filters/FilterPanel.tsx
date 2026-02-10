'use client';

import type { SearchParams } from '@/lib/types';
import { SearchBar } from './SearchBar';
import { DateRangeFilter } from './DateRangeFilter';
import { CategoryFilter } from './CategoryFilter';
import { AuthorFilter } from './AuthorFilter';

interface FilterPanelProps {
  params: SearchParams;
  onParamChange: (updates: Partial<SearchParams>) => void;
}

export function FilterPanel({ params, onParamChange }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <SearchBar
        value={params.q ?? ''}
        onChange={(q) => onParamChange({ q: q || undefined })}
      />

      <DateRangeFilter
        from={params.from ?? ''}
        to={params.to ?? ''}
        onChange={(from, to) =>
          onParamChange({ from: from || undefined, to: to || undefined })
        }
      />

      <CategoryFilter
        selected={params.category ?? ''}
        onChange={(category) => onParamChange({ category: category || undefined })}
      />

      <AuthorFilter
        value={params.author ?? ''}
        onChange={(author) => onParamChange({ author: author || undefined })}
      />
    </div>
  );
}
