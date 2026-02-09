import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProviderID, UserPreferences } from '@/lib/types';

interface PreferencesState extends UserPreferences {
  hasOnboarded: boolean;
  setPreferredSources: (sources: string[]) => void;
  setPreferredCategories: (categories: string[]) => void;
  setPreferredAuthors: (authors: string[]) => void;
  setEnabledProviders: (providers: ProviderID[]) => void;
  toggleProvider: (provider: ProviderID) => void;
  toggleSource: (source: string) => void;
  toggleCategory: (category: string) => void;
  addAuthor: (author: string) => void;
  removeAuthor: (author: string) => void;
  markOnboarded: () => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences & { hasOnboarded: boolean } = {
  preferredSources: [],
  preferredCategories: [],
  preferredAuthors: [],
  enabledProviders: ['newsapi', 'guardian', 'nyt'],
  hasOnboarded: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setPreferredSources: (sources) => set({ preferredSources: sources }),

      setPreferredCategories: (categories) => set({ preferredCategories: categories }),

      setPreferredAuthors: (authors) => set({ preferredAuthors: authors }),

      setEnabledProviders: (providers) => set({ enabledProviders: providers }),

      toggleProvider: (provider) =>
        set((state) => {
          const current = state.enabledProviders;
          if (current.includes(provider)) {
            // Don't allow disabling all providers
            if (current.length <= 1) return state;
            return { enabledProviders: current.filter((p) => p !== provider) };
          }
          return { enabledProviders: [...current, provider] };
        }),

      toggleSource: (source) =>
        set((state) => {
          const current = state.preferredSources;
          if (current.includes(source)) {
            return { preferredSources: current.filter((s) => s !== source) };
          }
          return { preferredSources: [...current, source] };
        }),

      toggleCategory: (category) =>
        set((state) => {
          const current = state.preferredCategories;
          if (current.includes(category)) {
            return { preferredCategories: current.filter((c) => c !== category) };
          }
          return { preferredCategories: [...current, category] };
        }),

      addAuthor: (author) =>
        set((state) => {
          if (state.preferredAuthors.includes(author)) return state;
          return { preferredAuthors: [...state.preferredAuthors, author] };
        }),

      removeAuthor: (author) =>
        set((state) => ({
          preferredAuthors: state.preferredAuthors.filter((a) => a !== author),
        })),

      markOnboarded: () => set({ hasOnboarded: true }),

      resetPreferences: () => set({ ...DEFAULT_PREFERENCES, hasOnboarded: true }),
    }),
    {
      name: 'newshub-preferences',
    },
  ),
);
