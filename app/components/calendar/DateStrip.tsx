'use client';

import { cn } from '@/lib/utils';

interface DateItem {
  day: string;
  date: number;
  fullDate: string;
}

interface DateStripProps {
  dates: DateItem[];
  selectedDate: string;
  onDateSelect: (fullDate: string) => void;
}

export function DateStrip({ dates, selectedDate, onDateSelect }: DateStripProps) {
  return (
    <div className="pb-2 border-b border-[var(--color-border)]">
      <div className="flex px-4 justify-between gap-2 overflow-x-auto no-scrollbar">
        {dates.map((dateItem) => {
          const isSelected = dateItem.fullDate === selectedDate;
          return (
            <button
              key={dateItem.fullDate}
              onClick={() => onDateSelect(dateItem.fullDate)}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] rounded-xl py-2 px-1 transition-colors',
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                {dateItem.day}
              </span>
              <span className="text-lg font-bold">{dateItem.date}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
