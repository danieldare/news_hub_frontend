import type { Article, Category, ProviderID } from '@/lib/types';

const TRACKER_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
]);

const PROVIDER_PRIORITY: Record<ProviderID, number> = {
  guardian: 0,
  nyt: 1,
  newsapi: 2,
};

/**
 * Canonicalize a URL for deduplication:
 * - Lowercase host
 * - Remove www. prefix
 * - Strip tracker query params
 * - Remove trailing slash (except root)
 */
export function canonicalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);

    // Lowercase host and remove www.
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');

    // Strip tracker params
    const params = new URLSearchParams(url.search);
    for (const key of [...params.keys()]) {
      if (TRACKER_PARAMS.has(key)) {
        params.delete(key);
      }
    }
    url.search = params.toString();

    // Remove trailing slash (except root path)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return `${url.protocol}//${url.hostname}${url.pathname}${url.search}`;
  } catch {
    return rawUrl;
  }
}

/**
 * Deduplicate articles by canonical URL.
 * Winner: newest publishedAt > provider priority (guardian > nyt > newsapi) > smaller id.
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();

  for (const article of articles) {
    const key = canonicalizeUrl(article.url);
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, article);
      continue;
    }

    // Determine winner
    const existingTime = existing.publishedAt.getTime();
    const newTime = article.publishedAt.getTime();

    if (
      newTime > existingTime ||
      (newTime === existingTime &&
        PROVIDER_PRIORITY[article.provider] < PROVIDER_PRIORITY[existing.provider]) ||
      (newTime === existingTime &&
        PROVIDER_PRIORITY[article.provider] === PROVIDER_PRIORITY[existing.provider] &&
        article.id < existing.id)
    ) {
      seen.set(key, article);
    }
  }

  return Array.from(seen.values());
}

/**
 * Deduplicate categories by name (case-insensitive).
 * Keeps the first occurrence of each category name.
 */
export function deduplicateCategories(categories: Category[]): Category[] {
  return Array.from(
    new Map(categories.map((c) => [c.name.toLowerCase(), c])).values(),
  );
}
