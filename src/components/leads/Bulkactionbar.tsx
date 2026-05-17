import { useState } from 'react';
import { Trash2, ChevronDown, X, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { STATUS_CONFIG, getValidTransitions, type LeadStatus, type Lead } from '../../type/lead';
import { useBulkDelete, useBulkChangeStatus } from '../../hooks/useleads';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface BulkActionBarProps {
  selectedIds: string[];
  allLeads: Lead[];
  onClear: () => void;
}

export function BulkActionBar({ selectedIds, allLeads, onClear }: BulkActionBarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const bulkDelete = useBulkDelete();
  const bulkChangeStatus = useBulkChangeStatus();

  // Compute valid transitions for ALL selected leads
  const selectedLeads = allLeads.filter((l) => selectedIds.includes(l.id));
  const validForAll = (['CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as LeadStatus[]).filter(
    (status) => selectedLeads.every((l) => getValidTransitions(l.status).includes(status))
  );

  const handleDelete = async () => {
    await bulkDelete.mutateAsync(selectedIds);
    setConfirmDelete(false);
    onClear();
  };

  const handleStatusChange = async (status: LeadStatus) => {
    await bulkChangeStatus.mutateAsync({ ids: selectedIds, status });
    setShowStatusMenu(false);
    onClear();
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 rounded-2xl shadow-elevated border border-surface-700 text-white">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold">{selectedIds.length} selected</span>
          </div>

          <div className="w-px h-5 bg-surface-600" />

          {/* Bulk status change */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu((o) => !o)}
              disabled={validForAll.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Move to
              <ChevronDown className={clsx('w-3 h-3 transition-transform', showStatusMenu && 'rotate-180')} />
            </button>
            {showStatusMenu && validForAll.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-surface-200 rounded-xl shadow-modal py-1 min-w-[140px] animate-scale-in">
                {validForAll.map((status) => {
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={bulkChangeStatus.isPending}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors disabled:opacity-50"
                    >
                      <span className={clsx('w-2 h-2 rounded-full', cfg.dot)} />
                      {cfg.label}
                    </button>
                  );
                })}
                {validForAll.length === 0 && (
                  <p className="px-3 py-2 text-xs text-surface-400">No valid transitions</p>
                )}
              </div>
            )}
          </div>

          {/* Bulk delete */}
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          <div className="w-px h-5 bg-surface-600" />

          <button onClick={onClear} className="text-surface-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Leads"
        message={`Are you sure you want to delete ${selectedIds.length} lead${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length}`}
        isDestructive
        isLoading={bulkDelete.isPending}
      />
    </>
  );
}