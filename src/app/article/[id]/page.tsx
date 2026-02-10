import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleAggregator } from '@/lib/aggregator';
import { providers } from '@/lib/providers';
import { PROVIDER_COLORS, PROVIDER_LABELS } from '@/utils/constants';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';

const aggregator = new ArticleAggregator(providers);

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  return aggregator.getArticleById(id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return { title: 'Article Not Found — NewsHub' };
  }

  return {
    title: `${article.title} — NewsHub`,
    description: article.description || undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: article.author ? [article.author] : undefined,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: article.imageUrl ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.description || undefined,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  const providerColor = PROVIDER_COLORS[article.provider] ?? 'bg-gray-100 text-gray-800';
  const providerLabel = PROVIDER_LABELS[article.provider] ?? article.provider;
  const snippet = article.content?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to feed
      </Link>

      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${providerColor}`}>
            {providerLabel}
          </span>
          {article.category && (
            <span className="text-sm text-gray-500">{article.category}</span>
          )}
          <span className="text-sm text-gray-400">{publishedDate}</span>
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
          {article.title}
        </h1>

        {article.description && (
          <p className="text-lg leading-relaxed text-gray-600">
            {article.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          {article.author && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{article.author}</span>
            </div>
          )}
          {article.source.name !== providerLabel && (
            <>
              {article.author && <span className="text-gray-300">&middot;</span>}
              <span className="text-sm text-gray-500">{article.source.name}</span>
            </>
          )}
        </div>
      </header>

      {article.imageUrl && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {snippet && (
        <div className="relative mb-0">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p className="line-clamp-4">{snippet}</p>
          </div>
          <div className="h-24 bg-gradient-to-t from-white to-transparent -mt-24 relative z-10" />
        </div>
      )}

      <div className="flex flex-col items-center gap-3 py-8">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
        >
          Continue reading on {article.source.name}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
        <span className="text-xs text-gray-400">You will be redirected to the original article</span>
      </div>
    </article>
  );
}
