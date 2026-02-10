'use client';

import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/lib/types';
import { deduplicateCategories } from '@/utils/dedup';

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function useCategories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  return { categories: deduplicateCategories(categories), isLoading };
}
