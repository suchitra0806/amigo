'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Briefcase, Plus, Trash2, ShieldCheck, AlertTriangle, Pencil, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calcStats, CAP } from '@/lib/opt-tracker';
import type { OPTType, OPTTrackerData, EmploymentPeriod } from '@/lib/opt-tracker';

const STORAGE_KEY = 'amigo_opt_tracker';
const PROFILE_KEY = 'amigo_profile';

// --- persistence ---

function loadData(): OPTTrackerData | null {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function saveData(d: OPTTrackerData) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

// --- component ---

export default function OPTTrackerClient() {
  const [data, setData]           = useState<OPTTrackerData | null>(null);
  const [editSetup, setEditSetup] = useState(false);
  const [showForm, setShowForm]   = useState(false);

  // setup form state
  const [optType,    setOptType]    = useState<OPTType>('OPT');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');

  // add-period form state
  const [employer,   setEmployer]   = useState('');
  const [pStart,     setPStart]     = useState('');
  const [pEnd,       setPEnd]       = useState('');
  const [isCurrent,  setIsCurrent]  = useState(false);

  useEffect(() => {
    const saved = loadData();
    if (saved) { setData(saved); return; }
    // pre-populate OPT type from profile
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.visa_status === 'STEM OPT') setOptType('STEM OPT');
        else if (p.visa_status === 'OPT')  setOptType('OPT');
      }
    } catch { /* ignore */ }
  }, []);

  function openEditSetup() {
    if (!data) return;
    setOptType(data.setup.opt_type);
    setStartDate(data.setup.start_date);
    setEndDate(data.setup.end_date);
    setEditSetup(true);
  }

  function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const updated: OPTTrackerData = {
      setup:   { opt_type: optType, start_date: startDate, end_date: endDate },
      periods: data?.periods ?? [],
    };
    setData(updated);
    saveData(updated);
    setEditSetup(false);
  }

  function handleAddPeriod(e: React.FormEvent) {
    e.preventDefault();
    if (!employer.trim() || !pStart) return;
    if (!data) return;
    const period: EmploymentPeriod = {
      id:         crypto.randomUUID(),
      employer:   employer.trim(),
      start_date: pStart,
      end_date:   isCurrent ? null : (pEnd || null),
    };
    const updated = { ...data, periods: [period, ...data.periods] };
    setData(updated);
    saveData(updated);
    setShowForm(false);
    setEmployer(''); setPStart(''); setPEnd(''); setIsCurrent(false);
  }

  function handleDelete(id: string) {
    if (!data) return;
    const updated = { ...data, periods: data.periods.filter(p => p.id !== id) };
    setData(updated);
    saveData(updated);
  }

  // --- render setup form ---
  if (!data || editSetup) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-black text-neutral-900">
            OPT <span className="neon-text">Tracker</span>
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Track your unemployment days against the USCIS cap
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <div className="card border border-neutral-200 p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              {editSetup ? 'Edit Setup' : 'Set Up Your Tracker'}
            </h2>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500 font-bold">
                Authorization Type
              </label>
              <div className="flex gap-2">
                {(['OPT', 'STEM OPT'] as OPTType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOptType(t)}
                    className={cn(
                      'flex-1 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all',
                      optType === t
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400'
                    )}
                  >
                    {t}
                    <span className="block text-[10px] font-semibold opacity-60 mt-0.5">
                      {t === 'OPT' ? '90-day cap' : '150-day cap'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  EAD Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  EAD End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>

            <p className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs text-neutral-500 font-medium">
              Enter the dates printed on your EAD (Employment Authorization Document) card.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            {editSetup && (
              <button type="button" onClick={() => setEditSetup(false)} className="btn-secondary">
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editSetup ? 'Save Changes' : 'Start Tracking'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- main tracker view ---
  const stats = calcStats(data);
  const pct   = Math.min((stats.unemployed / stats.cap) * 100, 100);
  const remaining = Math.max(0, stats.cap - stats.unemployed);
  const isOver = stats.unemployed >= stats.cap;

  const barColor =
    isOver     ? 'bg-neutral-900' :
    pct > 75   ? 'bg-neutral-700' :
    pct > 50   ? 'bg-neutral-500' :
                 'bg-neutral-300';

  const countColor =
    isOver   ? 'text-white' :
    pct > 75 ? 'text-neutral-900' :
               'text-neutral-700';

  const cardClass =
    isOver ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-200 bg-white';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-black text-neutral-900">
            OPT <span className="neon-text">Tracker</span>
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {data.setup.opt_type} · {format(parseISO(data.setup.start_date), 'MMM d, yyyy')} – {format(parseISO(data.setup.end_date), 'MMM d, yyyy')}
          </p>
        </div>
        <button onClick={openEditSetup} className="btn-secondary flex items-center gap-1.5 text-xs">
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>

      {/* Status card */}
      <div className={cn('rounded-2xl border-2 p-5 transition-colors', cardClass)}>
        {stats.notStarted ? (
          <p className={cn('text-sm font-bold', isOver ? 'text-white' : 'text-neutral-500')}>
            Your OPT hasn&apos;t started yet.
          </p>
        ) : (
          <>
            <p className={cn('text-xs font-black uppercase tracking-wider mb-3', isOver ? 'text-neutral-400' : 'text-neutral-400')}>
              Unemployment Days Used
            </p>

            <div className="flex items-end gap-2 mb-4">
              <span className={cn('text-5xl font-black tabular-nums leading-none', countColor)}>
                {stats.unemployed}
              </span>
              <span className={cn('mb-1 text-lg font-bold', isOver ? 'text-neutral-400' : 'text-neutral-400')}>
                / {stats.cap}
              </span>
            </div>

            <div className="h-2.5 rounded-full bg-neutral-200/30 overflow-hidden mb-4">
              <div
                className={cn('h-full rounded-full transition-all', barColor)}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              {isOver ? (
                <span className="flex items-center gap-1.5 text-white">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Over the {stats.cap}-day cap — contact your DSO immediately
                </span>
              ) : (
                <>
                  <span className={cn('flex items-center gap-1.5', isOver ? 'text-neutral-300' : 'text-neutral-500')}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {remaining} day{remaining !== 1 ? 's' : ''} remaining
                  </span>
                  <span className={cn(isOver ? 'text-neutral-400' : 'text-neutral-400')}>
                    · {stats.employed} day{stats.employed !== 1 ? 's' : ''} employed · {stats.elapsed} elapsed
                  </span>
                </>
              )}
            </div>

            {stats.isExpired && (
              <p className="mt-3 text-xs text-neutral-400 font-medium">
                Your EAD expired — showing final totals.
              </p>
            )}
          </>
        )}
      </div>

      {/* Rule note */}
      <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3.5">
        <ShieldCheck className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
        <p className="text-xs text-neutral-500 font-medium leading-relaxed">
          <span className="font-black text-neutral-700">USCIS Rule: </span>
          {data.setup.opt_type === 'OPT'
            ? 'Post-completion OPT allows a maximum of 90 days of unemployment.'
            : 'STEM OPT allows a cumulative maximum of 150 days of unemployment across both OPT periods.'}
          {' '}Always verify with your DSO.
        </p>
      </div>

      {/* Employment periods */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-neutral-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
              Employment Periods
            </h2>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-secondary flex items-center gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Period
            </button>
          )}
        </div>

        {/* Add period form */}
        {showForm && (
          <form onSubmit={handleAddPeriod} className="card p-4 mb-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">New Employment Period</h3>
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Employer</label>
              <input
                type="text"
                required
                placeholder="Company name"
                value={employer}
                onChange={e => setEmployer(e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-neutral-400">Start Date</label>
                <input
                  type="date"
                  required
                  value={pStart}
                  onChange={e => setPStart(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-neutral-400">End Date</label>
                <input
                  type="date"
                  value={pEnd}
                  onChange={e => setPEnd(e.target.value)}
                  disabled={isCurrent}
                  className="input w-full disabled:opacity-40"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={e => { setIsCurrent(e.target.checked); if (e.target.checked) setPEnd(''); }}
                className="rounded"
              />
              <span className="text-xs font-semibold text-neutral-600">Currently employed here</span>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}

        {/* Periods list */}
        {data.periods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center">
            <Briefcase className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
            <p className="text-sm font-bold text-neutral-400">No employment periods logged</p>
            <p className="text-xs text-neutral-400 mt-1">Every day without a logged period counts as unemployment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.periods.map(p => {
              const s = parseISO(p.start_date);
              const e = p.end_date ? parseISO(p.end_date) : new Date();
              const days = Math.max(0, differenceInDays(e, s));
              const current = !p.end_date;

              return (
                <div key={p.id} className="card flex items-center gap-3 p-4">
                  <div className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl',
                    current ? 'bg-neutral-900' : 'bg-neutral-100'
                  )}>
                    <Briefcase className={cn('h-4 w-4', current ? 'text-white' : 'text-neutral-500')} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-neutral-900 truncate">{p.employer}</p>
                      {current && (
                        <span className="badge bg-neutral-900 text-white border-transparent text-[10px]">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">
                      {format(s, 'MMM d, yyyy')} – {current ? 'Present' : format(parseISO(p.end_date!), 'MMM d, yyyy')}
                      <span className="ml-2 text-neutral-300">·</span>
                      <span className="ml-2">{days} day{days !== 1 ? 's' : ''}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-shrink-0 rounded-xl p-1.5 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
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

      <p className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-400 font-medium">
        This tracker is stored locally on your device. Not a substitute for official USCIS records — always confirm with your DSO.
      </p>
    </div>
  );
}
