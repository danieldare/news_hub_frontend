'use client';

import { memo } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { FilterIcon } from '@/components/icons';

const VISIBLE_COUNT = 10;

interface CategoryPillsProps {
  selected: string;
  onChange: (category: string) => void;
  onSeeMore?: () => void;
}

export const CategoryPills = memo(function CategoryPills({ selected, onChange, onSeeMore }: CategoryPillsProps) {
  const { categories: uniqueCategories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 shrink-0 animate-pulse rounded-full bg-gray-100" style={{ width: `${60 + Math.random() * 40}px` }} />
        ))}
      </div>
    );
  }

  if (uniqueCategories.length === 0) return null;

  const visible = uniqueCategories.slice(0, VISIBLE_COUNT);

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          !selected
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        All
      </button>
      {visible.map((category) => {
        const isSelected = selected.toLowerCase() === category.name.toLowerCase();
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(isSelected ? '' : category.name.toLowerCase())}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {category.name}
          </button>
        );
      })}
      {uniqueCategories.length > VISIBLE_COUNT && onSeeMore && (
        <button
          type="button"
          onClick={onSeeMore}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-3.5 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          <FilterIcon className="h-3.5 w-3.5" />
          More
        </button>
      )}
    </div>
  );
});
