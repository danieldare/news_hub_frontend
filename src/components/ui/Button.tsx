'use client';

import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md',
  secondary:
    'border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md',
} as const;

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
} as const;

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`.trim();
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', fullWidth, className = '', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, fullWidth, className })}
        {...props}
      />
    );
  },
);
