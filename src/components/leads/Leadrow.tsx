import { memo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { Lead } from '../../type/lead';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatusTransitionMenu } from '../ui/Statustransitionmenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDeleteLead, useChangeStatus } from '../../hooks/useleads';
import { EditLeadModal } from './Leadformmodal';
import { useNavigate } from 'react-router-dom';

interface LeadRowProps {
  lead: Lead;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const LeadRow = memo(function LeadRow({ lead, isSelected, onToggleSelect }: LeadRowProps) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteLead();
  const changeStatus = useChangeStatus();

  const initials = lead.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <tr
        className={clsx(
          'group border-b border-surface-100 transition-colors',
          isSelected ? 'bg-brand-50' : 'hover:bg-surface-50/70'
        )}
      >
        <td className="pl-4 pr-2 py-3 w-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500/20 cursor-pointer accent-brand-500"
          />
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-surface-900 leading-tight">{lead.name}</div>
              <div className="text-xs text-surface-500 leading-tight">{lead.email}</div>
            </div>
          </div>
        </td>

        <td className="px-4 py-3">
          <StatusBadge status={lead.status} />
        </td>

        <td className="px-4 py-3">
          {lead.source ? (
            <span className="text-xs text-surface-600 bg-surface-100 px-2 py-0.5 rounded-md font-medium capitalize">
              {lead.source}
            </span>
          ) : (
            <span className="text-xs text-surface-300">—</span>
          )}
        </td>

        <td className="px-4 py-3 text-xs text-surface-500 whitespace-nowrap">
          {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
        </td>

        <td className="px-4 py-3">
          <StatusTransitionMenu
            currentStatus={lead.status}
            onTransition={(status) => changeStatus.mutate({ id: lead.id, status })}
            isLoading={changeStatus.isPending && changeStatus.variables?.id === lead.id}
          />
        </td>

        <td className="px-4 py-3 pr-4">
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate(`/leads/${lead.id}`)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
              title="View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>

      <EditLeadModal lead={editOpen ? lead : null} onClose={() => setEditOpen(false)} />

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteMutation.mutate(lead.id);
          setConfirmDelete(false);
        }}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </>
  );
});