import axios from 'axios';
import type { Lead, CreateLeadDTO, UpdateLeadDTO } from '../type/lead';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const { data } = await api.get<Lead[]>('/leads');
    return data;
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },

  create: async (dto: CreateLeadDTO): Promise<Lead> => {
    const now = new Date().toISOString();
    const { data } = await api.post<Lead>('/leads', {
      ...dto,
      status: dto.status ?? 'NEW',
      created_at: now,
      updated_at: now,
    });
    return data;
  },

  update: async (id: string, dto: UpdateLeadDTO): Promise<Lead> => {
    const { data } = await api.patch<Lead>(`/leads/${id}`, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  changeStatus: async (id: string, status: Lead['status']): Promise<Lead> => {
    const { data } = await api.patch<Lead>(`/leads/${id}`, {
      status,
      updated_at: new Date().toISOString(),
    });
    return data;
  },
};