import { create } from 'zustand';
import type { LeadStatus } from '../type/lead';

interface FilterStore {
  search: string;
  statuses: LeadStatus[];
  source: string;
  setSearch: (search: string) => void;
  setStatuses: (statuses: LeadStatus[]) => void;
  toggleStatus: (status: LeadStatus) => void;
  setSource: (source: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: '',
  statuses: [],
  source: '',
  setSearch: (search) => set({ search }),
  setStatuses: (statuses) => set({ statuses }),
  toggleStatus: (status) =>
    set((state) => ({
      statuses: state.statuses.includes(status)
        ? state.statuses.filter((s) => s !== status)
        : [...state.statuses, status],
    })),
  setSource: (source) => set({ source }),
  reset: () => set({ search: '', statuses: [], source: '' }),
}));