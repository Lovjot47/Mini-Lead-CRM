import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Globe, Calendar, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useLead, useDeleteLead, useChangeStatus } from '../hooks/useleads';
import { StatusTransitionPills } from '../components/ui/Statustransitionmenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EditLeadModal } from '../components/leads/Leadformmodal';
import { Skeleton } from '@/components/ui/Skeleton';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError } = useLead(id!);
  const deleteMutation = useDeleteLead();
  const changeStatus = useChangeStatus();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-surface-600 font-medium">Lead not found</p>
        <button onClick={() => navigate('/leads')} className="text-brand-500 text-sm hover:underline">
          Back to leads
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-surface-200 bg-white">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to leads
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-bold">
              {lead.name.split(' ').slice(0, 2).map((n: any) => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">{lead.name}</h1>
              <p className="text-sm text-surface-500">{lead.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h2 className="text-sm font-semibold text-surface-700 mb-3">Status</h2>
            <StatusTransitionPills
              currentStatus={lead.status}
              onTransition={(status) => changeStatus.mutate({ id: lead.id, status })}
              isLoading={changeStatus.isPending}
            />
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h2 className="text-sm font-semibold text-surface-700 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-xs text-surface-500">Email</p>
                  <p className="text-sm font-medium text-surface-900">{lead.email}</p>
                </div>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-surface-500" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Phone</p>
                    <p className="text-sm font-medium text-surface-900">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.source && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-surface-500" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Source</p>
                    <p className="text-sm font-medium text-surface-900 capitalize">{lead.source}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h2 className="text-sm font-semibold text-surface-700 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-xs text-surface-500">Created</p>
                  <p className="text-sm font-medium text-surface-900">
                    {format(new Date(lead.created_at), 'PPP')}
                    <span className="text-surface-400 text-xs ml-2">
                      ({formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })})
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-xs text-surface-500">Last updated</p>
                  <p className="text-sm font-medium text-surface-900">
                    {format(new Date(lead.updated_at), 'PPP')}
                    <span className="text-surface-400 text-xs ml-2">
                      ({formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditLeadModal lead={editOpen ? lead : null} onClose={() => setEditOpen(false)} />

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteMutation.mutate(lead.id, {
            onSuccess: () => navigate('/leads'),
          });
        }}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}