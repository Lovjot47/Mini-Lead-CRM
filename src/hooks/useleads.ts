import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { leadsApi } from '@/lib/api';
import type { Lead, CreateLeadDTO, UpdateLeadDTO } from '../type/lead';
import { useToastStore } from '../store/toaststore';

export const queryKeys = {
  leads: ['leads'] as const,
  lead: (id: string) => ['leads', id] as const,
};

export function useLeads() {
  return useQuery({
    queryKey: queryKeys.leads,
    queryFn: leadsApi.getAll,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.lead(id),
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLead(
  options?: UseMutationOptions<Lead, Error, CreateLeadDTO>
) {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: (lead) => {
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) => [lead, ...old]);
      addToast({ type: 'success', message: `Lead "${lead.name}" created successfully.` });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to create lead. Please try again.' });
    },
    ...options,
  });
}

export function useUpdateLead(
  options?: UseMutationOptions<Lead, Error, { id: string; dto: UpdateLeadDTO }>
) {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, dto }) => leadsApi.update(id, dto),
    onSuccess: (lead) => {
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) =>
        old.map((l) => (l.id === lead.id ? lead : l))
      );
      qc.setQueryData(queryKeys.lead(lead.id), lead);
      addToast({ type: 'success', message: `Lead "${lead.name}" updated.` });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update lead.' });
    },
    ...options,
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: leadsApi.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.leads });
      const previous = qc.getQueryData<Lead[]>(queryKeys.leads);
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) =>
        old.filter((l) => l.id !== id)
      );
      return { previous };
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Lead deleted.' });
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.leads, ctx.previous);
      }
      addToast({ type: 'error', message: 'Failed to delete lead. Changes reverted.' });
    },
  });
}

export function useChangeStatus() {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) =>
      leadsApi.changeStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: queryKeys.leads });
      const previous = qc.getQueryData<Lead[]>(queryKeys.leads);
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) =>
        old.map((l) => (l.id === id ? { ...l, status, updated_at: new Date().toISOString() } : l))
      );
      return { previous };
    },
    onSuccess: (lead) => {
      qc.setQueryData(queryKeys.lead(lead.id), lead);
      addToast({ type: 'success', message: `Status updated to ${lead.status}.` });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.leads, ctx.previous);
      }
      addToast({ type: 'error', message: 'Status update failed. Changes reverted.' });
    },
  });
}

export function useBulkDelete() {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => leadsApi.delete(id)));
      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;
      return { succeeded, failed, ids };
    },
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: queryKeys.leads });
      const previous = qc.getQueryData<Lead[]>(queryKeys.leads);
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) =>
        old.filter((l) => !ids.includes(l.id))
      );
      return { previous };
    },
    onSuccess: ({ succeeded, failed }) => {
      addToast({
        type: failed > 0 ? 'warning' : 'success',
        message: `${succeeded} deleted${failed > 0 ? `, ${failed} failed` : ''}.`,
      });
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.leads, ctx.previous);
      addToast({ type: 'error', message: 'Bulk delete failed.' });
    },
  });
}

export function useBulkChangeStatus() {
  const qc = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: Lead['status'] }) => {
      const results = await Promise.allSettled(
        ids.map((id) => leadsApi.changeStatus(id, status))
      );
      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;
      return { succeeded, failed, ids, status };
    },
    onMutate: async ({ ids, status }) => {
      await qc.cancelQueries({ queryKey: queryKeys.leads });
      const previous = qc.getQueryData<Lead[]>(queryKeys.leads);
      qc.setQueryData<Lead[]>(queryKeys.leads, (old = []) =>
        old.map((l) => ids.includes(l.id) ? { ...l, status, updated_at: new Date().toISOString() } : l)
      );
      return { previous };
    },
    onSuccess: ({ succeeded, failed }) => {
      addToast({
        type: failed > 0 ? 'warning' : 'success',
        message: `${succeeded} updated${failed > 0 ? `, ${failed} failed` : ''}.`,
      });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.leads, ctx.previous);
      addToast({ type: 'error', message: 'Bulk status update failed.' });
    },
  });
}