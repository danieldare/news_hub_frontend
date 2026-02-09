'use client';

import { Suspense, useState } from 'react';
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
import { Button, buttonStyles } from '@/components/ui/Button';
import type { SearchParams } from '@/lib/types';
import Link from 'next/link';

function HomeContent() {
  const { getSearchParams, hasPreferences, hasOnboarded, markOnboarded } = usePreferences();
  const { params, setParams, removeParam, clearAll } = useSearchParamsState();
  const [filterOpen, setFilterOpen] = useState(false);

  // Merge URL params with preference params
  const prefParams = getSearchParams();
  const mergedParams: SearchParams = { ...prefParams, ...params };

  const { data, isLoading, isError, error, refetch } = useArticles(mergedParams);

  const handleParamChange = (updates: Partial<SearchParams>) => {
    setParams(updates);
  };

  const hasActiveFilters = !!(
    params.q || params.from || params.to || params.category ||
    params.source || params.author || params.providers?.length
  );

  const articles = data?.data ?? [];
  const heroArticle = articles.length > 0 && !hasActiveFilters ? articles[0] : null;
  const gridArticles = heroArticle ? articles.slice(1) : articles;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero section with search */}
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

        {/* Centered search bar */}
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBar
            value={params.q ?? ''}
            onChange={(q) => handleParamChange({ q: q || undefined })}
          />
        </div>

        {/* Category pills */}
        <div className="mt-5">
          <CategoryPills
            selected={params.category ?? ''}
            onChange={(category) => handleParamChange({ category: category || undefined })}
          />
        </div>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="mb-6">
          <ActiveFilters params={params} onRemove={removeParam} onClearAll={clearAll} />
        </div>
      )}

      {/* Fixed filter button */}
      <Button
        type="button"
        onClick={() => setFilterOpen(true)}
        className="fixed bottom-6 right-6 z-40 shadow-lg hover:shadow-xl"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </Button>

      {/* Onboarding banner */}
      {!hasOnboarded && !hasPreferences && !isLoading && (
        <div className="mb-6 flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/80 py-2 pl-4 pr-2">
          <svg className="h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
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
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Provider status banner */}
      {data?.meta.partial && (
        <div className="mb-6 flex items-center gap-3 rounded-full border border-amber-100 bg-amber-50/80 py-2 pl-4 pr-4">
          <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="flex-1 text-sm text-amber-800">
            Some sources unavailable — showing partial results
          </p>
        </div>
      )}

      {/* Results count */}
      {data && !isLoading && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {data.meta.total} {data.meta.total === 1 ? 'article' : 'articles'}
            {hasActiveFilters ? ' found' : ''}
          </p>
        </div>
      )}

      {/* Content */}
      {isError ? (
        <ErrorDisplay message={error?.message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div>
          {/* Hero skeleton */}
          <div className="mb-6 h-64 rounded-2xl skeleton-shimmer sm:h-80" />
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <ArticleSkeleton key={i} />)}
          </div>
        </div>
      ) : articles.length > 0 ? (
        <div>
          {/* Hero article */}
          {heroArticle && (
            <div className="mb-6">
              <HeroArticleCard article={heroArticle} />
            </div>
          )}

          {/* Article grid */}
          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Load more */}
          {data?.meta.hasMore && (
            <div className="mt-8 flex justify-center pb-8">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => handleParamChange({ page: (params.page ?? 1) + 1 })}
              >
                Load more articles
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

      {/* Mobile filter sheet */}
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
