import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from './Leadform';
import { useCreateLead, useUpdateLead } from '../../hooks/useleads';
import type { Lead, CreateLeadDTO } from '../../type/lead';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ isOpen, onClose }: CreateModalProps) {
  const [serverError, setServerError] = useState('');
  const { mutate, isPending } = useCreateLead({
    onSuccess: () => onClose(),
    onError: (err) => setServerError(err.message || 'Failed to create lead.'),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Lead" size="md">
      <LeadForm
        onSubmit={(data: CreateLeadDTO) => {
          setServerError('');
          mutate(data);
        }}
        onCancel={onClose}
        isLoading={isPending}
        serverError={serverError}
      />
    </Modal>
  );
}

interface EditModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export function EditLeadModal({ lead, onClose }: EditModalProps) {
  const [serverError, setServerError] = useState('');
  const { mutate, isPending } = useUpdateLead({
    onSuccess: () => onClose(),
    onError: (err) => setServerError(err.message || 'Failed to update lead.'),
  });

  if (!lead) return null;

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Edit Lead" size="md">
      <LeadForm
        defaultValues={lead}
        onSubmit={(data: CreateLeadDTO) => {
          setServerError('');
          mutate({ id: lead.id, dto: data });
        }}
        onCancel={onClose}
        isLoading={isPending}
        serverError={serverError}
      />
    </Modal>
  );
}