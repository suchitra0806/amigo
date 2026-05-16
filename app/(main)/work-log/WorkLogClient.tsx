'use client';

import { useState } from 'react';
import { format, parseISO, startOfWeek } from 'date-fns';
import { Plus, Clock, AlertTriangle, Trash2, Loader2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { WorkLog, WorkType } from '@/types/database';

const WORK_TYPES: WorkType[] = ['on-campus', 'CPT', 'OPT', 'STEM OPT'];
const ON_CAMPUS_LIMIT = 20;

const WORK_TYPE_STYLE: Record<WorkType, string> = {
  'on-campus': 'bg-black/5 text-neutral-900 border-black/10',
  'CPT':       'bg-neutral-100 text-neutral-600 border-neutral-200',
  'OPT':       'bg-neutral-900 text-white border-transparent',
  'STEM OPT':  'bg-neutral-200 text-neutral-700 border-neutral-300',
};

export default function WorkLogClient({ initialLogs, userId }: { initialLogs: WorkLog[]; userId: string }) {
  const [logs, setLogs]         = useState<WorkLog[]>(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const thisMonday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const [weekStart, setWeekStart] = useState(thisMonday);
  const [hours, setHours]         = useState('');
  const [employer, setEmployer]   = useState('');
  const [workType, setWorkType]   = useState<WorkType>('on-campus');
  const [notes, setNotes]         = useState('');

  const supabase = createClient();

  const currentWeekHours = logs
    .filter((l) => l.week_start === thisMonday && l.work_type === 'on-campus')
    .reduce((sum, l) => sum + Number(l.hours_worked), 0);

  const pct         = Math.min((currentWeekHours / ON_CAMPUS_LIMIT) * 100, 100);
  const isOverLimit = currentWeekHours > ON_CAMPUS_LIMIT;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!hours || Number(hours) <= 0) return;
    setSaving(true); setError('');

    const { data, error: err } = await supabase
      .from('work_logs')
      .upsert(
        {
          user_id: userId, week_start: weekStart, hours_worked: Number(hours),
          employer: employer || null, work_type: workType, notes: notes || null,
        },
        { onConflict: 'user_id,week_start' }
      )
      .select()
      .single();

    if (err) { setError(err.message); }
    else if (data) {
      setLogs((prev) =>
        [data, ...prev.filter((l) => l.week_start !== weekStart)].sort(
          (a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
        )
      );
      setShowForm(false); setHours(''); setEmployer(''); setNotes('');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('work_logs').delete().eq('id', id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-neutral-900">
            Work <span className="neon-text">Log</span>
          </h1>
          <p className="text-xs text-neutral-400 font-semibold">Track weekly hours for F-1 compliance</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary text-xs px-4 py-2">
          <Plus className="h-3.5 w-3.5" />
          Log Hours
        </button>
      </div>

      {/* This week summary card */}
      <div className={cn(
        'rounded-2xl border p-5',
        isOverLimit
          ? 'border-black/20 bg-black/5'
          : 'border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
      )}>
        <div className="flex items-center gap-4 mb-3">
          <div className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            isOverLimit ? 'bg-neutral-900' : 'bg-neutral-100'
          )}>
            <Clock className={cn('h-5 w-5', isOverLimit ? 'text-white' : 'text-neutral-600')} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-black uppercase tracking-wider">
              This Week · On-Campus
            </p>
            <p className={cn(
              'text-2xl font-black tabular-nums',
              isOverLimit ? 'text-neutral-900' : 'text-neutral-800'
            )}>
              {currentWeekHours.toFixed(1)}
              <span className="text-sm font-semibold text-neutral-400 ml-1">/ {ON_CAMPUS_LIMIT} hrs</span>
            </p>
          </div>
          {isOverLimit && (
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-white" />
              <p className="text-xs font-black text-white">Over 20hr limit</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isOverLimit ? 'bg-neutral-900' :
              pct > 75   ? 'bg-neutral-700' :
                           'bg-neutral-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Log Hours</h2>
          {error && (
            <p className="rounded-xl bg-neutral-900/5 border border-neutral-900/15 px-3 py-2 text-sm font-semibold text-neutral-900">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Week (Monday)</label>
              <input
                type="date"
                className="input"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Hours Worked</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 18.5"
                step="0.5"
                min="0"
                max="168"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Work Type</label>
              <select
                className="input"
                value={workType}
                onChange={(e) => setWorkType(e.target.value as WorkType)}
              >
                {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-neutral-400">Employer (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. University Library"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-400">Notes (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="Any notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      )}

      {/* Log history */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className="py-20 text-center">
            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <p className="text-sm font-bold text-neutral-500">No hours logged yet.</p>
            <p className="text-xs text-neutral-400 font-medium mt-1">Start tracking to stay compliant.</p>
          </div>
        ) : (
          logs.map((log) => {
            const over = log.work_type === 'on-campus' && Number(log.hours_worked) > ON_CAMPUS_LIMIT;
            return (
              <div
                key={log.id}
                className="card flex items-center gap-4 px-4 py-3 hover:border-neutral-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-neutral-800">
                      Week of {format(parseISO(log.week_start), 'MMM d, yyyy')}
                    </span>
                    <span className={cn('badge text-[10px]', WORK_TYPE_STYLE[log.work_type])}>
                      {log.work_type}
                    </span>
                    {over && (
                      <span className="badge text-[10px] bg-neutral-900 text-white border-transparent">
                        Over limit
                      </span>
                    )}
                  </div>
                  {log.employer && (
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">{log.employer}</p>
                  )}
                  {log.notes && (
                    <p className="text-xs text-neutral-400 italic font-medium mt-0.5">{log.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-lg font-black tabular-nums',
                    over ? 'text-neutral-900' : 'text-neutral-700'
                  )}>
                    {Number(log.hours_worked).toFixed(1)}
                    <span className="text-xs font-semibold text-neutral-400 ml-0.5">h</span>
                  </span>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="rounded-full p-1.5 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
