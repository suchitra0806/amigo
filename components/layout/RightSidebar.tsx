'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { CalendarClock, ExternalLink, Info } from 'lucide-react';
import { getUpcomingDeadlines } from '@/lib/constants/deadlines';
import { daysUntil, urgencyColor, urgencyBg, cn } from '@/lib/utils';

const DEADLINES = getUpcomingDeadlines(4);

const CATEGORY_LABELS: Record<string, string> = {
  federal: 'Federal',
  immigration: 'Immigration',
  employment: 'Employment',
  state: 'State',
};

export default function RightSidebar() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {/* Deadlines widget */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-800">Upcoming Deadlines</h2>
          <Link
            href="/taxes"
            className="ml-auto text-xs font-medium text-indigo-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {DEADLINES.length === 0 ? (
          <p className="text-xs text-slate-500">No upcoming deadlines found.</p>
        ) : (
          <div className="space-y-2.5">
            {DEADLINES.map((deadline) => {
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
            })}
          </div>
        )}
      </section>

      {/* F-1 Quick reference */}
      <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-indigo-800">F-1 Quick Rules</h2>
        </div>
        <ul className="space-y-1.5 text-xs text-indigo-700">
          <li>
            <span className="font-semibold">On-campus:</span> Max 20 hrs/week while school is in session
          </li>
          <li>
            <span className="font-semibold">CPT:</span> Authorized before you start — no work without I-20 endorsement
          </li>
          <li>
            <span className="font-semibold">OPT:</span> Apply 90 days before program end; 90-day unemployment cap
          </li>
          <li>
            <span className="font-semibold">STEM OPT:</span> Extends to 36 months; employer must be E-Verify enrolled
          </li>
        </ul>
      </section>

      {/* Disclaimer */}
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-800">
        <span className="font-semibold">Not Financial or Legal Advice.</span>{' '}
        This information is for general educational purposes only. Consult a licensed tax professional or immigration attorney for advice specific to your situation.
      </p>
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
  const bgClass = urgencyBg(days);
  const label =
    days < 0
      ? 'Passed'
      : days === 0
      ? 'Today!'
      : days === 1
      ? '1 day left'
      : `${days} days`;

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border px-3 py-2.5', bgClass)}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-500">
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
            className="opacity-60 hover:opacity-100"
            aria-label="IRS documentation"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
