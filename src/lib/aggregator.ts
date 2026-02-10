import type {
  Article,
  Category,
  NewsProvider,
  PaginatedResult,
  ProviderError,
  ProviderStatusInfo,
  SearchParams,
} from '@/lib/types';
import { deduplicateArticles } from '@/utils/dedup';

function computeRankScore(
  article: Article,
  params: SearchParams,
): number {
  const hasPrefs =
    (params.preferredCategories?.length ?? 0) > 0 ||
    (params.preferredAuthors?.length ?? 0) > 0;

  if (!hasPrefs) return 0;

  let score = 0;
  if (article.category && params.preferredCategories?.includes(article.category)) score += 20;
  if (article.author && params.preferredAuthors?.includes(article.author)) score += 15;

  // Freshness score: 0..20
  const hoursSincePublish =
    (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 20 - Math.floor(hoursSincePublish / 6));

  return score;
}

function sortArticles(articles: Article[], params: SearchParams): Article[] {
  return articles.sort((a, b) => {
    const scoreA = computeRankScore(a, params);
    const scoreB = computeRankScore(b, params);

    if (scoreB !== scoreA) return scoreB - scoreA;
    if (b.publishedAt.getTime() !== a.publishedAt.getTime()) {
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
    return a.id.localeCompare(b.id);
  });
}

// In-memory cache so article detail pages can look up recently fetched articles
const articleCache = new Map<string, Article>();

function cacheArticles(articles: Article[]) {
  for (const article of articles) {
    articleCache.set(article.id, article);
  }
}

export class ArticleAggregator {
  constructor(private readonly providers: NewsProvider[]) {}

  async search(params: SearchParams): Promise<PaginatedResult<Article>> {
    const page = params.page ?? 1;
    const pageSize = Math.min(params.pageSize ?? 20, 50);

    const activeProviders = params.providers
      ? this.providers.filter((p) => params.providers!.includes(p.id))
      : this.providers;

    const startTimes = new Map<string, number>();
    const results = await Promise.allSettled(
      activeProviders.map((provider) => {
        startTimes.set(provider.id, Date.now());
        // Overfetch so we have enough after dedup + ranking to fill a page
        return provider.search({ ...params, page: 1, pageSize: pageSize * 3 });
      }),
    );

    const allArticles: Article[] = [];
    const providerStatuses: ProviderStatusInfo[] = [];
    const errors: ProviderError[] = [];

    results.forEach((result, index) => {
      const provider = activeProviders[index];
      const latencyMs = Date.now() - (startTimes.get(provider.id) ?? Date.now());

      if (result.status === 'fulfilled') {
        allArticles.push(...result.value.data);
        providerStatuses.push(...result.value.meta.providerStatuses.map((s) => ({
          ...s,
          latencyMs,
        })));
        errors.push(...result.value.errors);
      } else {
        providerStatuses.push({
          provider: provider.id,
          status: 'down',
          latencyMs,
        });
        errors.push({
          provider: provider.id,
          code: 'UPSTREAM_ERROR',
          message: result.reason?.message ?? 'Provider failed',
        });
      }
    });

    const deduped = deduplicateArticles(allArticles);
    cacheArticles(deduped);
    const sorted = sortArticles(deduped, params);

    const start = (page - 1) * pageSize;
    const paged = sorted.slice(start, start + pageSize);
    const total = sorted.length;
    const partial = providerStatuses.some((s) => s.status !== 'ok');

    return {
      data: paged,
      meta: {
        page,
        pageSize,
        total,
        hasMore: start + pageSize < total,
        partial,
        providerStatuses,
      },
      errors,
    };
  }

  async getCategories(): Promise<Category[]> {
    const results = await Promise.allSettled(
      this.providers.map((p) => p.getCategories()),
    );

    const categories: Category[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        categories.push(...result.value);
      }
    }
    return categories;
  }

  async getArticleById(id: string): Promise<Article | null> {
    const cached = articleCache.get(id);
    if (cached) return cached;

    // Cache miss — warm it with a quick search, then retry
    const prefix = id.split('-')[0];
    const provider = this.providers.find((p) => p.id === prefix);
    const targets = provider ? [provider] : this.providers;

    const results = await Promise.allSettled(
      targets.map((p) => p.search({ page: 1, pageSize: 50 })),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        cacheArticles(result.value.data);
      }
    }

    return articleCache.get(id) ?? null;
  }

  getProviderMeta() {
    return this.providers.map((p) => ({
      id: p.id,
      name: p.name,
      features: [...p.supportedFeatures],
    }));
  }
}
