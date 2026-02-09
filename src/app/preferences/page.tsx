import { PageLayout } from '@/components/layout/PageLayout';

export default function PreferencesPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Preferences
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Customize your news feed by selecting your preferred sources, categories, and authors.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-400">Preferences panel coming soon.</p>
      </div>
    </PageLayout>
  );
}
