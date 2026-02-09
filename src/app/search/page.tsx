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
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 p-4 lg:block">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>
        <FilterPanel params={params} onParamChange={handleParamChange} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6">
        {/* Mobile filter button */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-gray-900">Search</h1>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>

        {/* Desktop title */}
        <h1 className="mb-4 hidden text-xl font-bold text-gray-900 lg:block">
          Search Results
        </h1>

        {/* Active filter pills */}
        <div className="mb-4">
          <ActiveFilters
            params={params}
            onRemove={removeParam}
            onClearAll={clearAll}
          />
        </div>

        {/* Results count */}
        {data && !isLoading && (
          <p className="mb-4 text-sm text-gray-500">
            {data.meta.total} {data.meta.total === 1 ? 'result' : 'results'} found
          </p>
        )}

        {/* Results */}
        {isError ? (
          <ErrorDisplay message={error?.message} onRetry={() => refetch()} />
        ) : isLoading ? (
          <ArticleGrid articles={[]} isLoading />
        ) : data && data.data.length > 0 ? (
          <>
            {data.meta.partial && (
              <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                Some news sources are temporarily unavailable. Showing partial results.
              </div>
            )}
            <ArticleGrid articles={data.data} />

            {/* Pagination */}
            {data.meta.hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setParams({ page: (params.page ?? 1) + 1 })
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Load more
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
