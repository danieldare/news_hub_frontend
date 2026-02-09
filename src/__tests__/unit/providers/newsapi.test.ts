import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsApiProvider } from '@/lib/providers/newsapi.provider';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('NewsApiProvider', () => {
  let provider: NewsApiProvider;

  beforeEach(() => {
    provider = new NewsApiProvider('test-api-key');
    mockFetch.mockReset();
  });

  it('transforms articles correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 1,
        articles: [
          {
            source: { id: 'bbc-news', name: 'BBC News' },
            author: 'John Doe',
            title: 'Breaking News',
            description: 'Something happened',
            url: 'https://bbc.com/news/1',
            urlToImage: 'https://bbc.com/img.jpg',
            publishedAt: '2025-01-15T12:00:00Z',
            content: 'Full content here',
          },
        ],
      }),
    });

    const result = await provider.search({ q: 'test' });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Breaking News');
    expect(result.data[0].author).toBe('John Doe');
    expect(result.data[0].provider).toBe('newsapi');
    expect(result.data[0].source.name).toBe('BBC News');
  });

  it('filters out [Removed] articles', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 2,
        articles: [
          {
            source: { id: null, name: '[Removed]' },
            author: null,
            title: '[Removed]',
            description: null,
            url: 'https://removed.com',
            urlToImage: null,
            publishedAt: '2025-01-15T12:00:00Z',
            content: null,
          },
          {
            source: { id: 'bbc', name: 'BBC' },
            author: 'Jane',
            title: 'Real Article',
            description: 'Description',
            url: 'https://bbc.com/real',
            urlToImage: null,
            publishedAt: '2025-01-15T12:00:00Z',
            content: null,
          },
        ],
      }),
    });

    const result = await provider.search({ q: 'test' });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Real Article');
  });

  it('handles API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ message: 'Rate limited' }),
    });

    const result = await provider.search({ q: 'test' });

    expect(result.data).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe('RATE_LIMIT');
    expect(result.meta.providerStatuses[0].status).toBe('down');
  });

  it('handles null fields in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 1,
        articles: [
          {
            source: { id: null, name: 'Unknown' },
            author: null,
            title: 'Title Only',
            description: null,
            url: 'https://example.com/null-fields',
            urlToImage: null,
            publishedAt: '2025-01-15T12:00:00Z',
            content: null,
          },
        ],
      }),
    });

    const result = await provider.search({});

    expect(result.data[0].author).toBeNull();
    expect(result.data[0].description).toBe('');
    expect(result.data[0].imageUrl).toBeNull();
  });

  it('returns static categories', async () => {
    const categories = await provider.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.every((c) => c.provider === 'newsapi')).toBe(true);
  });

  it('uses /top-headlines when no keyword', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok', totalResults: 0, articles: [] }),
    });

    await provider.search({});

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('/top-headlines');
    expect(calledUrl).toContain('country=us');
  });

  it('uses /everything when keyword provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok', totalResults: 0, articles: [] }),
    });

    await provider.search({ q: 'bitcoin' });

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('/everything');
    expect(calledUrl).toContain('q=bitcoin');
  });
});
