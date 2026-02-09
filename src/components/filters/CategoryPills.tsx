'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/lib/types';

interface CategoryPillsProps {
  selected: string;
  onChange: (category: string) => void;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function CategoryPills({ selected, onChange }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.name.toLowerCase(), c])).values(),
  );

  if (uniqueCategories.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
      >
        {/* All button */}
        <button
          type="button"
          onClick={() => onChange('')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
              onClick={() => onChange(isSelected ? '' : category.name)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
}
