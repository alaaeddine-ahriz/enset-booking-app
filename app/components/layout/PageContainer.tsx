'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export function PageContainer({ children, className, hasBottomNav = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        'relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-[var(--color-background)] shadow-2xl',
        hasBottomNav && 'pb-20',
        className
      )}
    >
      {children}
    </div>
  );
}
