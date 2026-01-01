'use client';

import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface FilterChipProps {
  label: string;
  active?: boolean;
  count?: number;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export function FilterChip({
  label,
  active = false,
  count,
  removable = false,
  onClick,
  onRemove,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 shadow-sm transition-all active:scale-95',
        active
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
    >
      <p className="text-sm font-medium">{label}</p>
      {count !== undefined && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
          {count}
        </span>
      )}
      {removable && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="cursor-pointer"
        >
          <Icon name="close" size="sm" />
        </span>
      )}
    </button>
  );
}
