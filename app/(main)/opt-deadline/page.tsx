'use client';

import { useState } from 'react';
import { addDays, subDays, format, differenceInDays, parseISO, isAfter, isBefore } from 'date-fns';
import { CalendarClock, AlertTriangle, CheckCircle2, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Milestone = {
  label: string;
  date: Date;
  description: string;
  urgent?: boolean;
};

function getMilestones(gradDate: Date): Milestone[] {
  return [
    {
      label: 'Earliest application date',
      date: subDays(gradDate, 90),
      description: 'USCIS allows you to file Form I-765 up to 90 days before your program end date.',
    },
    {
      label: 'Recommended "apply by" date',
      date: subDays(gradDate, 60),
      description: 'Apply at least 60 days before graduation to give USCIS time to process before you need to work.',
      urgent: true,
    },
    {
      label: 'Program end date (graduation)',
      date: gradDate,
      description: 'Your official graduation / program end date as listed on your I-20.',
    },
    {
      label: 'Latest application deadline',
      date: addDays(gradDate, 60),
      description: 'You must file no later than 60 days after your program end date. Missing this voids your OPT eligibility.',
      urgent: true,
    },
    {
      label: 'Earliest expected EAD receipt (est.)',
      date: addDays(gradDate, 90),
      description: 'USCIS processing typically takes 3–5 months. This is the optimistic end of that window.',
    },
    {
      label: 'Latest expected EAD receipt (est.)',
      date: addDays(gradDate, 150),
      description: 'Allow up to 5 months for processing. Apply early so your EAD arrives before you need to start work.',
    },
  ];
}

function statusFor(date: Date, today: Date): 'past' | 'today' | 'soon' | 'future' {
  const days = differenceInDays(date, today);
  if (days < 0) return 'past';
  if (days === 0) return 'today';
  if (days <= 30) return 'soon';
  return 'future';
}

export default function OPTDeadlinePage() {
  const [gradInput, setGradInput] = useState('');

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const gradDate = gradInput ? parseISO(gradInput) : null;
  if (gradDate) gradDate.setHours(12, 0, 0, 0);

  const milestones = gradDate ? getMilestones(gradDate) : [];

  const applyWindow = gradDate
    ? {
        start: subDays(gradDate, 90),
        end: addDays(gradDate, 60),
      }
    : null;

  const tooLate = applyWindow && isAfter(today, applyWindow.end);
  const inWindow = applyWindow && isAfter(today, applyWindow.start) && isBefore(today, applyWindow.end);
  const notYet = applyWindow && isBefore(today, applyWindow.start);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
          OPT <span className="neon-text">Deadline Calculator</span>
        </h1>
        <p className="text-xs text-neutral-400 font-semibold">
          Enter your graduation date to see your full OPT application timeline
        </p>
      </div>

      {/* Input */}
      <div className="card p-5 space-y-3">
        <label className="block text-xs font-black uppercase tracking-wider text-neutral-400">
          Program End Date (from your I-20)
        </label>
        <input
          type="date"
          value={gradInput}
          onChange={(e) => setGradInput(e.target.value)}
          className="input w-full"
        />
        <p className="text-xs text-neutral-400 font-medium">
          Use the end date printed on your I-20, not your ceremony date.
        </p>
      </div>

      {/* Status banner */}
      {gradDate && (
        <>
          {tooLate && (
            <div className="flex gap-3 rounded-2xl border-2 border-neutral-900 bg-neutral-900 p-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-white mt-0.5" />
              <div>
                <p className="text-sm font-black text-white">Application window has closed</p>
                <p className="mt-1 text-xs text-neutral-300 font-medium leading-relaxed">
                  The 60-day post-graduation deadline has passed. Contact your DSO immediately — late filing generally cannot be accepted.
                </p>
              </div>
            </div>
          )}
          {inWindow && (
            <div className="flex gap-3 rounded-2xl border-2 border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4">
              <Clock className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300 mt-0.5" />
              <div>
                <p className="text-sm font-black text-neutral-900 dark:text-neutral-100">Application window is open</p>
                <p className="mt-1 text-xs text-neutral-500 font-medium leading-relaxed">
                  You can apply now. File as soon as possible — earlier filing means earlier EAD receipt.
                </p>
              </div>
            </div>
          )}
          {notYet && (
            <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 p-4">
              <CalendarClock className="h-5 w-5 flex-shrink-0 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm font-black text-neutral-700 dark:text-neutral-300">
                  Window opens in {differenceInDays(applyWindow!.start, today)} day{differenceInDays(applyWindow!.start, today) !== 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-xs text-neutral-400 font-medium leading-relaxed">
                  Prepare your documents now so you can file on the earliest date.
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-neutral-400" />
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Your Timeline
              </h2>
            </div>

            <div className="relative space-y-3">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-neutral-200 dark:bg-neutral-700" />

              {milestones.map((m, i) => {
                const status = statusFor(m.date, today);
                const days = differenceInDays(m.date, today);
                const isPast = status === 'past';

                return (
                  <div key={i} className={cn('flex gap-4', isPast && 'opacity-50')}>
                    {/* Dot */}
                    <div className={cn(
                      'relative z-10 mt-3.5 flex h-[10px] w-[10px] flex-shrink-0 rounded-full border-2',
                      isPast ? 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900' :
                      m.urgent ? 'border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white' :
                      'border-neutral-400 bg-white dark:border-neutral-500 dark:bg-neutral-900'
                    )} />

                    {/* Card */}
                    <div className="flex-1 card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className={cn(
                              'text-sm font-black',
                              isPast ? 'text-neutral-400 dark:text-neutral-500' :
                              m.urgent ? 'text-neutral-900 dark:text-neutral-100' :
                              'text-neutral-700 dark:text-neutral-300'
                            )}>
                              {m.label}
                            </p>
                            {m.urgent && !isPast && (
                              <span className="badge bg-neutral-900 text-white border-transparent text-[10px] dark:bg-white dark:text-neutral-900">
                                Key date
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 font-semibold mb-1.5">
                            {format(m.date, 'MMMM d, yyyy')}
                          </p>
                          <p className="text-xs text-neutral-500 font-medium leading-relaxed dark:text-neutral-400">
                            {m.description}
                          </p>
                        </div>

                        {/* Days badge */}
                        <div className={cn(
                          'flex-shrink-0 rounded-xl border px-2.5 py-1.5 text-center min-w-[44px]',
                          isPast ? 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800' :
                          status === 'soon' ? 'border-neutral-800 bg-neutral-900 dark:border-white dark:bg-white' :
                          'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                        )}>
                          {isPast ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-neutral-300 dark:text-neutral-600" />
                          ) : (
                            <>
                              <p className={cn(
                                'text-lg font-black leading-none tabular-nums',
                                status === 'soon' ? 'text-white dark:text-neutral-900' : 'text-neutral-700 dark:text-neutral-300'
                              )}>
                                {days === 0 ? '!' : days}
                              </p>
                              <p className={cn(
                                'text-[10px] font-semibold mt-0.5',
                                status === 'soon' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'
                              )}>
                                {days === 0 ? 'today' : 'days'}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Checklist */}
          <section className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="h-4 w-4 text-neutral-400" />
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                Documents to Prepare
              </h2>
            </div>
            <ul className="space-y-2">
              {[
                'Valid passport (must be valid 6+ months beyond OPT start)',
                'Current I-20 with OPT recommendation from your DSO',
                'Form I-765 (Employment Authorization)',
                'Two passport-style photos',
                'Copy of all previous EAD cards (if any)',
                'Copy of F-1 visa and all previous I-20s',
                'Filing fee ($410 or current amount — verify on USCIS.gov)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium dark:text-neutral-400">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Disclaimer */}
      <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50 p-3.5">
        <ShieldCheck className="h-4 w-4 flex-shrink-0 text-neutral-400 mt-0.5" />
        <p className="text-xs text-neutral-500 font-medium leading-relaxed dark:text-neutral-400">
          <span className="font-black text-neutral-700 dark:text-neutral-300">Always verify with your DSO. </span>
          Dates are calculated from USCIS regulations but individual circumstances vary. Processing times are estimates only.
        </p>
      </div>
    </div>
  );
}
