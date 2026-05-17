import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '../store/filterstore';
import type { LeadStatus } from '../type/lead';

const ALL_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search, statuses, source, setSearch, setStatuses, setSource } = useFilterStore();

  // On mount, read URL into store
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const statusParam = searchParams.get('status');
    const sourceParam = searchParams.get('source') ?? '';

    setSearch(q);
    setSource(sourceParam);

    if (statusParam) {
      const parsed = statusParam
        .split(',')
        .filter((s) => ALL_STATUSES.includes(s as LeadStatus)) as LeadStatus[];
      setStatuses(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync store → URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (statuses.length > 0) params.status = statuses.join(',');
    if (source) params.source = source;
    setSearchParams(params, { replace: true });
  }, [search, statuses, source, setSearchParams]);
}