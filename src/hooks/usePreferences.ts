'use client';

import { usePreferencesStore } from '@/stores/preferences';
import type { SearchParams } from '@/lib/types';

export function usePreferences() {
  const store = usePreferencesStore();

  const getSearchParams = (): Partial<SearchParams> => {
    const params: Partial<SearchParams> = {};

    if (store.enabledProviders.length > 0 && store.enabledProviders.length < 3) {
      params.providers = store.enabledProviders;
    }
    if (store.preferredCategories.length > 0) {
      params.preferredCategories = store.preferredCategories;
    }
    if (store.preferredAuthors.length > 0) {
      params.preferredAuthors = store.preferredAuthors;
    }

    return params;
  };

  const hasPreferences =
    store.preferredCategories.length > 0 ||
    store.preferredAuthors.length > 0;

  return {
    ...store,
    getSearchParams,
    hasPreferences,
  };
}
