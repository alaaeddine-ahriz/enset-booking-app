'use client';

import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';

type SlotType = 'booked' | 'available' | 'maintenance' | 'myBooking';

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  type: SlotType;
  title?: string;
  subtitle?: string;
  isLast?: boolean;
  onBook?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
}

export function TimeSlot({
  startTime,
  endTime,
  type,
  title,
  subtitle,
  isLast = false,
  onBook,
  onEdit,
  onCancel,
}: TimeSlotProps) {
  const renderContent = () => {
    switch (type) {
      case 'available':
        return (
          <div
            onClick={onBook}
            className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:bg-green-50 dark:hover:bg-green-900/10 hover:border-green-300 dark:hover:border-green-800 transition-all h-[80px] cursor-pointer hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <Icon name="add_circle" />
              <span>Available to Book</span>
            </div>
          </div>
        );

      case 'booked':
        return (
          <div className="flex flex-col p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-slate-400 dark:border-slate-600">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-[var(--color-text-main)] font-bold text-base">{title}</h4>
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Booked
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
              <Icon name="person" size="sm" />
              {subtitle}
            </p>
          </div>
        );

      case 'maintenance':
        return (
          <div className="flex flex-col p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-[var(--color-text-main)] font-bold text-base">{title || 'Maintenance'}</h4>
              <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Unavailable
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
              <Icon name="build" size="sm" />
              {subtitle}
            </p>
          </div>
        );

      case 'myBooking':
        return (
          <div className="flex flex-col p-4 rounded-xl bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/25 transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-white font-bold text-base">{title}</h4>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                My Booking
              </span>
            </div>
            <p className="text-blue-100 text-sm flex items-center gap-1 mb-2">
              <Icon name="group" size="sm" />
              {subtitle}
            </p>
            <div className="mt-2 pt-2 border-t border-white/20 flex gap-2">
              <button
                onClick={onEdit}
                className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex gap-3">
      {/* Time column */}
      <div className="flex flex-col items-end min-w-[48px] pt-1 shrink-0">
        <span className={cn(
          'text-sm font-semibold',
          type === 'myBooking' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-main)]'
        )}>
          {startTime}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{endTime}</span>
      </div>
      
      {/* Timeline column */}
      <div className="flex flex-col items-center w-4 shrink-0 pt-1.5">
        {/* Dot */}
        <div
          className={cn(
            'w-3 h-3 rounded-full border-2 shrink-0 z-10',
            type === 'available' && 'border-green-500 bg-green-500',
            type === 'booked' && 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800',
            type === 'maintenance' && 'border-amber-500 bg-amber-100 dark:bg-amber-900',
            type === 'myBooking' && 'border-[var(--color-primary)] bg-[var(--color-primary)] shadow-[0_0_0_3px_rgba(19,109,236,0.2)]'
          )}
        />
        {/* Connector line */}
        {!isLast && (
          <div className="w-[2px] flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />
        )}
      </div>
      
      {/* Content column */}
      <div className="flex-1 pb-4">
        {renderContent()}
      </div>
    </div>
  );
}
