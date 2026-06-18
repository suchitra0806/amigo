'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import type { VisaStatus } from '@/types/database';

const VISA_STATUSES: VisaStatus[] = ['F-1', 'OPT', 'STEM OPT', 'Other'];
const GRAD_YEARS = Array.from({ length: 11 }, (_, i) => 2025 + i);

type StoredProfile = {
  full_name: string;
  university: string;
  graduation_year: string;
  visa_status: VisaStatus;
};

const STORAGE_KEY = 'amigo_profile';

export default function ProfileForm() {
  const [fullName, setFullName]       = useState('');
  const [university, setUniversity]   = useState('');
  const [gradYear, setGradYear]       = useState('');
  const [visaStatus, setVisaStatus]   = useState<VisaStatus>('F-1');
  const [saved, setSaved]             = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p: StoredProfile = JSON.parse(raw);
    setFullName(p.full_name ?? '');
    setUniversity(p.university ?? '');
    setGradYear(p.graduation_year ?? '');
    setVisaStatus(p.visa_status ?? 'F-1');
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: StoredProfile = {
      full_name: fullName.trim(),
      university: university.trim(),
      graduation_year: gradYear,
      visa_status: visaStatus,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card border border-neutral-200 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Personal Info
        </h2>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500">
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

      <div className="card border border-neutral-200 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Academic Details
        </h2>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500">
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
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500">
              Expected Grad Year
            </label>
            <select
              className="input"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            >
              <option value="">Select year</option>
              {GRAD_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500">
              Visa Status
            </label>
            <select
              className="input"
              value={visaStatus}
              onChange={(e) => setVisaStatus(e.target.value as VisaStatus)}
            >
              {VISA_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
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
        <button type="submit" className="btn-primary">
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </div>
    </form>
  );
}
