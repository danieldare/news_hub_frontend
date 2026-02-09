'use client';

import { useQuery } from '@tanstack/react-query';
import type { Article, PaginatedResult, SearchParams } from '@/lib/types';

async function fetchArticles(params: SearchParams): Promise<PaginatedResult<Article>> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.category) searchParams.set('category', params.category);
  if (params.source) searchParams.set('source', params.source);
  if (params.author) searchParams.set('author', params.author);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.providers?.length) searchParams.set('providers', params.providers.join(','));
  if (params.preferredSources?.length)
    searchParams.set('preferredSources', params.preferredSources.join(','));
  if (params.preferredCategories?.length)
    searchParams.set('preferredCategories', params.preferredCategories.join(','));
  if (params.preferredAuthors?.length)
    searchParams.set('preferredAuthors', params.preferredAuthors.join(','));

  const response = await fetch(`/api/articles?${searchParams.toString()}`);

  if (!response.ok && response.status !== 502) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  const data = await response.json();

  // Parse date strings back to Date objects
  data.data = data.data.map((article: Article) => ({
    ...article,
    publishedAt: new Date(article.publishedAt),
  }));

  return data;
}

export function useArticles(params: SearchParams = {}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => fetchArticles(params),
  });
}
