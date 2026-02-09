import { ArticleAggregator } from '@/lib/aggregator';
import { providers } from '@/lib/providers';

const aggregator = new ArticleAggregator(providers);

export async function GET() {
  const sources = aggregator.getProviderMeta();

  return Response.json({ data: sources }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
