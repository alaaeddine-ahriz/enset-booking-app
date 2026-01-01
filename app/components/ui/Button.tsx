'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]',
  secondary: 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-slate-100 dark:hover:bg-slate-800',
  ghost: 'bg-transparent text-[var(--color-text-main)] hover:bg-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30',
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-4 text-sm rounded-xl gap-2',
  lg: 'h-14 px-6 text-base rounded-xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="animate-spin">
            <Icon name="progress_activity" size="sm" />
          </span>
        )}
        {icon && iconPosition === 'left' && !loading && (
          <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} />
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
