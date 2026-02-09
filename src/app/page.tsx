'use client';

import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { EmptyState } from '@/components/articles/EmptyState';
import { ErrorDisplay } from '@/components/articles/ErrorDisplay';
import { PageLayout } from '@/components/layout/PageLayout';
import Link from 'next/link';

export default function Home() {
  const { data, isLoading, isError, error, refetch } = useArticles();

  return (
    <PageLayout>
      {/* Hero header */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Top Stories
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Latest news aggregated from multiple trusted sources
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Search articles
          </Link>
        </div>
      </div>

      {/* Provider status banner */}
      {data?.meta.partial && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
          <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-amber-800">
            Some news sources are temporarily unavailable. Showing partial results.
          </p>
        </div>
      )}

      {/* Content */}
      {isError ? (
        <ErrorDisplay message={error?.message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <ArticleGrid articles={[]} isLoading />
      ) : data && data.data.length > 0 ? (
        <ArticleGrid articles={data.data} />
      ) : (
        <EmptyState
          message="No stories yet"
          description="Configure your API keys in .env.local to start seeing articles."
        />
      )}
    </PageLayout>
  );
}
