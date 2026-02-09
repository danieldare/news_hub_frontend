'use client';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

const PRESETS = [
  { label: 'Today', from: () => getDateString(0), to: () => getDateString(0) },
  { label: 'This Week', from: () => getDateString(7), to: () => getDateString(0) },
  { label: 'This Month', from: () => getDateString(30), to: () => getDateString(0) },
];

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Date Range</h3>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.from(), preset.to())}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
          >
            {preset.label}
          </button>
        ))}
        {(from || to) && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="date-from" className="mb-1 block text-xs text-gray-500">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={from}
            onChange={(e) => onChange(e.target.value, to)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="date-to" className="mb-1 block text-xs text-gray-500">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={to}
            onChange={(e) => onChange(from, e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
