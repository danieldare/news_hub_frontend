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
  it('renders article title', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it('renders article description', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders provider badge', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('NewsAPI')).toBeInTheDocument();
  });

  it('renders source name when different from provider', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('BBC News')).toBeInTheDocument();
  });

  it('renders category when present', () => {
    render(<ArticleCard article={makeArticle({ category: 'Science' })} />);
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('links to original article URL', () => {
    render(<ArticleCard article={makeArticle()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://bbc.com/news/1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render author when null', () => {
    render(<ArticleCard article={makeArticle({ author: null })} />);
    expect(screen.queryByText(/By/)).not.toBeInTheDocument();
  });

  it('renders placeholder when no image', () => {
    const { container } = render(<ArticleCard article={makeArticle({ imageUrl: null })} />);
    // Should have a gradient placeholder div instead of img
    expect(container.querySelector('img')).toBeNull();
  });
});
