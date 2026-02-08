import { ArticleAggregator } from '@/lib/aggregator';
import { providers } from '@/lib/providers';
import type { ProviderID, SearchParams } from '@/lib/types';

const aggregator = new ArticleAggregator(providers);

function parseSearchParams(url: URL): SearchParams {
  const sp = url.searchParams;

  const params: SearchParams = {};

  if (sp.get('q')) params.q = sp.get('q')!;
  if (sp.get('from')) params.from = sp.get('from')!;
  if (sp.get('to')) params.to = sp.get('to')!;
  if (sp.get('category')) params.category = sp.get('category')!;
  if (sp.get('source')) params.source = sp.get('source')!;
  if (sp.get('author')) params.author = sp.get('author')!;
  if (sp.get('page')) params.page = parseInt(sp.get('page')!, 10);
  if (sp.get('pageSize')) params.pageSize = parseInt(sp.get('pageSize')!, 10);

  if (sp.get('providers')) {
    params.providers = sp.get('providers')!.split(',') as ProviderID[];
  }

  // Personalization params
  if (sp.get('preferredSources')) {
    params.preferredSources = sp.get('preferredSources')!.split(',');
  }
  if (sp.get('preferredCategories')) {
    params.preferredCategories = sp.get('preferredCategories')!.split(',');
  }
  if (sp.get('preferredAuthors')) {
    params.preferredAuthors = sp.get('preferredAuthors')!.split(',');
  }

  return params;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = parseSearchParams(url);

  const result = await aggregator.search(params);

  // Return 502 only if all providers failed
  const allDown = result.meta.providerStatuses.every((s) => s.status === 'down');
  const status = allDown && result.data.length === 0 ? 502 : 200;

  return Response.json(result, {
    status,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
