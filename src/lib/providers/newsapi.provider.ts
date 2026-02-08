import { apiGet, ApiError } from '@/lib/api-client';
import type {
  Article,
  Category,
  NewsProvider,
  PaginatedResult,
  SearchParams,
  ProviderError,
} from '@/lib/types';
import { ProviderFeature } from '@/lib/types';

// ─── NewsAPI Response Types ────────────────────────────────────────────────

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `newsapi-${Math.abs(hash).toString(36)}`;
}

function transformArticle(raw: NewsApiArticle): Article {
  return {
    id: generateId(raw.url),
    title: raw.title ?? '',
    description: raw.description ?? '',
    content: raw.content,
    author: raw.author,
    source: {
      id: raw.source.id ?? raw.source.name.toLowerCase().replace(/\s+/g, '-'),
      name: raw.source.name,
      provider: 'newsapi',
    },
    category: null, // NewsAPI doesn't provide category per article
    publishedAt: new Date(raw.publishedAt),
    url: raw.url,
    imageUrl: raw.urlToImage,
    provider: 'newsapi',
  };
}

// ─── Provider ──────────────────────────────────────────────────────────────

export class NewsApiProvider implements NewsProvider {
  readonly id = 'newsapi' as const;
  readonly name = 'NewsAPI';
  readonly supportedFeatures = new Set([
    ProviderFeature.KEYWORD_SEARCH,
    ProviderFeature.DATE_FILTER,
    ProviderFeature.SOURCE_FILTER,
    ProviderFeature.PAGINATION,
  ]);

  private readonly apiKey: string;
  private readonly baseUrl = 'https://newsapi.org/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  supports(feature: ProviderFeature): boolean {
    return this.supportedFeatures.has(feature);
  }

  async search(params: SearchParams): Promise<PaginatedResult<Article>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const searchParams = new URLSearchParams({
      apiKey: this.apiKey,
      page: String(page),
      pageSize: String(pageSize),
      language: 'en',
    });

    // Use /everything for keyword search, /top-headlines otherwise
    const hasKeyword = params.q && params.q.trim().length > 0;
    const endpoint = hasKeyword ? 'everything' : 'top-headlines';

    if (hasKeyword) {
      searchParams.set('q', params.q!);
    } else {
      // top-headlines requires at least country or category
      searchParams.set('country', 'us');
    }

    if (params.from) searchParams.set('from', params.from);
    if (params.to) searchParams.set('to', params.to);
    if (params.source) searchParams.set('sources', params.source);

    const url = `${this.baseUrl}/${endpoint}?${searchParams.toString()}`;

    try {
      const data = await apiGet<NewsApiResponse>(url);
      const articles = (data.articles ?? [])
        .filter((a) => a.title && a.title !== '[Removed]')
        .map(transformArticle);

      return {
        data: articles,
        meta: {
          page,
          pageSize,
          total: data.totalResults ?? 0,
          hasMore: page * pageSize < (data.totalResults ?? 0),
          partial: false,
          providerStatuses: [{ provider: 'newsapi', status: 'ok', latencyMs: null }],
        },
        errors: [],
      };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const providerError: ProviderError = {
        provider: 'newsapi',
        code: apiError?.code ?? 'UPSTREAM_ERROR',
        message: apiError?.message ?? 'Unknown error from NewsAPI',
      };
      return {
        data: [],
        meta: {
          page,
          pageSize,
          total: 0,
          hasMore: false,
          partial: false,
          providerStatuses: [{ provider: 'newsapi', status: 'down', latencyMs: null }],
        },
        errors: [providerError],
      };
    }
  }

  async getCategories(): Promise<Category[]> {
    // NewsAPI doesn't have a categories endpoint; return static list
    const categories = [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology',
    ];
    return categories.map((c) => ({
      id: c,
      name: c.charAt(0).toUpperCase() + c.slice(1),
      provider: 'newsapi' as const,
    }));
  }
}
