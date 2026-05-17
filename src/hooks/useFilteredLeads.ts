import { useMemo } from 'react';
import { useFilterStore } from '../store/filterstore';
import type { Lead } from '../type/lead';

export function useFilteredLeads(leads: Lead[] = []) {
  const { search, statuses, source } = useFilterStore();

  return useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((lead) => {
      if (q && !lead.name.toLowerCase().includes(q) && !lead.email.toLowerCase().includes(q)) {
        return false;
      }
      if (statuses.length > 0 && !statuses.includes(lead.status)) {
        return false;
      }
      if (source && lead.source !== source) {
        return false;
      }
      return true;
    });
  }, [leads, search, statuses, source]);
}