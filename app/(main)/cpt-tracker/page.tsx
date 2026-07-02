'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Briefcase, Plus, Trash2, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calcCPTStats, FULL_TIME_DANGER_MONTHS, FULL_TIME_WARNING_MONTHS } from '@/lib/cpt-tracker';
import type { CPTAuthorization, CPTType } from '@/lib/cpt-tracker';

const STORAGE_KEY = 'amigo_cpt_tracker';

function loadAuthorizations(): CPTAuthorization[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAuthorizations(auths: CPTAuthorization[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auths));
}

export default function CPTTrackerPage() {
  const [auths, setAuths]       = useState<CPTAuthorization[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [employer,   setEmployer]   = useState('');
  const [cptType,    setCptType]    = useState<CPTType>('part-time');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');
  const [isCurrent,  setIsCurrent]  = useState(false);

  useEffect(() => { setAuths(loadAuthorizations()); }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!employer.trim() || !startDate) return;
    const auth: CPTAuthorization = {
      id:         crypto.randomUUID(),
      employer:   employer.trim(),
      cpt_type:   cptType,
      start_date: startDate,
      end_date:   isCurrent ? null : (endDate || null),
    };
    const updated = [auth, ...auths];
    setAuths(updated);
    saveAuthorizations(updated);
    setShowForm(false);
    setEmployer(''); setCptType('part-time'); setStartDate(''); setEndDate(''); setIsCurrent(false);
  }

  function handleDelete(id: string) {
    const updated = auths.filter((a) => a.id !== id);
    setAuths(updated);
    saveAuthorizations(updated);
  }

  const stats = calcCPTStats(auths);
  const pct   = Math.min((stats.fullTimeMonths / FULL_TIME_DANGER_MONTHS) * 100, 100);
  const remaining = Math.max(0, FULL_TIME_DANGER_MONTHS - stats.fullTimeMonths);

  const barColor = stats.isDanger  ? 'bg-neutral-900' :
                   stats.isWarning ? 'bg-neutral-600' :
                   'bg-neutral-300';

  const cardClass = stats.isDanger
    ? 'border-neutral-900 bg-neutral-900'
    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
          CPT <span className="neon-text">Tracker</span>
        </h1>
        <p className="text-xs text-neutral-500 font-medium dark:text-neutral-400">
          Track full-time CPT usage — 12+ months voids OPT eligibility
        </p>
      </div>

      {/* Status card */}
      <div className={cn('rounded-2xl border-2 p-5 transition-colors', cardClass)}>
        <p className={cn('text-xs font-black uppercase tracking-wider mb-3', stats.isDanger ? 'text-neutral-400' : 'text-neutral-400')}>
          Full-Time CPT Used
        </p>

        <div className="flex items-end gap-2 mb-4">
          <span className={cn(
            'text-5xl font-black tabular-nums leading-none',
            stats.isDanger ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'
          )}>
            {stats.fullTimeMonths.toFixed(1)}
          </span>
          <span className={cn('mb-1 text-lg font-bold', stats.isDanger ? 'text-neutral-400' : 'text-neutral-400')}>
            / {FULL_TIME_DANGER_MONTHS} mo
          </span>
        </div>

        <div className="h-2.5 rounded-full bg-neutral-200/40 overflow-hidden mb-4">
          <div
            className={cn('h-full rounded-full transition-all', barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          {stats.isDanger ? (
            <span className="flex items-center gap-1.5 text-white">
              <AlertTriangle className="h-3.5 w-3.5" />
              12+ months of full-time CPT — OPT eligibility may be voided. Contact your DSO immediately.
            </span>
          ) : stats.isWarning ? (
            <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              Approaching 12-month limit — {remaining.toFixed(1)} months remaining. Talk to your DSO.
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {remaining.toFixed(1)} months of full-time CPT remaining before OPT impact
            </span>
          )}
        </div>
      </div>

      {/* Rule note */}
      <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50 p-3.5">
        <ShieldCheck className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
        <p className="text-xs text-neutral-500 font-medium leading-relaxed dark:text-neutral-400">
          <span className="font-black text-neutral-700 dark:text-neutral-300">USCIS Rule: </span>
          12 or more months of full-time CPT voids eligibility for post-completion OPT.
          Part-time CPT (under 20 hrs/week) does not count toward this limit.
          Always verify with your DSO.
        </p>
      </div>

      {/* Authorizations */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-neutral-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              CPT Authorizations
            </h2>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-secondary flex items-center gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAdd} className="card p-4 mb-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">New Authorization</h3>

            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Employer</label>
              <input
                type="text"
                required
                placeholder="Company name"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-neutral-400">CPT Type</label>
              <div className="flex gap-2">
                {(['part-time', 'full-time'] as CPTType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCptType(t)}
                    className={cn(
                      'flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition-all',
                      cptType === t
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    )}
                  >
                    {t === 'part-time' ? 'Part-time' : 'Full-time'}
                    <span className="block text-[10px] font-semibold opacity-60 mt-0.5">
                      {t === 'part-time' ? '< 20 hrs/week' : '≥ 20 hrs/week'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-neutral-400">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-neutral-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrent}
                  className="input w-full disabled:opacity-40"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => { setIsCurrent(e.target.checked); if (e.target.checked) setEndDate(''); }}
                className="rounded"
              />
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Currently active</span>
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}

        {/* List */}
        {auths.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 p-6 text-center">
            <Briefcase className="mx-auto mb-2 h-6 w-6 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm font-bold text-neutral-400">No authorizations logged</p>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Add each CPT authorization from your I-20.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {auths.map((a) => {
              const start   = parseISO(a.start_date);
              const end     = a.end_date ? parseISO(a.end_date) : new Date();
              const days    = Math.max(0, differenceInDays(end, start));
              const months  = (days / 30.44).toFixed(1);
              const current = !a.end_date;
              const isFull  = a.cpt_type === 'full-time';

              return (
                <div key={a.id} className="card flex items-center gap-3 p-4">
                  <div className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl',
                    current ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-100 dark:bg-neutral-800'
                  )}>
                    <Briefcase className={cn('h-4 w-4', current ? 'text-white dark:text-neutral-900' : 'text-neutral-500 dark:text-neutral-400')} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-neutral-900 dark:text-neutral-100 truncate">{a.employer}</p>
                      <span className={cn(
                        'badge text-[10px]',
                        isFull
                          ? 'bg-neutral-900 text-white border-transparent dark:bg-white dark:text-neutral-900'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                      )}>
                        {isFull ? 'Full-time' : 'Part-time'}
                      </span>
                      {current && (
                        <span className="badge bg-neutral-200 text-neutral-600 border-neutral-300 text-[10px] dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      {format(start, 'MMM d, yyyy')} – {current ? 'Present' : format(parseISO(a.end_date!), 'MMM d, yyyy')}
                      <span className="ml-2 text-neutral-300 dark:text-neutral-600">·</span>
                      <span className="ml-2">{months} mo</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex-shrink-0 rounded-xl p-1.5 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600 transition-colors dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 text-xs text-neutral-400 font-medium">
        Stored locally on your device. Not a substitute for official DSO records.
      </p>
    </div>
  );
}
