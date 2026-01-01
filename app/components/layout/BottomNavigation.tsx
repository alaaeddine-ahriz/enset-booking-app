'use client';

import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export function BottomNavigation({ items, activeItem, onItemClick }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
              activeItem === item.id
                ? 'text-[var(--color-primary)]'
                : 'text-slate-400 dark:text-slate-500 hover:text-[var(--color-primary)]'
            )}
          >
            <div className="relative">
              <Icon
                name={item.icon}
                filled={activeItem === item.id}
              />
              {item.badge && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-[var(--color-surface)]" />
              )}
            </div>
            <span className={cn(
              'text-[10px]',
              activeItem === item.id ? 'font-bold' : 'font-medium'
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
