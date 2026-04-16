'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { CalendarClock, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { getUpcomingDeadlines } from '@/lib/constants/deadlines';
import { daysUntil, urgencyColor, urgencyBg, cn } from '@/lib/utils';

const DEADLINES = getUpcomingDeadlines(4);

export default function RightSidebar() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">

      {/* Deadline countdown widget */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-violet-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Upcoming Deadlines
          </h2>
          <Link
            href="/taxes"
            className="ml-auto text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-2">
          {DEADLINES.length === 0 ? (
            <p className="text-xs text-slate-600">No upcoming deadlines.</p>
          ) : (
            DEADLINES.map((deadline) => {
              const days = daysUntil(deadline.date);
              return (
                <DeadlineChip
                  key={deadline.id}
                  title={deadline.shortTitle}
                  date={deadline.date}
                  days={days}
                  docsUrl={deadline.docsUrl}
                />
              );
            })
          )}
        </div>
      </section>

      {/* F-1 Quick Rules */}
      <section className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-violet-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            F-1 Quick Rules
          </h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-400">
          {[
            ['On-campus', 'Max 20 hrs/week during semester'],
            ['CPT',       'I-20 endorsement required before start'],
            ['OPT',       'Apply 90 days before program end'],
            ['STEM OPT',  'Employer must be E-Verify enrolled'],
          ].map(([term, desc]) => (
            <li key={term} className="flex items-start gap-2">
              <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-violet-500" />
              <span>
                <span className="font-semibold text-slate-300">{term}: </span>
                {desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
        <p className="text-[10px] leading-snug text-amber-400/80">
          <span className="font-semibold text-amber-400">Not Financial or Legal Advice.</span>{' '}
          For educational purposes only. Consult your DSO or a licensed professional for guidance specific to your situation.
        </p>
      </div>
    </div>
  );
}

function DeadlineChip({
  title,
  date,
  days,
  docsUrl,
}: {
  title: string;
  date: string;
  days: number;
  docsUrl?: string;
}) {
  const colorClass = urgencyColor(days);
  const bgClass    = urgencyBg(days);

  const label =
    days < 0 ? 'Passed' :
    days === 0 ? 'Today!' :
    days === 1 ? '1 day' :
    `${days}d`;

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors', bgClass)}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-200">{title}</p>
        <p className="text-[10px] text-slate-500">
          {format(parseISO(date), 'MMM d, yyyy')}
        </p>
      </div>
      <div className={cn('flex flex-shrink-0 items-center gap-1', colorClass)}>
        <span className="text-xs font-bold whitespace-nowrap">{label}</span>
        {docsUrl && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Official docs"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
