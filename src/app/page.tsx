'use client';

import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { EmptyState } from '@/components/articles/EmptyState';
import { ErrorDisplay } from '@/components/articles/ErrorDisplay';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Home() {
  const { data, isLoading, isError, error, refetch } = useArticles();

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Top Stories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Latest news from multiple sources
        </p>
      </div>

      {isError ? (
        <ErrorDisplay
          message={error?.message}
          onRetry={() => refetch()}
        />
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
        </>
      ) : (
        <EmptyState />
      )}
    </PageLayout>
  );
}
