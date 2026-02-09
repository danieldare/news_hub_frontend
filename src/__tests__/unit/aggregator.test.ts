import { describe, it, expect, vi } from 'vitest';
import { ArticleAggregator } from '@/lib/aggregator';
import type { Article, NewsProvider, PaginatedResult } from '@/lib/types';
import { ProviderFeature } from '@/lib/types';

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'test-1',
    title: 'Test Article',
    description: 'Description',
    content: null,
    author: null,
    source: { id: 'test', name: 'Test', provider: 'newsapi' },
    category: null,
    publishedAt: new Date('2025-01-15T12:00:00Z'),
    url: 'https://example.com/article',
    imageUrl: null,
    provider: 'newsapi',
    ...overrides,
  };
}

function makeProvider(
  id: string,
  articles: Article[] = [],
  shouldFail = false,
): NewsProvider {
  return {
    id: id as NewsProvider['id'],
    name: id,
    supportedFeatures: new Set([ProviderFeature.KEYWORD_SEARCH]),
    supports: (f: ProviderFeature) => f === ProviderFeature.KEYWORD_SEARCH,
    search: shouldFail
      ? vi.fn().mockRejectedValue(new Error(`${id} failed`))
      : vi.fn().mockResolvedValue({
          data: articles,
          meta: {
            page: 1,
            pageSize: 20,
            total: articles.length,
            hasMore: false,
            partial: false,
            providerStatuses: [{ provider: id, status: 'ok', latencyMs: 100 }],
          },
          errors: [],
        } as PaginatedResult<Article>),
    getCategories: vi.fn().mockResolvedValue([]),
  };
}

describe('ArticleAggregator', () => {
  it('merges articles from multiple providers', async () => {
    const providers = [
      makeProvider('newsapi', [makeArticle({ id: 'n1', url: 'https://a.com/1', provider: 'newsapi' })]),
      makeProvider('guardian', [makeArticle({ id: 'g1', url: 'https://b.com/1', provider: 'guardian' })]),
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({});

    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('handles partial failure (one provider down)', async () => {
    const providers = [
      makeProvider('newsapi', [makeArticle({ id: 'n1', url: 'https://a.com/1' })]),
      makeProvider('guardian', [], true), // fails
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({});

    expect(result.data).toHaveLength(1);
    expect(result.meta.partial).toBe(true);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].provider).toBe('guardian');
  });

  it('returns 0 articles when all providers fail', async () => {
    const providers = [
      makeProvider('newsapi', [], true),
      makeProvider('guardian', [], true),
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({});

    expect(result.data).toHaveLength(0);
    expect(result.meta.partial).toBe(true);
    expect(result.errors).toHaveLength(2);
  });

  it('deduplicates articles across providers', async () => {
    const providers = [
      makeProvider('newsapi', [makeArticle({ id: 'n1', url: 'https://example.com/same', provider: 'newsapi' })]),
      makeProvider('guardian', [makeArticle({ id: 'g1', url: 'https://example.com/same', provider: 'guardian' })]),
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({});

    expect(result.data).toHaveLength(1);
  });

  it('sorts by publishedAt descending by default', async () => {
    const providers = [
      makeProvider('newsapi', [
        makeArticle({ id: 'old', url: 'https://a.com/old', publishedAt: new Date('2025-01-10') }),
        makeArticle({ id: 'new', url: 'https://a.com/new', publishedAt: new Date('2025-01-15') }),
      ]),
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({});

    expect(result.data[0].id).toBe('new');
    expect(result.data[1].id).toBe('old');
  });

  it('ranks preferred content higher', async () => {
    const providers = [
      makeProvider('newsapi', [
        makeArticle({ id: 'normal', url: 'https://a.com/1', source: { id: 'cnn', name: 'CNN', provider: 'newsapi' }, publishedAt: new Date('2025-01-15') }),
        makeArticle({ id: 'preferred', url: 'https://a.com/2', source: { id: 'bbc', name: 'BBC', provider: 'newsapi' }, publishedAt: new Date('2025-01-14') }),
      ]),
    ];

    const aggregator = new ArticleAggregator(providers);
    const result = await aggregator.search({
      preferredSources: ['bbc'],
    });

    expect(result.data[0].id).toBe('preferred');
  });

  it('paginates results correctly', async () => {
    const articles = Array.from({ length: 10 }, (_, i) =>
      makeArticle({
        id: `a${i}`,
        url: `https://a.com/${i}`,
        publishedAt: new Date(`2025-01-${String(15 - i).padStart(2, '0')}`),
      }),
    );

    const providers = [makeProvider('newsapi', articles)];
    const aggregator = new ArticleAggregator(providers);

    const page1 = await aggregator.search({ page: 1, pageSize: 3 });
    expect(page1.data).toHaveLength(3);
    expect(page1.meta.hasMore).toBe(true);

    const page2 = await aggregator.search({ page: 2, pageSize: 3 });
    expect(page2.data).toHaveLength(3);

    // No duplicate IDs across pages
    const page1Ids = page1.data.map((a) => a.id);
    const page2Ids = page2.data.map((a) => a.id);
    expect(page1Ids.filter((id) => page2Ids.includes(id))).toHaveLength(0);
  });

  it('merges categories from all providers', async () => {
    const p1 = makeProvider('newsapi');
    (p1.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'tech', name: 'Technology', provider: 'newsapi' },
    ]);
    const p2 = makeProvider('guardian');
    (p2.getCategories as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'sport', name: 'Sport', provider: 'guardian' },
    ]);

    const aggregator = new ArticleAggregator([p1, p2]);
    const categories = await aggregator.getCategories();

    expect(categories).toHaveLength(2);
  });
});
