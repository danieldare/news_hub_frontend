'use client';

import { useCategories } from '@/hooks/useCategories';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const uniqueCategories = useCategories();

  if (uniqueCategories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Category</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueCategories.map((category) => {
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
        })}
      </div>
    </div>
  );
}
