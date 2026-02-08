import { ArticleAggregator } from '@/lib/aggregator';
import { providers } from '@/lib/providers';

const aggregator = new ArticleAggregator(providers);

export async function GET() {
  const categories = await aggregator.getCategories();

  return Response.json({ data: categories }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
