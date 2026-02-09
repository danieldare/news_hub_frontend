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
import { hashId } from '@/utils/hash';

interface GuardianTag {
  id: string;
  type: string;
  webTitle: string;
  firstName?: string;
  lastName?: string;
}

interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    body?: string;
    thumbnail?: string;
    byline?: string;
  };
  tags?: GuardianTag[];
}

interface GuardianResponse {
  response: {
    status: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    results: GuardianArticle[];
  };
}

function extractAuthor(article: GuardianArticle): string | null {
  if (article.fields?.byline) return article.fields.byline;

  // Fall back to contributor tags if no byline
  const contributor = article.tags?.find((t) => t.type === 'contributor');
  if (contributor) {
    const parts = [contributor.firstName, contributor.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : contributor.webTitle;
  }

  return null;
}

function transformArticle(raw: GuardianArticle): Article {
  return {
    id: hashId(raw.id, 'guardian'),
    title: raw.fields?.headline ?? raw.webTitle,
    description: raw.fields?.trailText ?? '',
    content: raw.fields?.body ?? null,
    author: extractAuthor(raw),
    source: {
      id: 'the-guardian',
      name: 'The Guardian',
      provider: 'guardian',
    },
    category: raw.sectionName ?? null,
    publishedAt: new Date(raw.webPublicationDate),
    url: raw.webUrl,
    imageUrl: raw.fields?.thumbnail ?? null,
    provider: 'guardian',
  };
}

export class GuardianProvider implements NewsProvider {
  readonly id = 'guardian' as const;
  readonly name = 'The Guardian';
  readonly supportedFeatures = new Set([
    ProviderFeature.KEYWORD_SEARCH,
    ProviderFeature.DATE_FILTER,
    ProviderFeature.CATEGORY_FILTER,
    ProviderFeature.AUTHOR_FILTER,
    ProviderFeature.PAGINATION,
  ]);

  private readonly apiKey: string;
  private readonly baseUrl = 'https://content.guardianapis.com';

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
      'api-key': this.apiKey,
      'page': String(page),
      'page-size': String(pageSize),
      'show-fields': 'headline,trailText,body,thumbnail,byline',
      'show-tags': 'contributor',
      'order-by': 'newest',
    });

    if (params.q) searchParams.set('q', params.q);
    if (params.from) searchParams.set('from-date', params.from);
    if (params.to) searchParams.set('to-date', params.to);
    if (params.category) searchParams.set('section', params.category.toLowerCase());
    if (params.author) searchParams.set('tag', `profile/${params.author}`);

    const url = `${this.baseUrl}/search?${searchParams.toString()}`;

    try {
      const data = await apiGet<GuardianResponse>(url);
      const resp = data.response;
      const articles = (resp.results ?? []).map(transformArticle);

      return {
        data: articles,
        meta: {
          page: resp.currentPage,
          pageSize: resp.pageSize,
          total: resp.total,
          hasMore: resp.currentPage < resp.pages,
          partial: false,
          providerStatuses: [{ provider: 'guardian', status: 'ok', latencyMs: null }],
        },
        errors: [],
      };
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const providerError: ProviderError = {
        provider: 'guardian',
        code: apiError?.code ?? 'UPSTREAM_ERROR',
        message: apiError?.message ?? 'Unknown error from The Guardian',
      };
      return {
        data: [],
        meta: {
          page,
          pageSize,
          total: 0,
          hasMore: false,
          partial: false,
          providerStatuses: [{ provider: 'guardian', status: 'down', latencyMs: null }],
        },
        errors: [providerError],
      };
    }
  }

  async getCategories(): Promise<Category[]> {
    const url = `${this.baseUrl}/sections?api-key=${this.apiKey}`;

    try {
      const data = await apiGet<{
        response: { results: { id: string; webTitle: string }[] };
      }>(url);
      return data.response.results.map((s) => ({
        id: s.id,
        name: s.webTitle,
        provider: 'guardian' as const,
      }));
    } catch {
      return [];
    }
  }
}
