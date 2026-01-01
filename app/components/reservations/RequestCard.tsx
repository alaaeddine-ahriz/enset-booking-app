'use client';

import { cn } from '@/lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface RequestCardProps {
  roomName: string;
  requesterName: string;
  department: string;
  date: string;
  timeSlot: string;
  avatarUrl?: string;
  avatarInitials?: string;
  conflictMessage?: string;
  onValidate?: () => void;
  onModify?: () => void;
  onRefuse?: () => void;
  compact?: boolean;
}

export function RequestCard({
  roomName,
  requesterName,
  department,
  date,
  timeSlot,
  avatarUrl,
  avatarInitials,
  conflictMessage,
  onValidate,
  onModify,
  onRefuse,
  compact = true,
}: RequestCardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Conflict Banner */}
      {conflictMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30 px-4 py-2 flex items-center gap-2">
          <Icon name="warning" size="sm" className="text-red-600" />
          <p className="text-red-700 dark:text-red-300 text-xs font-semibold">
            {conflictMessage}
          </p>
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-4">
          <Avatar
            src={avatarUrl}
            initials={avatarInitials}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-bold text-[var(--color-text-main)] truncate">
                {roomName}
              </h4>
              {!conflictMessage && (
                <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
                  Pending
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-0.5">
              {requesterName} • {department}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 dark:text-slate-400 text-sm">
              <Icon name="calendar_today" size="sm" />
              <span>{date}</span>
              <span className="mx-1">•</span>
              <Icon name="schedule" size="sm" />
              <span>{timeSlot}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          {compact ? (
            <>
              <button
                onClick={onRefuse}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Icon name="close" />
              </button>
              <button
                onClick={onModify}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-slate-500 hover:text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
              >
                <Icon name="edit" />
              </button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={onValidate}
              >
                Validate Request
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={conflictMessage ? 'danger' : 'secondary'}
                size="md"
                icon="close"
                iconPosition="left"
                fullWidth
                onClick={onRefuse}
              >
                Refuse
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon="edit"
                iconPosition="left"
                fullWidth
                onClick={onModify}
              >
                Modify
              </Button>
              <Button
                variant="primary"
                size="md"
                icon="check"
                iconPosition="left"
                fullWidth
                onClick={onValidate}
              >
                Validate
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
