'use client';

import { useCategories } from '@/hooks/useCategories';
import { BatchReveal } from '@/components/ui/BatchReveal';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { categories: uniqueCategories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Filter by category</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 animate-pulse rounded-full bg-gray-100" style={{ width: `${55 + Math.random() * 35}px` }} />
          ))}
        </div>
      </div>
    );
  }

  if (uniqueCategories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Filter by category</h3>
      <BatchReveal
        items={uniqueCategories}
        className="flex flex-wrap gap-2"
        renderItem={(category) => {
          const isSelected = selected.toLowerCase() === category.name.toLowerCase();
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(isSelected ? '' : category.name.toLowerCase())}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              {category.name}
            </button>
          );
        }}
      />
    </div>
  );
}
