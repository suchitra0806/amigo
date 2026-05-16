'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, VisaStatus } from '@/types/database';

const VISA_STATUSES: VisaStatus[] = ['F-1', 'OPT', 'STEM OPT', 'Other'];
const GRAD_YEARS = Array.from({ length: 11 }, (_, i) => 2025 + i);

export default function ProfileForm({
  profile,
  userId,
}: {
  profile: Profile | null;
  userId: string;
}) {
  const [fullName, setFullName]       = useState(profile?.full_name ?? '');
  const [university, setUniversity]   = useState(profile?.university ?? '');
  const [gradYear, setGradYear]       = useState(profile?.graduation_year ? String(profile.graduation_year) : '');
  const [visaStatus, setVisaStatus]   = useState<VisaStatus>(profile?.visa_status ?? 'F-1');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState('');

  const router   = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);

    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name:       fullName.trim(),
        university:      university.trim() || null,
        graduation_year: gradYear ? Number(gradYear) : null,
        visa_status:     visaStatus,
      })
      .eq('id', userId);

    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl border border-neutral-900/15 bg-neutral-900/5 px-3 py-2 text-sm font-semibold text-neutral-900">
          {error}
        </p>
      )}

      <div className="card border border-slate-800 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Personal Info
        </h2>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <input
            type="text"
            className="input"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      </div>

      <div className="card border border-slate-800 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Academic Details
        </h2>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
            University
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g. University of Texas at Austin"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
              Expected Grad Year
            </label>
            <select
              className="input"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            >
              <option value="">Select year</option>
              {GRAD_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
              Visa Status
            </label>
            <select
              className="input"
              value={visaStatus}
              onChange={(e) => setVisaStatus(e.target.value as VisaStatus)}
            >
              {VISA_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-neutral-700">
            <CheckCircle className="h-4 w-4" />
            Saved!
          </span>
        )}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Profile
        </button>
      </div>
    </form>
  );
}
