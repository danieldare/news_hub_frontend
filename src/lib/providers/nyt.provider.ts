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

// ─── NYT Response Types ────────────────────────────────────────────────────

interface NytMultimedia {
  url: string;
  subtype: string;
  type: string;
  width: number;
  height: number;
}

interface NytArticle {
  _id: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  abstract: string;
  headline: { main: string; kicker?: string };
  byline?: { original: string | null };
  pub_date: string;
  news_desk: string;
  section_name: string;
  source: string;
  multimedia: NytMultimedia[];
}

interface NytResponse {
  status: string;
  response: {
    docs: NytArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function extractImageUrl(multimedia: NytMultimedia[]): string | null {
  if (!multimedia || multimedia.length === 0) return null;
  // Prefer xlarge or large images
  const preferred = multimedia.find(
    (m) => m.subtype === 'xlarge' || m.subtype === 'superJumbo' || m.subtype === 'large',
  );
  const image = preferred ?? multimedia[0];
  const url = image.url;
  // NYT images may be relative paths
  return url.startsWith('http') ? url : `https://static01.nyt.com/${url}`;
}

function extractAuthor(byline?: { original: string | null }): string | null {
  if (!byline?.original) return null;
  // Remove "By " prefix
  return byline.original.replace(/^By\s+/i, '');
}

function generateId(nytId: string): string {
  let hash = 0;
  for (let i = 0; i < nytId.length; i++) {
    const char = nytId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `nyt-${Math.abs(hash).toString(36)}`;
}

function transformArticle(raw: NytArticle): Article {
  return {
    id: generateId(raw._id),
    title: raw.headline?.main ?? '',
    description: raw.abstract || raw.snippet || raw.lead_paragraph || '',
    content: raw.lead_paragraph || null,
    author: extractAuthor(raw.byline),
    source: {
      id: 'the-new-york-times',
      name: raw.source || 'The New York Times',
      provider: 'nyt',
    },
    category: raw.news_desk || raw.section_name || null,
    publishedAt: new Date(raw.pub_date),
    url: raw.web_url,
    imageUrl: extractImageUrl(raw.multimedia),
    provider: 'nyt',
  };
}

// ─── Provider ──────────────────────────────────────────────────────────────

export class NytProvider implements NewsProvider {
  readonly id = 'nyt' as const;
  readonly name = 'New York Times';
  readonly supportedFeatures = new Set([
    ProviderFeature.KEYWORD_SEARCH,
    ProviderFeature.DATE_FILTER,
    ProviderFeature.CATEGORY_FILTER,
    ProviderFeature.AUTHOR_FILTER,
    ProviderFeature.PAGINATION,
  ]);

  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.nytimes.com/svc/search/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  supports(feature: ProviderFeature): boolean {
    return this.supportedFeatures.has(feature);
  }

  async search(params: SearchParams): Promise<PaginatedResult<Article>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10; // NYT returns 10 per page

    const searchParams = new URLSearchParams({
      'api-key': this.apiKey,
      'page': String(page - 1), // NYT uses 0-based pages
      'sort': 'newest',
    });

    if (params.q) searchParams.set('q', params.q);
    if (params.from) searchParams.set('begin_date', params.from.replace(/-/g, ''));
    if (params.to) searchParams.set('end_date', params.to.replace(/-/g, ''));

    // Build filter query (fq)
    const filters: string[] = [];
    if (params.category) filters.push(`news_desk:("${params.category}")`);
    if (params.author) filters.push(`byline:("${params.author}")`);
    if (filters.length > 0) searchParams.set('fq', filters.join(' AND '));

    const url = `${this.baseUrl}/articlesearch.json?${searchParams.toString()}`;

    try {
      const data = await apiGet<NytResponse>(url);
      const docs = data.response?.docs ?? [];
      const articles = docs.map(transformArticle);
      const totalHits = data.response?.meta?.hits ?? 0;

      return {
        data: articles,
        meta: {
          page,
          pageSize,
          total: totalHits,
          hasMore: page * pageSize < totalHits,
          partial: false,
          providerStatuses: [{ provider: 'nyt', status: 'ok', latencyMs: null }],
        },
        errors: [],
      };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const providerError: ProviderError = {
        provider: 'nyt',
        code: apiError?.code ?? 'UPSTREAM_ERROR',
        message: apiError?.message ?? 'Unknown error from NYT',
      };
      return {
        data: [],
        meta: {
          page,
          pageSize,
          total: 0,
          hasMore: false,
          partial: false,
          providerStatuses: [{ provider: 'nyt', status: 'down', latencyMs: null }],
        },
        errors: [providerError],
      };
    }
  }

  async getCategories(): Promise<Category[]> {
    // NYT doesn't have a public categories endpoint; return common news desks
    const desks = [
      'Arts',
      'Business',
      'Climate',
      'Education',
      'Fashion',
      'Food',
      'Health',
      'Magazine',
      'Movies',
      'National',
      'Opinion',
      'Politics',
      'Science',
      'Sports',
      'Technology',
      'Travel',
      'World',
    ];
    return desks.map((d) => ({
      id: d.toLowerCase(),
      name: d,
      provider: 'nyt' as const,
    }));
  }
}
