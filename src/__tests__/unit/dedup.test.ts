import { describe, it, expect } from 'vitest';
import { canonicalizeUrl, deduplicateArticles } from '@/utils/dedup';
import type { Article } from '@/lib/types';

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'test-1',
    title: 'Test Article',
    description: 'A test article',
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

describe('canonicalizeUrl', () => {
  it('lowercases hostname', () => {
    expect(canonicalizeUrl('https://EXAMPLE.COM/path')).toBe('https://example.com/path');
  });

  it('removes www. prefix', () => {
    expect(canonicalizeUrl('https://www.example.com/path')).toBe('https://example.com/path');
  });

  it('strips utm_ params', () => {
    expect(canonicalizeUrl('https://example.com/path?utm_source=twitter&utm_medium=social&id=123'))
      .toBe('https://example.com/path?id=123');
  });

  it('strips fbclid and gclid params', () => {
    expect(canonicalizeUrl('https://example.com/path?fbclid=abc&gclid=xyz'))
      .toBe('https://example.com/path');
  });

  it('removes trailing slash from path', () => {
    expect(canonicalizeUrl('https://example.com/article/')).toBe('https://example.com/article');
  });

  it('keeps root path slash', () => {
    expect(canonicalizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('returns raw URL on parse failure', () => {
    expect(canonicalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('deduplicateArticles', () => {
  it('removes duplicate URLs', () => {
    const articles = [
      makeArticle({ id: 'a', url: 'https://example.com/story' }),
      makeArticle({ id: 'b', url: 'https://example.com/story' }),
    ];
    const result = deduplicateArticles(articles);
    expect(result).toHaveLength(1);
  });

  it('keeps article with newer publishedAt', () => {
    const articles = [
      makeArticle({ id: 'old', url: 'https://example.com/story', publishedAt: new Date('2025-01-14') }),
      makeArticle({ id: 'new', url: 'https://example.com/story', publishedAt: new Date('2025-01-15') }),
    ];
    const result = deduplicateArticles(articles);
    expect(result[0].id).toBe('new');
  });

  it('prefers guardian over newsapi at same time', () => {
    const date = new Date('2025-01-15');
    const articles = [
      makeArticle({ id: 'newsapi-1', url: 'https://example.com/story', provider: 'newsapi', publishedAt: date }),
      makeArticle({ id: 'guardian-1', url: 'https://example.com/story', provider: 'guardian', publishedAt: date }),
    ];
    const result = deduplicateArticles(articles);
    expect(result[0].provider).toBe('guardian');
  });

  it('prefers nyt over newsapi at same time', () => {
    const date = new Date('2025-01-15');
    const articles = [
      makeArticle({ id: 'newsapi-1', url: 'https://example.com/story', provider: 'newsapi', publishedAt: date }),
      makeArticle({ id: 'nyt-1', url: 'https://example.com/story', provider: 'nyt', publishedAt: date }),
    ];
    const result = deduplicateArticles(articles);
    expect(result[0].provider).toBe('nyt');
  });

  it('deduplicates tracker variants of same URL', () => {
    const articles = [
      makeArticle({ id: 'a', url: 'https://example.com/story?utm_source=twitter' }),
      makeArticle({ id: 'b', url: 'https://example.com/story?utm_source=facebook' }),
    ];
    const result = deduplicateArticles(articles);
    expect(result).toHaveLength(1);
  });

  it('preserves unique articles', () => {
    const articles = [
      makeArticle({ id: 'a', url: 'https://example.com/story-1' }),
      makeArticle({ id: 'b', url: 'https://example.com/story-2' }),
    ];
    const result = deduplicateArticles(articles);
    expect(result).toHaveLength(2);
  });
});
