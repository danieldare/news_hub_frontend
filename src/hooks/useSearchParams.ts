'use client';

import { useCallback } from 'react';
import {
  useSearchParams as useNextSearchParams,
  useRouter,
  usePathname,
} from 'next/navigation';
import type { SearchParams } from '@/lib/types';
import type { ProviderID } from '@/lib/types';

export function useSearchParamsState() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getParams = useCallback((): SearchParams => {
    const params: SearchParams = {};

    const q = searchParams.get('q');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const author = searchParams.get('author');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const providers = searchParams.get('providers');

    if (q) params.q = q;
    if (from) params.from = from;
    if (to) params.to = to;
    if (category) params.category = category;
    if (source) params.source = source;
    if (author) params.author = author;
    if (page) params.page = parseInt(page, 10);
    if (pageSize) params.pageSize = parseInt(pageSize, 10);
    if (providers) params.providers = providers.split(',') as ProviderID[];

    return params;
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Partial<SearchParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === '') {
          current.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            current.delete(key);
          } else {
            current.set(key, value.join(','));
          }
        } else {
          current.set(key, String(value));
        }
      }

      // Reset to page 1 when filters change (unless page is explicitly set)
      if (!('page' in updates)) {
        current.delete('page');
      }

      router.push(`${pathname}?${current.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const removeParam = useCallback(
    (key: string) => {
      const current = new URLSearchParams(searchParams.toString());
      current.delete(key);
      current.delete('page');
      router.push(`${pathname}?${current.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    params: getParams(),
    searchParams,
    setParams,
    removeParam,
    clearAll,
  };
}
