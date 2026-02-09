'use client';

import { useRef, memo } from 'react';
import { useCategories } from '@/hooks/useCategories';

interface CategoryPillsProps {
  selected: string;
  onChange: (category: string) => void;
}

export const CategoryPills = memo(function CategoryPills({ selected, onChange }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const uniqueCategories = useCategories();

  if (uniqueCategories.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
      >
        <button
          type="button"
          onClick={() => onChange('')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            !selected
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {uniqueCategories.map((category) => {
          const isSelected = selected.toLowerCase() === category.name.toLowerCase();
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(isSelected ? '' : category.name.toLowerCase())}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
});
