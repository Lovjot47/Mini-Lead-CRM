import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useLeads } from '../hooks/useleads';
import { useFilteredLeads } from '../hooks/useFilteredLeads';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { LeadsTable } from '../components/leads/LeadTable';
import { LeadFilters } from '../components/leads/Leadfilters';
import { CreateLeadModal } from '../components/leads/Leadformmodal';
import { TableSkeleton } from '@/components/ui/Skeleton';

export function LeadsPage() {
  const { data: leads = [], isLoading, isError, refetch } = useLeads();
  const filtered = useFilteredLeads(leads);
  const [createOpen, setCreateOpen] = useState(false);

  useUrlFilters();

  return (
    <div className="h-screen flex flex-col">
      {/* Page header */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-surface-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-surface-900">Leads</h1>
            <p className="text-sm text-surface-500 mt-0.5">Manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-xl hover:bg-brand-600 transition-colors shadow-soft"
            >
              <Plus className="w-4 h-4" />
              New Lead
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-8 py-4 border-b border-surface-100 bg-white">
        <LeadFilters totalCount={leads.length} filteredCount={filtered.length} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-surface-900">Failed to load leads</p>
              <p className="text-xs text-surface-500 mt-1">Make sure the API server is running on port 3001</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <LeadsTable leads={filtered} allLeads={leads} />
        )}
      </div>

      <CreateLeadModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}