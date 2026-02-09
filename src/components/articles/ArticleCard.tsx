'use client';

import Image from 'next/image';
import type { Article } from '@/lib/types';
import { relativeTime } from '@/utils/dates';
import { PROVIDER_COLORS, PROVIDER_LABELS } from '@/utils/constants';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const providerColor = PROVIDER_COLORS[article.provider] ?? 'bg-gray-100 text-gray-800';
  const providerLabel = PROVIDER_LABELS[article.provider] ?? article.provider;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Source badge + date */}
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${providerColor}`}>
            {providerLabel}
          </span>
          {article.source.name !== providerLabel && (
            <span className="text-gray-500">{article.source.name}</span>
          )}
          <span className="ml-auto text-gray-400">
            {relativeTime(new Date(article.publishedAt))}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600">
          {article.title}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{article.description}</p>

        {/* Author */}
        {article.author && (
          <p className="mt-auto text-xs text-gray-400">By {article.author}</p>
        )}
      </div>
    </a>
  );
}
