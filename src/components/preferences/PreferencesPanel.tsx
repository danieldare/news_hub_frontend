'use client';

import { useState } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useCategories } from '@/hooks/useCategories';
import { PROVIDER_LABELS } from '@/utils/constants';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { CheckIcon } from '@/components/icons';
import { BatchReveal } from '@/components/ui/BatchReveal';
import type { ProviderID } from '@/lib/types';

const ALL_PROVIDERS: { id: ProviderID; label: string; description: string }[] = [
  { id: 'newsapi', label: 'NewsAPI', description: 'Aggregated from 80,000+ sources' },
  { id: 'guardian', label: 'The Guardian', description: 'Award-winning journalism from the UK' },
  { id: 'nyt', label: 'New York Times', description: 'All the news that\'s fit to print' },
];

export function PreferencesPanel() {
  const {
    enabledProviders,
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
  const { categories: uniqueCategories, isLoading: categoriesLoading } = useCategories();

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
      <div
        className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-in-out ${
          showSaved
            ? 'top-4 opacity-100'
            : '-top-16 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 shadow-lg">
          <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
          <p className="text-sm font-medium text-green-700">Preferences saved</p>
        </div>
      </div>

      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">News Providers</h3>
        <p className="mb-4 text-xs text-gray-500">Choose which providers to fetch articles from.</p>
        <div className="space-y-3">
          {ALL_PROVIDERS.map((provider) => {
            const isEnabled = enabledProviders.includes(provider.id);
            const isLastEnabled = isEnabled && enabledProviders.length === 1;

            const card = (
              <label
                className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                  isLastEnabled
                    ? 'cursor-not-allowed border-blue-200 bg-blue-50/50 opacity-50'
                    : isEnabled
                      ? 'cursor-pointer border-blue-200 bg-blue-50/50'
                      : 'cursor-pointer border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  disabled={isLastEnabled}
                  onChange={() => {
                    toggleProvider(provider.id);
                    flashSaved();
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <div>
                  <span className={`text-sm font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                    {provider.label}
                  </span>
                  <p className="text-xs text-gray-400">{provider.description}</p>
                </div>
              </label>
            );

            return isLastEnabled ? (
              <Tooltip key={provider.id} content="At least one provider must be selected">
                {card}
              </Tooltip>
            ) : (
              <div key={provider.id}>{card}</div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Boost Categories</h3>
        <p className="mb-4 text-xs text-gray-500">Pick your favourite topics to see them first. Unlike the filter on the home page, this won&apos;t hide anything — it just bumps your picks to the top.</p>
        {categoriesLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded-full bg-gray-100" style={{ width: `${55 + Math.random() * 35}px` }} />
            ))}
          </div>
        ) : uniqueCategories.length > 0 ? (
          <BatchReveal
            items={uniqueCategories}
            className="flex flex-wrap gap-2"
            renderItem={(category) => {
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
            }}
          />
        ) : (
          <p className="text-xs text-gray-400">
            Categories will appear once API keys are configured.
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Favorite Authors</h3>
        <p className="mb-4 text-xs text-gray-500">Articles by these authors will appear first.</p>

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
          <Button type="button" size="sm" onClick={handleAddAuthor} disabled={!authorInput.trim()}>
            Add
          </Button>
        </div>
      </section>

      {(preferredCategories.length > 0 || preferredAuthors.length > 0) && (
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
