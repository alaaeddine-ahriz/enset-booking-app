'use client';

import { cn } from '@/lib/utils';

type StatusType = 'confirmed' | 'pending' | 'refused' | 'available' | 'unavailable' | 'booked';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; classes: string; dotColor: string }> = {
  confirmed: {
    label: 'Confirmed',
    classes: 'bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)]',
    dotColor: 'bg-[var(--color-primary)]',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  refused: {
    label: 'Refused',
    classes: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    dotColor: 'bg-red-500',
  },
  available: {
    label: 'Available',
    classes: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  unavailable: {
    label: 'Unavailable',
    classes: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    dotColor: 'bg-amber-500',
  },
  booked: {
    label: 'Booked',
    classes: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    dotColor: 'bg-slate-500',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full',
        config.classes,
        className
      )}
    >
      <div className={cn('size-1.5 rounded-full', config.dotColor)} />
      <span className="text-[10px] font-bold uppercase tracking-wide">
        {config.label}
      </span>
    </div>
  );
}
