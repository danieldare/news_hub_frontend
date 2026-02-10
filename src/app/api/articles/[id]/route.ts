import { ArticleAggregator } from '@/lib/aggregator';
import { providers } from '@/lib/providers';

const aggregator = new ArticleAggregator(providers);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const article = await aggregator.getArticleById(id);

  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 });
  }

  return Response.json({ data: article }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
