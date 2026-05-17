import { useState, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { Lead } from '../../type/lead';
import { LeadRow } from './Leadrow';
import { BulkActionBar } from './Bulkactionbar';

type SortKey = 'name' | 'status' | 'source' | 'updated_at';
type SortDir = 'asc' | 'desc';

interface LeadsTableProps {
  leads: Lead[];
  allLeads: Lead[];
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="w-3 h-3 text-surface-300" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-brand-500" />
    : <ChevronDown className="w-3 h-3 text-brand-500" />;
}

const ROW_HEIGHT = 56;

export function LeadsTable({ leads, allLeads }: LeadsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [leads, sortKey, sortDir]);

  const rowVirtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = useCallback(() => {
    if (selectedIds.size === sorted.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map((l) => l.id)));
    }
  }, [selectedIds.size, sorted]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allChecked = sorted.length > 0 && selectedIds.size === sorted.length;
  const someChecked = selectedIds.size > 0 && selectedIds.size < sorted.length;

  const HeaderCell = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer hover:text-surface-700 select-none"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </div>
    </th>
  );

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-surface-400">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-sm font-medium text-surface-600">No leads found</p>
        <p className="text-xs mt-1">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <>
      <div className="border border-surface-200 rounded-2xl overflow-hidden">
        {/* Fixed header */}
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="pl-4 pr-2 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-surface-300 cursor-pointer accent-brand-500"
                />
              </th>
              <HeaderCell label="Lead" col="name" />
              <HeaderCell label="Status" col="status" />
              <HeaderCell label="Source" col="source" />
              <HeaderCell label="Last Updated" col="updated_at" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Transition
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        {/* Virtualised body */}
        <div
          ref={parentRef}
          className="overflow-y-auto"
          style={{ maxHeight: '600px' }}
        >
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
            <table
              className="w-full"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
              }}
            >
              <tbody>
                {virtualItems.map((virtualRow) => {
                  const lead = sorted[virtualRow.index];
                  return (
                    <tr
                      key={lead.id}
                      style={{
                        position: 'absolute',
                        top: virtualRow.start,
                        left: 0,
                        width: '100%',
                        height: ROW_HEIGHT,
                        display: 'table',
                        tableLayout: 'fixed',
                      }}
                    >
                      {/* We render the full row using a wrapper approach */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Absolute positioned rows */}
            {virtualItems.map((virtualRow) => {
              const lead = sorted[virtualRow.index];
              return (
                <table
                  key={lead.id}
                  className="w-full"
                  style={{
                    position: 'absolute',
                    top: virtualRow.start,
                    left: 0,
                    width: '100%',
                    tableLayout: 'fixed',
                  }}
                >
                  <tbody>
                    <LeadRow
                      lead={lead}
                      isSelected={selectedIds.has(lead.id)}
                      onToggleSelect={() => toggleOne(lead.id)}
                    />
                  </tbody>
                </table>
              );
            })}
          </div>
        </div>
      </div>

      <BulkActionBar
        selectedIds={Array.from(selectedIds)}
        allLeads={allLeads}
        onClear={() => setSelectedIds(new Set())}
      />
    </>
  );
}