import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import { Lock } from 'lucide-react';
import type { Lead, LeadStatus } from '../../type/lead';
import { STATUS_CONFIG, isTerminal } from '../../type/lead';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  isOver?: boolean;
  isInvalidDrop?: boolean;
}

export function KanbanColumn({ status, leads, isOver, isInvalidDrop }: KanbanColumnProps) {
  const cfg = STATUS_CONFIG[status];
  const terminal = isTerminal(status);

  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[240px] w-[240px] flex-shrink-0">
      {/* Column header */}
      <div
        className={clsx(
          'flex items-center justify-between px-3 py-2.5 rounded-t-xl border border-b-0',
          cfg.bg,
          cfg.border
        )}
      >
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', cfg.dot)} />
          <span className={clsx('text-sm font-semibold', cfg.color)}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {terminal && <Lock className={clsx('w-3 h-3', cfg.color, 'opacity-60')} />}
          <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded-md', cfg.bg, cfg.color)}>
            {leads.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 min-h-[400px] p-2 rounded-b-xl border transition-colors overflow-y-auto',
          isInvalidDrop
            ? 'border-rose-300 bg-rose-50'
            : isOver
            ? 'border-brand-300 bg-brand-50/50'
            : 'border-surface-200 bg-surface-50/50',
          terminal && 'opacity-90'
        )}
      >
        <SortableContext
          items={leads.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {leads.map((lead) => (
              <KanbanCard key={lead.id} lead={lead} />
            ))}
          </div>
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-surface-200">
            <p className="text-xs text-surface-400">
              {terminal ? 'No leads here' : 'Drop leads here'}
            </p>
          </div>
        )}

        {isInvalidDrop && (
          <div className="mt-2 px-2 py-1.5 bg-rose-100 border border-rose-200 rounded-lg">
            <p className="text-xs text-rose-600 font-medium text-center">Invalid transition</p>
          </div>
        )}
      </div>
    </div>
  );
}