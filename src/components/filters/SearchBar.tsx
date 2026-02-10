'use client';

import { useState, useEffect, memo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchIcon, CloseIcon } from '@/components/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = memo(function SearchBar({ value, onChange }: SearchBarProps) {
  const [input, setInput] = useState(value);
  const debouncedInput = useDebounce(input, 300);

  // Sync debounced value to parent
  useEffect(() => {
    if (debouncedInput !== value) {
      onChange(debouncedInput);
    }
  }, [debouncedInput, onChange, value]);

  // Sync external value changes back to input
  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(input);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {input && (
        <button
          type="button"
          onClick={() => {
            setInput('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </form>
  );
});
