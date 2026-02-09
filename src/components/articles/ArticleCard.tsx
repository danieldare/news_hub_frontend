'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { relativeTime } from '@/utils/dates';
import { PROVIDER_COLORS, PROVIDER_LABELS } from '@/utils/constants';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = memo(function ArticleCard({ article }: ArticleCardProps) {
  const providerColor = PROVIDER_COLORS[article.provider] ?? 'bg-gray-100 text-gray-800';
  const providerLabel = PROVIDER_LABELS[article.provider] ?? article.provider;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {article.imageUrl ? (
          <>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay for readability on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z" />
            </svg>
          </div>
        )}

        {/* Provider badge - floating on image */}
        <div className="absolute left-3 top-3">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${providerColor}`}>
            {providerLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Meta row */}
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          {article.source.name !== providerLabel && (
            <span className="font-medium text-gray-600">{article.source.name}</span>
          )}
          {article.category && (
            <>
              {article.source.name !== providerLabel && <span className="text-gray-300">&middot;</span>}
              <span className="text-gray-500">{article.category}</span>
            </>
          )}
          <span className="ml-auto shrink-0 text-gray-400">
            {relativeTime(new Date(article.publishedAt))}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {article.description}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <div className="mt-auto flex items-center gap-1.5 pt-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{article.author}</span>
          </div>
        )}
      </div>
    </a>
  );
});
