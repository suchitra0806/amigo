'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, startOfWeek } from 'date-fns';
import {
  GraduationCap, ShieldCheck, Clock, CalendarDays,
  Receipt, ClipboardList, BookOpen, MessageCircle,
  StickyNote, ChevronRight, AlertCircle, Plus, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisaStatus } from '@/types/database';

type StoredProfile = {
  full_name: string;
  university: string;
  graduation_year: string;
  visa_status: VisaStatus;
};

type LocalLog = {
  id: string;
  week_start: string;
  hours_worked: number;
  work_type: string;
};

type Note = {
  id: string;
  text: string;
  created_at: string;
};

const QUICK_ACTIONS = [
  {
    href: '/taxes',
    icon: Receipt,
    label: 'Tax Hub',
    desc: 'Deadlines & filing guides',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
  },
  {
    href: '/work-log',
    icon: ClipboardList,
    label: 'Work Log',
    desc: 'Track your weekly hours',
    iconBg: 'bg-neutral-900',
    iconColor: 'text-white',
  },
  {
    href: '/resources',
    icon: BookOpen,
    label: 'Resources',
    desc: 'Visa, CPT & OPT guides',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
  },
];

export default function DashboardPage() {
  const [profile, setProfile]   = useState<StoredProfile | null>(null);
  const [workLogs, setWorkLogs] = useState<LocalLog[]>([]);
  const [notes, setNotes]       = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  useEffect(() => {
    const rawProfile = localStorage.getItem('amigo_profile');
    if (rawProfile) setProfile(JSON.parse(rawProfile));

    const rawLogs = localStorage.getItem('amigo_work_logs');
    if (rawLogs) setWorkLogs(JSON.parse(rawLogs));

    const rawNotes = localStorage.getItem('amigo_notes');
    if (rawNotes) setNotes(JSON.parse(rawNotes));
  }, []);

  function addNote() {
    const text = noteInput.trim();
    if (!text) return;
    const updated = [
      { id: crypto.randomUUID(), text, created_at: new Date().toISOString() },
      ...notes,
    ];
    setNotes(updated);
    localStorage.setItem('amigo_notes', JSON.stringify(updated));
    setNoteInput('');
    setShowNoteInput(false);
  }

  function deleteNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('amigo_notes', JSON.stringify(updated));
  }

  const thisMonday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const onCampusHours = workLogs
    .filter((l) => l.work_type === 'on-campus' && l.week_start === thisMonday)
    .reduce((sum, l) => sum + Number(l.hours_worked), 0);

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const isProfileComplete = !!(profile?.university && profile?.graduation_year);

  const hoursVariant: 'urgent' | 'default' =
    onCampusHours > 20 ? 'urgent' : 'default';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
          Hello, <span className="neon-text">{firstName}</span> :)
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500 font-semibold dark:text-neutral-400">
          {profile?.university ? `${profile.university} · ` : ''}
          {profile?.visa_status ?? 'F-1'} Student Portal
        </p>
      </div>

      {/* Profile completion banner */}
      {!isProfileComplete && (
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 transition-all hover:border-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Complete your profile</p>
            <p className="text-xs text-neutral-500 font-medium dark:text-neutral-400">
              Add your university and program details
            </p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" />
        </Link>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatusCard
          icon={ShieldCheck}
          label="Visa Status"
          value={profile?.visa_status ?? 'F-1'}
          variant="default"
        />
        <StatusCard
          icon={Clock}
          label="This Week"
          value={`${onCampusHours.toFixed(1)} / 20 hrs`}
          variant={hoursVariant === 'urgent' ? 'inverted' : 'default'}
          sub={onCampusHours > 20 ? 'Over limit!' : 'on-campus'}
        />
        <StatusCard
          icon={CalendarDays}
          label="Grad Year"
          value={profile?.graduation_year || '—'}
          variant="muted"
        />
      </div>

      {/* My Notes */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            My Notes
          </h2>
          <button
            onClick={() => setShowNoteInput(v => !v)}
            className="ml-auto flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {showNoteInput && (
          <div className="mb-2 flex gap-2">
            <input
              autoFocus
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addNote(); if (e.key === 'Escape') { setShowNoteInput(false); setNoteInput(''); } }}
              placeholder="e.g. Ask DSO about I-20 renewal…"
              className="input flex-1 text-sm"
            />
            <button onClick={addNote} className="btn-primary text-xs px-3">Save</button>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
            <StickyNote className="mx-auto mb-2 h-6 w-6 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">No notes yet</p>
            <p className="mt-1 text-xs text-neutral-400 font-medium dark:text-neutral-500">
              Jot down reminders, DSO questions, or anything you don't want to forget.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="card flex items-start gap-3 p-3.5">
                <p className="flex-1 text-sm font-medium text-neutral-700 leading-snug dark:text-neutral-300">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="flex-shrink-0 rounded-lg p-1 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600 transition-colors dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick access */}
      <section>
        <div className="mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Quick Access
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, iconBg, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="card group flex items-start gap-3 p-4 hover:border-neutral-300 hover:shadow-chibi transition-all hover:-translate-y-px"
            >
              <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl', iconBg)}>
                <Icon className={cn('h-4 w-4', iconColor)} />
              </div>
              <div>
                <p className="text-sm font-black text-neutral-800 group-hover:text-black transition-colors dark:text-neutral-200 dark:group-hover:text-white">
                  {label}
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-0.5 dark:text-neutral-400">{desc}</p>
              </div>
            </Link>
          ))}

          {/* AI assistant hint */}
          <div className="card flex items-start gap-3 p-4 opacity-40 cursor-default select-none border-dashed">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100">
              <MessageCircle className="h-4 w-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-600">AI Assistant</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Click the chat button ↘</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const VARIANT_MAP = {
  default: {
    card:   'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    icon:   'text-neutral-700 dark:text-neutral-300',
    sub:    'text-neutral-500 dark:text-neutral-400',
    value:  'text-neutral-900 dark:text-neutral-100',
    label:  'text-neutral-400 dark:text-neutral-500',
  },
  inverted: {
    card:   'border-neutral-900 bg-neutral-900',
    iconBg: 'bg-white/10',
    icon:   'text-white',
    sub:    'text-white/70',
    value:  'text-white',
    label:  'text-white/60',
  },
  muted: {
    card:   'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50',
    iconBg: 'bg-neutral-200 dark:bg-neutral-800',
    icon:   'text-neutral-400 dark:text-neutral-500',
    sub:    'text-neutral-400 dark:text-neutral-500',
    value:  'text-neutral-600 dark:text-neutral-400',
    label:  'text-neutral-400 dark:text-neutral-500',
  },
} as const;

function StatusCard({
  icon: Icon,
  label,
  value,
  variant = 'default',
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  variant?: keyof typeof VARIANT_MAP;
  sub?: string;
}) {
  const v = VARIANT_MAP[variant];
  return (
    <div className={cn('rounded-2xl border p-4', v.card)}>
      <div className={cn('mb-2 flex h-7 w-7 items-center justify-center rounded-xl', v.iconBg)}>
        <Icon className={cn('h-3.5 w-3.5', v.icon)} />
      </div>
      <p className={cn('text-[10px] font-black uppercase tracking-wider', v.label)}>{label}</p>
      <p className={cn('mt-0.5 truncate text-sm font-black', v.value)}>{value}</p>
      {sub && <p className={cn('mt-0.5 text-[10px] font-bold', v.sub)}>{sub}</p>}
    </div>
  );
}
