import type { Metadata } from 'next';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, CalendarDays, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { getAllDeadlinesSorted } from '@/lib/constants/deadlines';
import { daysUntil, urgencyBg, urgencyColor, cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Tax Hub' };

const DEADLINES = getAllDeadlinesSorted();

const CATEGORY_LABEL: Record<string, string> = {
  federal: 'Federal IRS',
  state: 'State',
  immigration: 'Immigration (USCIS)',
  employment: 'Employment',
};

const CATEGORY_COLOR: Record<string, string> = {
  federal:    'bg-blue-100 text-blue-700',
  state:      'bg-teal-100 text-teal-700',
  immigration:'bg-purple-100 text-purple-700',
  employment: 'bg-orange-100 text-orange-700',
};

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Tax Hub</h1>
        <p className="text-sm text-slate-500">
          Key filing dates and compliance reminders for F-1 international students
        </p>
      </div>

      {/* ⚠️ Not Financial Advice — prominent, always visible */}
      <div className="flex gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-bold text-amber-800">Not Financial or Tax Advice</p>
          <p className="mt-0.5 text-sm text-amber-700">
            The information on this page is for general educational purposes only and does not
            constitute tax, legal, or financial advice. Tax rules for non-resident aliens are
            complex and change frequently. <strong>Always consult a licensed CPA, Enrolled
            Agent, or your university&apos;s international student office</strong> before filing.
            Many universities provide free access to Sprintax or GLACIER Tax Prep — check with
            your DSO.
          </p>
        </div>
      </div>

      {/* Key facts for F-1 students */}
      <section className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">F-1 Tax Basics</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          {[
            'Most F-1 students in their first 5 calendar years are considered non-resident aliens for tax purposes — file Form 1040-NR, not 1040.',
            'F-1 students are generally exempt from FICA (Social Security & Medicare) taxes while on F-1 status (not OPT).',
            'Tax treaties may reduce or eliminate U.S. tax on certain income — check if your home country has a treaty with the U.S.',
            'Even if you had $0 income, you may still be required to file Form 8843 to comply with IRS regulations.',
            'OPT and STEM OPT holders are subject to FICA taxes — confirm your employer is withholding correctly.',
          ].map((fact, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* Deadline list */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-800">2026 Deadlines</h2>
        </div>

        <div className="space-y-3">
          {DEADLINES.map((deadline) => {
            const days = daysUntil(deadline.date);
            const isPast = days < 0;

            return (
              <div
                key={deadline.id}
                className={cn(
                  'card p-4 transition-opacity',
                  isPast && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="mt-0.5">
                    {isPast ? (
                      <CheckCircle2 className="h-5 w-5 text-slate-300" />
                    ) : (
                      <Circle className={cn('h-5 w-5', urgencyColor(days))} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {deadline.title}
                      </h3>
                      <span
                        className={cn(
                          'badge',
                          CATEGORY_COLOR[deadline.category]
                        )}
                      >
                        {CATEGORY_LABEL[deadline.category]}
                      </span>
                    </div>

                    {/* Date + countdown */}
                    <div className="mt-0.5 flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {format(parseISO(deadline.date), 'MMMM d, yyyy')}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          urgencyColor(days)
                        )}
                      >
                        {isPast
                          ? 'Passed'
                          : days === 0
                          ? 'Today!'
                          : `${days} day${days !== 1 ? 's' : ''} away`}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-1.5 text-sm text-slate-600">{deadline.description}</p>

                    {/* Tip */}
                    {deadline.tip && (
                      <p className="mt-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700">
                        <span className="font-semibold">Tip: </span>
                        {deadline.tip}
                      </p>
                    )}

                    {/* Docs link */}
                    {deadline.docsUrl && (
                      <a
                        href={deadline.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        IRS Documentation
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Countdown badge (right) */}
                  {!isPast && (
                    <div
                      className={cn(
                        'flex-shrink-0 rounded-lg border px-2.5 py-1 text-center',
                        urgencyBg(days)
                      )}
                    >
                      <p className={cn('text-lg font-bold leading-none', urgencyColor(days))}>
                        {days === 0 ? '!' : days}
                      </p>
                      <p className="text-[10px] text-slate-500">{days === 0 ? 'today' : 'days'}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Free tools */}
      <section className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Free Tools for F-1 Students</h2>
        <div className="space-y-2">
          {[
            { name: 'Sprintax', desc: 'Non-resident tax preparation software — many universities provide free access', url: 'https://www.sprintax.com' },
            { name: 'GLACIER Tax Prep', desc: 'Tax compliance software for international students and scholars', url: 'https://www.glaciertax.com' },
            { name: 'IRS VITA', desc: 'Free tax preparation for eligible taxpayers including students', url: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers' },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 rounded-lg p-2.5 text-sm hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
              <div>
                <span className="font-medium text-slate-900">{tool.name}</span>
                <span className="ml-1.5 text-slate-500">{tool.desc}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
