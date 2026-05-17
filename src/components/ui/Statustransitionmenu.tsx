import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { STATUS_CONFIG, getValidTransitions, isTerminal, type LeadStatus } from '../../type/lead';
import { StatusBadge } from './StatusBadge';

interface StatusTransitionMenuProps {
  currentStatus: LeadStatus;
  onTransition: (status: LeadStatus) => void;
  isLoading?: boolean;
}

export function StatusTransitionMenu({
  currentStatus,
  onTransition,
  isLoading,
}: StatusTransitionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const transitions = getValidTransitions(currentStatus);
  const terminal = isTerminal(currentStatus);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (terminal) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-surface-400 font-medium">
        <Lock className="w-3 h-3" />
        <span>Final</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isLoading}
        className={clsx(
          'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border',
          'text-surface-600 bg-white border-surface-200 hover:border-surface-300 hover:bg-surface-50',
          'transition-colors disabled:opacity-50'
        )}
      >
        <span>Move to</span>
        <ChevronDown className={clsx('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-surface-200 rounded-xl shadow-modal min-w-[140px] py-1 animate-scale-in">
          {transitions.map((status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => {
                  onTransition(status);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                <span className={clsx('w-2 h-2 rounded-full', cfg.dot)} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Inline pill variant for detail views
export function StatusTransitionPills({
  currentStatus,
  onTransition,
  isLoading,
}: StatusTransitionMenuProps) {
  const transitions = getValidTransitions(currentStatus);
  const terminal = isTerminal(currentStatus);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={currentStatus} />
      {terminal ? (
        <span className="flex items-center gap-1 text-xs text-surface-400">
          <Lock className="w-3 h-3" />
          Status locked
        </span>
      ) : (
        <>
          <span className="text-xs text-surface-400">→</span>
          {transitions.map((status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => onTransition(status)}
                disabled={isLoading}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                  'hover:shadow-soft disabled:opacity-50',
                  cfg.bg,
                  cfg.color,
                  cfg.border
                )}
              >
                <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                {cfg.label}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}