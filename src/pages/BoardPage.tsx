import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { useLeads, useChangeStatus } from '../hooks/useleads';
import { useFilteredLeads } from '@/hooks/useFilteredLeads';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { KanbanColumn } from '@/components/board/KanbanColumn';
import { KanbanCard } from '@/components/board/KanbanCard';
import { LeadFilters } from '../components/leads/Leadfilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { isValidTransition, isTerminal, type Lead, type LeadStatus } from '../type/lead';

const ALL_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export function BoardPage() {
  const { data: leads = [], isLoading, isError } = useLeads();
  const filtered = useFilteredLeads(leads);
  const changeStatus = useChangeStatus();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<LeadStatus | null>(null);
  const [invalidDrop, setInvalidDrop] = useState<LeadStatus | null>(null);

  useUrlFilters();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const byStatus = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      NEW: [], CONTACTED: [], QUALIFIED: [], CONVERTED: [], LOST: [],
    };
    for (const lead of filtered) {
      map[lead.status].push(lead);
    }
    return map;
  }, [filtered]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverId(null);
      return;
    }
    // over can be a column (status string) or a card id
    const overStatus = ALL_STATUSES.includes(over.id as LeadStatus)
      ? (over.id as LeadStatus)
      : leads.find((l) => l.id === over.id)?.status ?? null;
    setOverId(overStatus);
  }, [leads]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setInvalidDrop(null);

    if (!over) return;

    const lead = leads.find((l) => l.id === active.id);
    if (!lead) return;

    const targetStatus = ALL_STATUSES.includes(over.id as LeadStatus)
      ? (over.id as LeadStatus)
      : leads.find((l) => l.id === over.id)?.status;

    if (!targetStatus || targetStatus === lead.status) return;

    if (isTerminal(lead.status) || !isValidTransition(lead.status, targetStatus)) {
      setInvalidDrop(targetStatus);
      setTimeout(() => setInvalidDrop(null), 1500);
      return;
    }

    changeStatus.mutate({ id: lead.id, status: targetStatus });
  }, [leads, changeStatus]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-surface-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-surface-900">Board</h1>
            <p className="text-sm text-surface-500 mt-0.5">Drag cards to move through the pipeline</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-8 py-4 border-b border-surface-100 bg-white">
        <LeadFilters totalCount={leads.length} filteredCount={filtered.length} />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="flex gap-4">
            {ALL_STATUSES.map((s) => (
              <div key={s} className="w-60 space-y-2">
                <Skeleton className="h-10 rounded-xl" />
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-surface-500">Failed to load leads. Make sure API is running on port 3001.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full pb-4">
              {ALL_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  leads={byStatus[status]}
                  isOver={overId === status && activeId !== null}
                  isInvalidDrop={invalidDrop === status}
                />
              ))}
            </div>

            <DragOverlay>
              {activeLead && <KanbanCard lead={activeLead} isDragOverlay />}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}