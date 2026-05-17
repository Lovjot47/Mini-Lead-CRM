export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LeadSource = 'website' | 'referral' | 'campaign' | string;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadDTO {
  name: string;
  email: string;
  phone?: string;
  status?: LeadStatus;
  source?: string;
}

export interface UpdateLeadDTO {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  source?: string;
  updated_at?: string;
}

export interface LeadFilters {
  search: string;
  statuses: LeadStatus[];
  source: string;
}

export const STATUS_ORDER: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'];

export const STATUS_CONFIG: Record<LeadStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  next: LeadStatus[];
  canChangeTo: LeadStatus[];
  terminal: boolean;
}> = {
  NEW: {
    label: 'New',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    next: ['CONTACTED'],
    canChangeTo: ['CONTACTED', 'LOST'],
    terminal: false,
  },
  CONTACTED: {
    label: 'Contacted',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    next: ['QUALIFIED'],
    canChangeTo: ['QUALIFIED', 'LOST'],
    terminal: false,
  },
  QUALIFIED: {
    label: 'Qualified',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    next: ['CONVERTED'],
    canChangeTo: ['CONVERTED', 'LOST'],
    terminal: false,
  },
  CONVERTED: {
    label: 'Converted',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    next: [],
    canChangeTo: [],
    terminal: true,
  },
  LOST: {
    label: 'Lost',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    next: [],
    canChangeTo: [],
    terminal: true,
  },
};

export function getValidTransitions(status: LeadStatus): LeadStatus[] {
  return STATUS_CONFIG[status].canChangeTo;
}

export function isValidTransition(from: LeadStatus, to: LeadStatus): boolean {
  return STATUS_CONFIG[from].canChangeTo.includes(to);
}

export function isTerminal(status: LeadStatus): boolean {
  return STATUS_CONFIG[status].terminal;
}