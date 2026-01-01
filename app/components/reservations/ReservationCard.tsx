'use client';

import { cn } from '@/lib/utils';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Icon } from '../ui/Icon';

type ReservationStatus = 'confirmed' | 'pending' | 'refused';

interface ReservationCardProps {
  roomName: string;
  courseName: string;
  date: string;
  timeSlot: string;
  status: ReservationStatus;
  imageUrl?: string;
  onClick?: () => void;
  isRefused?: boolean;
}

export function ReservationCard({
  roomName,
  courseName,
  date,
  timeSlot,
  status,
  imageUrl,
  onClick,
  isRefused = false,
}: ReservationCardProps) {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={cn(
        'flex gap-4',
        isRefused && 'opacity-75 grayscale-[0.5]'
      )}
    >
      {/* Image */}
      <div className="relative shrink-0 w-[70px] h-[70px] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="meeting_room" className="text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-[var(--color-text-main)] text-base font-bold leading-tight mb-1">
              {roomName}
            </h4>
            <p className="text-[var(--color-text-sub)] text-xs font-medium line-clamp-1">
              {courseName}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Icon
            name={isRefused ? 'event_busy' : 'calendar_today'}
            size="sm"
            className="text-[var(--color-text-sub)]"
          />
          <p className="text-[var(--color-text-sub)] text-xs font-normal">
            {date} • {timeSlot}
          </p>
        </div>
      </div>
    </Card>
  );
}
