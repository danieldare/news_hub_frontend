// ─── Provider Identification ───────────────────────────────────────────────

export type ProviderID = 'newsapi' | 'guardian' | 'nyt';

// ─── Provider Features ─────────────────────────────────────────────────────

export enum ProviderFeature {
  KEYWORD_SEARCH = 'keyword_search',
  DATE_FILTER = 'date_filter',
  CATEGORY_FILTER = 'category_filter',
  AUTHOR_FILTER = 'author_filter',
  SOURCE_FILTER = 'source_filter',
  PAGINATION = 'pagination',
}

// ─── Source Info ────────────────────────────────────────────────────────────

export interface SourceInfo {
  id: string;
  name: string;
  provider: ProviderID;
}

// ─── Article ───────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string | null;
  author: string | null;
  source: SourceInfo;
  category: string | null;
  publishedAt: Date;
  url: string;
  imageUrl: string | null;
  provider: ProviderID;
}

// ─── Category ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  provider: ProviderID;
}

// ─── Search Params ─────────────────────────────────────────────────────────

export interface SearchParams {
  q?: string;
  from?: string;
  to?: string;
  category?: string;
  source?: string;
  author?: string;
  page?: number;
  pageSize?: number;
  providers?: ProviderID[];
  preferredSources?: string[];
  preferredCategories?: string[];
  preferredAuthors?: string[];
}

// ─── Paginated Result ──────────────────────────────────────────────────────

export type ProviderStatus = 'ok' | 'degraded' | 'down';

export interface ProviderStatusInfo {
  provider: ProviderID;
  status: ProviderStatus;
  latencyMs: number | null;
}

export interface ProviderError {
  provider: ProviderID;
  code: 'TIMEOUT' | 'RATE_LIMIT' | 'UPSTREAM_ERROR';
  message: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
    partial: boolean;
    providerStatuses: ProviderStatusInfo[];
  };
  errors: ProviderError[];
}

// ─── News Provider Interface ───────────────────────────────────────────────

export interface NewsProvider {
  readonly id: ProviderID;
  readonly name: string;
  readonly supportedFeatures: Set<ProviderFeature>;

  search(params: SearchParams): Promise<PaginatedResult<Article>>;
  getCategories(): Promise<Category[]>;
  supports(feature: ProviderFeature): boolean;
}

// ─── User Preferences ──────────────────────────────────────────────────────

export interface UserPreferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
  enabledProviders: ProviderID[];
}
