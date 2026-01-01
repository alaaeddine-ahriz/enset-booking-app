'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  icon?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, icon, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]',
          className
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
              <Icon name={icon} size="md" />
            </div>
          )}
          <div>
            {label && (
              <p className="text-base font-medium text-[var(--color-text-main)]">
                {label}
              </p>
            )}
            {description && (
              <p className="text-xs text-[var(--color-text-sub)]">{description}</p>
            )}
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 rounded-full transition-colors',
              'bg-slate-300 dark:bg-slate-600',
              'peer-checked:bg-[var(--color-primary)]',
              'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary)]/30',
              'after:content-[""] after:absolute after:top-[2px] after:start-[2px]',
              'after:bg-white after:border after:border-gray-300 after:rounded-full',
              'after:h-5 after:w-5 after:transition-all',
              'peer-checked:after:translate-x-full peer-checked:after:border-white'
            )}
          />
        </label>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
