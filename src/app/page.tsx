'use client';

import { useArticles } from '@/hooks/useArticles';
import { usePreferences } from '@/hooks/usePreferences';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { EmptyState } from '@/components/articles/EmptyState';
import { ErrorDisplay } from '@/components/articles/ErrorDisplay';
import { PageLayout } from '@/components/layout/PageLayout';
import Link from 'next/link';

function OnboardingBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-blue-900">Personalize your feed</h3>
          <p className="mt-1 text-sm text-blue-700/80">
            Set your preferred sources, categories, and authors to see the news that matters most to you.
          </p>
          <Link
            href="/preferences"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Set preferences
          </Link>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { getSearchParams, hasPreferences, hasOnboarded, markOnboarded } = usePreferences();
  const prefParams = getSearchParams();
  const { data, isLoading, isError, error, refetch } = useArticles(prefParams);

  return (
    <PageLayout>
      {/* Hero header */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {hasPreferences ? 'Your Feed' : 'Top Stories'}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {hasPreferences
                ? 'Personalized news based on your preferences'
                : 'Latest news aggregated from multiple trusted sources'}
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

      {/* Onboarding prompt for first-time users */}
      {!hasOnboarded && !hasPreferences && (
        <OnboardingBanner onDismiss={markOnboarded} />
      )}

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
