'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-xl',
};

export function Avatar({ src, alt, initials, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <div
        className={cn(
          'rounded-full overflow-hidden shrink-0 border border-[var(--color-border)] bg-slate-100 dark:bg-slate-700',
          sizeClasses[size],
          className
        )}
      >
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold',
        sizeClasses[size],
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}
