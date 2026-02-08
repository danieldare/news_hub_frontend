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

// ─── Ranking ───────────────────────────────────────────────────────────────

function computeRankScore(
  article: Article,
  params: SearchParams,
): number {
  const hasPrefs =
    (params.preferredSources?.length ?? 0) > 0 ||
    (params.preferredCategories?.length ?? 0) > 0 ||
    (params.preferredAuthors?.length ?? 0) > 0;

  if (!hasPrefs) return 0;

  let score = 0;

  if (params.preferredSources?.includes(article.source.id)) score += 30;
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

    // 1) rankScore descending
    if (scoreB !== scoreA) return scoreB - scoreA;
    // 2) publishedAt descending
    if (b.publishedAt.getTime() !== a.publishedAt.getTime()) {
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
    // 3) id ascending (tie-breaker)
    return a.id.localeCompare(b.id);
  });
}

// ─── Aggregator ────────────────────────────────────────────────────────────

export class ArticleAggregator {
  constructor(private readonly providers: NewsProvider[]) {}

  async search(params: SearchParams): Promise<PaginatedResult<Article>> {
    const page = params.page ?? 1;
    const pageSize = Math.min(params.pageSize ?? 20, 50);

    // Filter to enabled providers if specified
    const activeProviders = params.providers
      ? this.providers.filter((p) => params.providers!.includes(p.id))
      : this.providers;

    // Parallel fetch from all active providers
    const startTimes = new Map<string, number>();
    const results = await Promise.allSettled(
      activeProviders.map((provider) => {
        startTimes.set(provider.id, Date.now());
        return provider.search({ ...params, page: 1, pageSize: pageSize * 3 });
      }),
    );

    // Collect articles, statuses, and errors
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

    // Dedup, rank, sort
    const deduped = deduplicateArticles(allArticles);
    const sorted = sortArticles(deduped, params);

    // Paginate
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

  getProviderMeta() {
    return this.providers.map((p) => ({
      id: p.id,
      name: p.name,
      features: [...p.supportedFeatures],
    }));
  }
}
