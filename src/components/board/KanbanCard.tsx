import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import { GripVertical, Mail, Phone } from 'lucide-react';
import type { Lead } from '../../type/lead';
import { isTerminal } from '../../type/lead';

interface KanbanCardProps {
  lead: Lead;
  isDragOverlay?: boolean;
}

export function KanbanCard({ lead, isDragOverlay = false }: KanbanCardProps) {
  const terminal = isTerminal(lead.status);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    disabled: terminal,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const initials = lead.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'bg-white border rounded-xl p-3 shadow-soft transition-shadow group',
        isDragging && 'opacity-40 shadow-none',
        isDragOverlay && 'shadow-elevated rotate-1 scale-105',
        terminal ? 'opacity-80 cursor-default' : 'cursor-grab active:cursor-grabbing hover:shadow-card',
        'border-surface-200'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-900 truncate leading-tight">{lead.name}</p>
          </div>
        </div>
        {!terminal && (
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 text-surface-300 hover:text-surface-500 transition-colors p-0.5 opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-surface-500">
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        {lead.source && (
          <span className="text-xs text-surface-500 bg-surface-100 px-1.5 py-0.5 rounded capitalize">
            {lead.source}
          </span>
        )}
        <span className="text-xs text-surface-400 ml-auto">
          {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}