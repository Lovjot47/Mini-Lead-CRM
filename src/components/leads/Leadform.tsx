import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import type { Lead, CreateLeadDTO } from '../../type/lead';

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: CreateLeadDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
  serverError?: string;
}

const SOURCES = ['website', 'referral', 'campaign', 'cold-outreach', 'event', 'partner', 'other'];

export function LeadForm({ defaultValues, onSubmit, onCancel, isLoading, serverError }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateLeadDTO>({
    mode: 'onChange',
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      source: defaultValues?.source ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Jane Doe"
            className={clsx(
              'w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none',
              'focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400',
              errors.name
                ? 'border-rose-300 bg-rose-50/50'
                : 'border-surface-200 bg-white hover:border-surface-300'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            type="email"
            placeholder="jane@company.com"
            className={clsx(
              'w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none',
              'focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400',
              errors.email
                ? 'border-rose-300 bg-rose-50/50'
                : 'border-surface-200 bg-white hover:border-surface-300'
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+1 555 0100"
            className="w-full px-3 py-2.5 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-surface-300 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            Source
          </label>
          <select
            {...register('source')}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-surface-300 transition-colors"
          >
            <option value="">Select source</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-surface-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-surface-600 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : defaultValues?.id ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}