'use client';

import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';
import { type ReactNode } from 'react';

interface TopAppBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  rightActionText?: string;
  onRightAction?: () => void;
  className?: string;
}

export function TopAppBar({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  rightActionText,
  onRightAction,
  className,
}: TopAppBarProps) {
  return (
    <header
      className={cn(
        'flex items-center bg-[var(--color-surface)] px-4 py-4 justify-between sticky top-0 z-20 border-b border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center">
        {showBackButton && (
          <button
            onClick={onBack}
            className="text-[var(--color-text-main)] flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
        )}
      </div>
      <h2 className="text-[var(--color-text-main)] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {title}
      </h2>
      <div className="flex w-10 items-center justify-end">
        {rightAction}
        {rightActionText && (
          <button
            onClick={onRightAction}
            className="text-[var(--color-primary)] text-base font-bold leading-normal tracking-[0.015em] shrink-0 cursor-pointer hover:opacity-80"
          >
            {rightActionText}
          </button>
        )}
      </div>
    </header>
  );
}
