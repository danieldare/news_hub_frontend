import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import type { Article } from '@/lib/types';

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'test-1',
    title: 'Test Headline',
    description: 'This is a test description',
    content: null,
    author: 'Jane Doe',
    source: { id: 'bbc', name: 'BBC News', provider: 'newsapi' },
    category: 'Technology',
    publishedAt: new Date('2025-01-15T12:00:00Z'),
    url: 'https://bbc.com/news/1',
    imageUrl: 'https://bbc.com/img.jpg',
    provider: 'newsapi',
    ...overrides,
  };
}

describe('ArticleCard', () => {
  it('shows the article headline', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it('shows the article summary', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('shows the author name', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows the news provider label', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('NewsAPI')).toBeInTheDocument();
  });

  it('shows the source name when it differs from the provider', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('BBC News')).toBeInTheDocument();
  });

  it('shows the article category', () => {
    render(<ArticleCard article={makeArticle({ category: 'Science' })} />);
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('navigates to the article detail page when clicked', () => {
    render(<ArticleCard article={makeArticle()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/article/test-1');
  });

  it('hides the author when none is provided', () => {
    render(<ArticleCard article={makeArticle({ author: null })} />);
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('shows a placeholder when the article has no image', () => {
    render(<ArticleCard article={makeArticle({ imageUrl: null })} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
