'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

export function TabGroup({ tabs, activeTab, onChange, variant = 'underline' }: TabGroupProps) {
  if (variant === 'pills') {
    return (
      <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
        {tabs.map((tab) => (
          <label
            key={tab.id}
            className={cn(
              'flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md transition-all duration-200 text-sm font-semibold leading-normal',
              activeTab === tab.id
                ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-primary)]'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <span className="truncate">{tab.label}</span>
            <input
              type="radio"
              name="tab-group"
              value={tab.id}
              checked={activeTab === tab.id}
              onChange={() => onChange(tab.id)}
              className="invisible w-0 absolute"
            />
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-between gap-2 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 flex-1 transition-all',
            activeTab === tab.id
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-[var(--color-text-sub)] hover:text-[var(--color-text-main)]'
          )}
        >
          <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
        </button>
      ))}
    </div>
  );
}
