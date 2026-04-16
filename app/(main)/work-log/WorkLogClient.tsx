'use client';

import { useState } from 'react';
import { format, parseISO, startOfWeek, addWeeks } from 'date-fns';
import { Plus, Clock, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { WorkLog, WorkType } from '@/types/database';

const WORK_TYPES: WorkType[] = ['on-campus', 'CPT', 'OPT', 'STEM OPT'];
const ON_CAMPUS_LIMIT = 20;

interface WorkLogClientProps {
  initialLogs: WorkLog[];
  userId: string;
}

export default function WorkLogClient({ initialLogs, userId }: WorkLogClientProps) {
  const [logs, setLogs] = useState<WorkLog[]>(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const thisMonday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const [weekStart, setWeekStart] = useState(thisMonday);
  const [hours, setHours] = useState('');
  const [employer, setEmployer] = useState('');
  const [workType, setWorkType] = useState<WorkType>('on-campus');
  const [notes, setNotes] = useState('');

  const supabase = createClient();

  const currentWeekHours = logs
    .filter((l) => l.week_start === thisMonday && l.work_type === 'on-campus')
    .reduce((sum, l) => sum + Number(l.hours_worked), 0);

  const isOverLimit = currentWeekHours > ON_CAMPUS_LIMIT;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!hours || Number(hours) <= 0) return;

    setSaving(true);
    setError('');

    const { data, error: err } = await supabase
      .from('work_logs')
      .upsert(
        {
          user_id: userId,
          week_start: weekStart,
          hours_worked: Number(hours),
          employer: employer || null,
          work_type: workType,
          notes: notes || null,
        },
        { onConflict: 'user_id,week_start' }
      )
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.week_start !== weekStart);
        return [data, ...filtered].sort(
          (a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
        );
      });
      setShowForm(false);
      setHours('');
      setEmployer('');
      setNotes('');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const { error: err } = await supabase.from('work_logs').delete().eq('id', id);
    if (!err) setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Work Log</h1>
          <p className="text-sm text-slate-500">Track weekly hours for F-1 compliance</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Log Hours
        </button>
      </div>

      {/* Current week summary */}
      <div
        className={cn(
          'card flex items-center gap-4 p-4',
          isOverLimit ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            isOverLimit ? 'bg-red-100' : 'bg-emerald-100'
          )}
        >
          <Clock
            className={cn('h-6 w-6', isOverLimit ? 'text-red-600' : 'text-emerald-600')}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">This Week (on-campus)</p>
          <p
            className={cn(
              'text-2xl font-bold',
              isOverLimit ? 'text-red-700' : 'text-emerald-700'
            )}
          >
            {currentWeekHours.toFixed(1)} / {ON_CAMPUS_LIMIT} hrs
          </p>
        </div>
        {isOverLimit && (
          <div className="ml-auto flex items-start gap-1.5 rounded-lg bg-red-100 px-3 py-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <p className="text-xs font-medium text-red-700">
              Exceeds 20 hr on-campus limit during semester
            </p>
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Log Work Hours</h2>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Week Starting (Monday)</label>
              <input
                type="date"
                className="input"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Hours Worked</label>
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
              <label className="mb-1 block text-xs font-medium text-slate-700">Work Type</label>
              <select
                className="input"
                value={workType}
                onChange={(e) => setWorkType(e.target.value as WorkType)}
              >
                {WORK_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Employer (optional)</label>
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
            <label className="mb-1 block text-xs font-medium text-slate-700">Notes (optional)</label>
            <input type="text" className="input" placeholder="Any notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      )}

      {/* Log history */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="py-16 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No hours logged yet.</p>
          </div>
        ) : (
          logs.map((log) => {
            const isOnCampusExceeded =
              log.work_type === 'on-campus' && Number(log.hours_worked) > ON_CAMPUS_LIMIT;
            return (
              <div key={log.id} className="card flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Week of {format(parseISO(log.week_start), 'MMM d, yyyy')}
                    </span>
                    <span className="badge bg-slate-100 text-slate-600">{log.work_type}</span>
                    {isOnCampusExceeded && (
                      <span className="badge bg-red-100 text-red-700">Over limit</span>
                    )}
                  </div>
                  {log.employer && (
                    <p className="text-xs text-slate-500">{log.employer}</p>
                  )}
                  {log.notes && (
                    <p className="mt-0.5 text-xs text-slate-400 italic">{log.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-lg font-bold',
                      isOnCampusExceeded ? 'text-red-600' : 'text-slate-700'
                    )}
                  >
                    {Number(log.hours_worked).toFixed(1)} hrs
                  </span>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Delete log"
                  >
                    <Trash2 className="h-4 w-4" />
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
