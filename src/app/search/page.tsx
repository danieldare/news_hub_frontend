'use client';

import { Suspense, useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useSearchParamsState } from '@/hooks/useSearchParams';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { EmptyState } from '@/components/articles/EmptyState';
import { ErrorDisplay } from '@/components/articles/ErrorDisplay';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import type { SearchParams } from '@/lib/types';

function SearchContent() {
  const { params, setParams, removeParam, clearAll } = useSearchParamsState();
  const { data, isLoading, isError, error, refetch } = useArticles(params);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleParamChange = (updates: Partial<SearchParams>) => {
    setParams(updates);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      {/* Desktop sidebar filters */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-gray-200/80 p-5 lg:block">
        <h2 className="mb-5 text-base font-semibold text-gray-900">Filters</h2>
        <FilterPanel params={params} onParamChange={handleParamChange} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Search
            </h1>
            {data && !isLoading && (
              <p className="mt-1 text-sm text-gray-500">
                {data.meta.total} {data.meta.total === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md lg:hidden"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
        </div>

        {/* Active filter pills */}
        <div className="mb-5">
          <ActiveFilters params={params} onRemove={removeParam} onClearAll={clearAll} />
        </div>

        {/* Provider status */}
        {data?.meta.partial && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-amber-800">
              Some news sources are temporarily unavailable. Showing partial results.
            </p>
          </div>
        )}

        {/* Results */}
        {isError ? (
          <ErrorDisplay message={error?.message} onRetry={() => refetch()} />
        ) : isLoading ? (
          <ArticleGrid articles={[]} isLoading />
        ) : data && data.data.length > 0 ? (
          <>
            <ArticleGrid articles={data.data} />

            {/* Pagination */}
            {data.meta.hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
                >
                  Load more articles
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}

        {/* Mobile filter sheet */}
        <MobileFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          params={params}
          onParamChange={handleParamChange}
        />
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
