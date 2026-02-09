'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePreferences } from '@/hooks/usePreferences';
import { PROVIDER_LABELS } from '@/utils/constants';
import type { Category, ProviderID } from '@/lib/types';

const ALL_PROVIDERS: { id: ProviderID; label: string; description: string }[] = [
  { id: 'newsapi', label: 'NewsAPI', description: 'Aggregated from 80,000+ sources' },
  { id: 'guardian', label: 'The Guardian', description: 'Award-winning journalism from the UK' },
  { id: 'nyt', label: 'New York Times', description: 'All the news that\'s fit to print' },
];

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function PreferencesPanel() {
  const {
    enabledProviders,
    preferredSources,
    preferredCategories,
    preferredAuthors,
    toggleProvider,
    toggleCategory,
    removeAuthor,
    addAuthor,
    resetPreferences,
  } = usePreferences();

  const [authorInput, setAuthorInput] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.name.toLowerCase(), c])).values(),
  );

  const handleAddAuthor = () => {
    const trimmed = authorInput.trim();
    if (trimmed) {
      addAuthor(trimmed);
      setAuthorInput('');
      flashSaved();
    }
  };

  const flashSaved = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Save confirmation */}
      {showSaved && (
        <div className="animate-fade-in flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Preferences saved automatically
        </div>
      )}

      {/* Enabled Providers */}
      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">News Providers</h3>
        <p className="mb-4 text-xs text-gray-500">Choose which providers to fetch articles from.</p>
        <div className="space-y-3">
          {ALL_PROVIDERS.map((provider) => {
            const isEnabled = enabledProviders.includes(provider.id);
            return (
              <label
                key={provider.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  isEnabled
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => {
                    toggleProvider(provider.id);
                    flashSaved();
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className={`text-sm font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                    {provider.label}
                  </span>
                  <p className="text-xs text-gray-400">{provider.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Preferred Categories */}
      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Preferred Categories</h3>
        <p className="mb-4 text-xs text-gray-500">Articles from these categories will be ranked higher.</p>
        {uniqueCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {uniqueCategories.map((category) => {
              const isSelected = preferredCategories.includes(category.name);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    toggleCategory(category.name);
                    flashSaved();
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                  {isSelected && (
                    <span className="ml-1.5 text-blue-400">&times;</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Categories will appear once API keys are configured.
          </p>
        )}
      </section>

      {/* Preferred Authors */}
      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Favorite Authors</h3>
        <p className="mb-4 text-xs text-gray-500">Articles by these authors will appear first.</p>

        {/* Author chips */}
        {preferredAuthors.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {preferredAuthors.map((author) => (
              <span
                key={author}
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {author}
                <button
                  type="button"
                  onClick={() => {
                    removeAuthor(author);
                    flashSaved();
                  }}
                  className="ml-0.5 text-blue-400 hover:text-blue-600"
                  aria-label={`Remove ${author}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add author input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAuthor();
              }
            }}
            placeholder="Add an author name..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddAuthor}
            disabled={!authorInput.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </section>

      {/* Preferences Summary */}
      {(preferredSources.length > 0 || preferredCategories.length > 0 || preferredAuthors.length > 0) && (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Current Preferences</h3>
          <div className="space-y-1.5 text-xs text-gray-600">
            <p>
              <span className="font-medium text-gray-700">Providers:</span>{' '}
              {enabledProviders.map((p) => PROVIDER_LABELS[p]).join(', ')}
            </p>
            {preferredCategories.length > 0 && (
              <p>
                <span className="font-medium text-gray-700">Categories:</span>{' '}
                {preferredCategories.join(', ')}
              </p>
            )}
            {preferredAuthors.length > 0 && (
              <p>
                <span className="font-medium text-gray-700">Authors:</span>{' '}
                {preferredAuthors.join(', ')}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Reset */}
      <div className="border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => {
            resetPreferences();
            flashSaved();
          }}
          className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
        >
          Reset all preferences
        </button>
      </div>
    </div>
  );
}
