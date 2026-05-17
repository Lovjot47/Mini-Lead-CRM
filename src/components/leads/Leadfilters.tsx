import { useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { STATUS_CONFIG, type LeadStatus } from '../../type/lead';
import { useFilterStore } from '../../store/filterstore';

const ALL_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

interface LeadFiltersProps {
  totalCount: number;
  filteredCount: number;
}

export function LeadFilters({ totalCount, filteredCount }: LeadFiltersProps) {
  const { search, statuses, source, setSearch, toggleStatus, setSource, reset } = useFilterStore();

  const hasFilters = search || statuses.length > 0 || source;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    [setSearch]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-surface-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-surface-300 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source filter */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-3 py-2 text-sm border border-surface-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-surface-300 transition-colors text-surface-600"
        >
          <option value="">All sources</option>
          {['website', 'referral', 'campaign', 'cold-outreach', 'event', 'partner', 'other'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        <div className="ml-auto text-sm text-surface-500">
          {filteredCount !== totalCount ? (
            <span>
              <strong className="text-surface-700">{filteredCount}</strong> of {totalCount} leads
            </span>
          ) : (
            <span><strong className="text-surface-700">{totalCount}</strong> leads</span>
          )}
        </div>
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-surface-500 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" />
          Status:
        </span>
        {ALL_STATUSES.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const active = statuses.includes(status);
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                active
                  ? clsx(cfg.bg, cfg.color, cfg.border, 'shadow-soft')
                  : 'bg-white text-surface-500 border-surface-200 hover:border-surface-300'
              )}
            >
              <span className={clsx('w-1.5 h-1.5 rounded-full', active ? cfg.dot : 'bg-surface-300')} />
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}