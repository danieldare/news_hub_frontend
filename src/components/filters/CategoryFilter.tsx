'use client';

import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Deduplicate category names across providers
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.name.toLowerCase(), c])).values(),
  );

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
              onClick={() => onChange(isSelected ? '' : category.name)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
