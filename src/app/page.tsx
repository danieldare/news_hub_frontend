'use client';

import { Suspense, useState, useCallback } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { usePreferences } from '@/hooks/usePreferences';
import { useSearchParamsState } from '@/hooks/useSearchParams';
import { HeroArticleCard } from '@/components/articles/HeroArticleCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton';
import { EmptyState } from '@/components/articles/EmptyState';
import { ErrorDisplay } from '@/components/articles/ErrorDisplay';
import { SearchBar } from '@/components/filters/SearchBar';
import { CategoryPills } from '@/components/filters/CategoryPills';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { Button } from '@/components/ui/Button';
import { FilterIcon, SparkleIcon, CloseIcon, WarningIcon, SpinnerIcon, ArrowDownIcon } from '@/components/icons';
import type { SearchParams } from '@/lib/types';
import Link from 'next/link';

function HomeContent() {
  const { getSearchParams, hasPreferences, hasOnboarded, markOnboarded } = usePreferences();
  const { params, setParams, removeParam, clearAll } = useSearchParamsState();
  const [filterOpen, setFilterOpen] = useState(false);

  // Merge URL params with preference params
  const prefParams = getSearchParams();
  const mergedParams: SearchParams = { ...prefParams, ...params };

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useArticles(mergedParams);

  const handleParamChange = useCallback(
    (updates: Partial<SearchParams>) => {
      setParams(updates);
    },
    [setParams],
  );

  const hasActiveFilters = !!(
    params.q || params.from || params.to || params.category ||
    params.source || params.author || params.providers?.length
  );

  const articles = data?.pages?.flatMap((page) => page.data) ?? [];
  const lastPage = data?.pages?.at(-1);
  const heroArticle = articles.length > 0 && !hasActiveFilters ? articles[0] : null;
  const gridArticles = heroArticle ? articles.slice(1) : articles;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="pb-6 pt-8 sm:pb-8 sm:pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {hasPreferences ? 'Your Personalized Feed' : 'Stay Informed'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {hasPreferences
              ? 'News curated from your preferred sources and topics'
              : 'Aggregated news from the world\'s most trusted sources'}
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-xl">
          <SearchBar
            value={params.q ?? ''}
            onChange={(q) => handleParamChange({ q: q || undefined })}
          />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-gray-400">Filter by category</p>
          <CategoryPills
            selected={params.category ?? ''}
            onChange={(category) => handleParamChange({ category: category || undefined })}
            onSeeMore={() => setFilterOpen(true)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-6">
          <ActiveFilters params={params} onRemove={removeParam} onClearAll={clearAll} />
        </div>
      )}

      <Button
        type="button"
        onClick={() => setFilterOpen(true)}
        className="fixed bottom-6 right-6 z-40 shadow-lg hover:shadow-xl"
      >
        <FilterIcon className="h-4 w-4" />
        Filters
      </Button>

      {!hasOnboarded && !hasPreferences && !isLoading && (
        <div className="mb-6 flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/80 py-2 pl-4 pr-2">
          <SparkleIcon className="h-4 w-4 shrink-0 text-blue-500" />
          <p className="flex-1 text-sm text-blue-800">
            <Link href="/preferences" className="font-semibold underline decoration-blue-300 underline-offset-2 hover:decoration-blue-500">
              Personalize your feed
            </Link>
            <span className="text-blue-600"> — set preferred sources, categories &amp; authors</span>
          </p>
          <button
            type="button"
            onClick={markOnboarded}
            className="shrink-0 rounded-full p-1.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
            aria-label="Dismiss"
          >
            <CloseIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {lastPage?.meta.partial && (
        <div className="mb-6 flex items-center gap-3 rounded-full border border-amber-100 bg-amber-50/80 py-2 pl-4 pr-4">
          <WarningIcon className="h-4 w-4 shrink-0 text-amber-500" />
          <p className="flex-1 text-sm text-amber-800">
            Some sources unavailable — showing partial results
          </p>
        </div>
      )}

      {lastPage && !isLoading && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {lastPage.meta.total} {lastPage.meta.total === 1 ? 'article' : 'articles'}
            {hasActiveFilters ? ' found' : ''}
          </p>
        </div>
      )}

      {isError ? (
        <ErrorDisplay message={error?.message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div>
          <div className="mb-6 h-64 rounded-2xl skeleton-shimmer sm:h-80" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <ArticleSkeleton key={i} />)}
          </div>
        </div>
      ) : articles.length > 0 ? (
        <div>
          {heroArticle && (
            <div className="mb-6">
              <HeroArticleCard article={heroArticle} />
            </div>
          )}

          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="mt-8 flex justify-center pb-8">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                )}
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          message={hasActiveFilters ? 'No articles found' : 'No stories yet'}
          description={hasActiveFilters ? 'Try adjusting your search or filter criteria.' : 'Configure your API keys in .env.local to start seeing articles.'}
        />
      )}

      <MobileFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        params={params}
        onParamChange={handleParamChange}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
