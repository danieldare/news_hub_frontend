'use client';

import type { Article } from '@/lib/types';
import { ArticleCard } from './ArticleCard';
import { ArticleSkeleton } from './ArticleSkeleton';

interface ArticleGridProps {
  articles: Article[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ArticleGrid({ articles, isLoading, skeletonCount = 6 }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
