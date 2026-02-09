'use client';

import { PROVIDER_LABELS } from '@/utils/constants';
import type { ProviderID } from '@/lib/types';

const ALL_PROVIDERS: ProviderID[] = ['newsapi', 'guardian', 'nyt'];

interface SourceFilterProps {
  selectedProviders: ProviderID[];
  onChange: (providers: ProviderID[]) => void;
}

export function SourceFilter({ selectedProviders, onChange }: SourceFilterProps) {
  const toggleProvider = (provider: ProviderID) => {
    if (selectedProviders.includes(provider)) {
      onChange(selectedProviders.filter((p) => p !== provider));
    } else {
      onChange([...selectedProviders, provider]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Sources</h3>
      <div className="flex flex-col gap-2">
        {ALL_PROVIDERS.map((provider) => {
          const isSelected =
            selectedProviders.length === 0 || selectedProviders.includes(provider);
          return (
            <label
              key={provider}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleProvider(provider)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={isSelected ? 'text-gray-900' : 'text-gray-400'}>
                {PROVIDER_LABELS[provider]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
