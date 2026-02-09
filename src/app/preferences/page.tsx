'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { PreferencesPanel } from '@/components/preferences/PreferencesPanel';

export default function PreferencesPage() {
  return (
    <PageLayout>
      <div className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Preferences
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Customize your news feed by selecting your preferred sources, categories, and authors.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <PreferencesPanel />
      </div>
    </PageLayout>
  );
}
