'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  error?: string;
  size?: 'md' | 'lg';
}

const sizeClasses = {
  md: 'h-12 text-sm',
  lg: 'h-14 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leadingIcon,
      trailingIcon,
      error,
      size = 'lg',
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Icon name={leadingIcon} size="md" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl',
              'text-[var(--color-text-main)] placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]',
              'transition-all shadow-sm',
              sizeClasses[size],
              leadingIcon ? 'pl-12' : 'pl-4',
              (trailingIcon || isPassword) ? 'pr-12' : 'pr-4',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="md" />
            </button>
          )}
          {trailingIcon && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[var(--color-primary)]">
              <Icon name={trailingIcon} size="md" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
