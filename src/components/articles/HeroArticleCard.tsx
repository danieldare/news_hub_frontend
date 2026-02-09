'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { relativeTime } from '@/utils/dates';
import { PROVIDER_COLORS, PROVIDER_LABELS } from '@/utils/constants';

interface HeroArticleCardProps {
  article: Article;
}

export const HeroArticleCard = memo(function HeroArticleCard({ article }: HeroArticleCardProps) {
  const providerColor = PROVIDER_COLORS[article.provider] ?? 'bg-gray-100 text-gray-800';
  const providerLabel = PROVIDER_LABELS[article.provider] ?? article.provider;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl sm:flex-row"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-auto sm:w-3/5">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className="flex h-full min-h-[240px] items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
            <svg className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/80 sm:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent sm:hidden" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-center p-6 sm:p-8">
        {/* Provider + Meta */}
        <div className="mb-3 flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${providerColor}`}>
            {providerLabel}
          </span>
          {article.category && (
            <span className="text-xs font-medium text-gray-400">{article.category}</span>
          )}
          <span className="text-xs text-gray-500">
            {relativeTime(new Date(article.publishedAt))}
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold leading-tight text-white transition-colors group-hover:text-blue-300 sm:text-2xl lg:text-3xl">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-300 sm:text-base">
            {article.description}
          </p>
        )}

        {/* Author + Source */}
        <div className="flex items-center gap-3">
          {article.author && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-400">{article.author}</span>
            </div>
          )}
          {article.source.name !== providerLabel && (
            <>
              {article.author && <span className="text-gray-600">&middot;</span>}
              <span className="text-sm text-gray-500">{article.source.name}</span>
            </>
          )}
        </div>

        {/* Read indicator */}
        <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Read full story
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </a>
  );
});
