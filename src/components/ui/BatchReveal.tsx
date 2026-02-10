'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '@/components/icons';

const BATCH_SIZE = 20;

interface BatchRevealProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  prefix?: ReactNode;
  className?: string;
}

export function BatchReveal<T>({ items, renderItem, prefix, className = '' }: BatchRevealProps<T>) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;
  const isExpanded = visibleCount >= items.length;

  return (
    <>
      <div className={className}>
        {prefix}
        {visible.map((item, i) => renderItem(item, i))}
      </div>
      {items.length > BATCH_SIZE && (
        <div className="mt-3 flex items-center justify-center gap-3">
          {visibleCount > BATCH_SIZE && (
            <button
              type="button"
              onClick={() => setVisibleCount(BATCH_SIZE)}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              <ChevronDownIcon className="h-3.5 w-3.5 rotate-180" />
              Show less
            </button>
          )}
          {!isExpanded && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, items.length))}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Show {Math.min(remaining, BATCH_SIZE)} more categories
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
