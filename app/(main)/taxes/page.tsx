import type { Metadata } from 'next';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, CalendarDays, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { getAllDeadlinesSorted } from '@/lib/constants/deadlines';
import { daysUntil, urgencyBg, urgencyColor, cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Tax Hub' };

const DEADLINES = getAllDeadlinesSorted();

const CATEGORY_STYLE: Record<string, string> = {
  federal:     'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  state:       'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  immigration: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  employment:  'bg-amber-400/10 text-amber-400 border-amber-400/20',
};

const CATEGORY_LABEL: Record<string, string> = {
  federal:     'Federal IRS',
  state:       'State',
  immigration: 'Immigration',
  employment:  'Employment',
};

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-100">
          Tax <span className="neon-text">Hub</span>
        </h1>
        <p className="text-xs text-slate-600">
          Filing dates & compliance for F-1 international students
        </p>
      </div>

      {/* ⚠️ Disclaimer — always visible */}
      <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-bold text-amber-400">Not Financial or Tax Advice</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-400/70">
            This page is for general educational purposes only and does not constitute tax, legal, or financial
            advice. Tax rules for non-resident aliens are complex. <strong className="text-amber-400">Always
            consult a licensed CPA, Enrolled Agent, or your university&apos;s international office</strong> before
            filing. Many universities provide free Sprintax or GLACIER Tax Prep access — check with your DSO.
          </p>
        </div>
      </div>

      {/* F-1 Tax Basics */}
      <section className="card p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">F-1 Tax Basics</h2>
        <ul className="space-y-2.5 text-sm">
          {[
            'F-1 students in their first 5 calendar years are non-resident aliens — file Form 1040-NR, not the standard 1040.',
            'F-1 students are exempt from FICA (Social Security & Medicare) while on F-1 status — but NOT during OPT.',
            'Even with $0 income, you may still need to file Form 8843 for IRS compliance.',
            'Tax treaties between the U.S. and your home country may reduce or eliminate tax on certain income.',
            'OPT and STEM OPT holders are subject to FICA — confirm your employer is withholding correctly.',
          ].map((fact, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-400">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500" />
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* Deadline list */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">2026 Deadlines</h2>
        </div>

        <div className="space-y-3">
          {DEADLINES.map((deadline) => {
            const days   = daysUntil(deadline.date);
            const isPast = days < 0;

            return (
              <div
                key={deadline.id}
                className={cn('card p-4 transition-opacity', isPast && 'opacity-40')}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isPast
                      ? <CheckCircle2 className="h-5 w-5 text-slate-700" />
                      : <Circle className={cn('h-5 w-5', urgencyColor(days))} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-100">{deadline.title}</h3>
                      <span className={cn('badge text-[10px]', CATEGORY_STYLE[deadline.category])}>
                        {CATEGORY_LABEL[deadline.category]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs text-slate-600">
                        {format(parseISO(deadline.date), 'MMMM d, yyyy')}
                      </span>
                      <span className={cn('text-xs font-semibold', urgencyColor(days))}>
                        {isPast ? 'Passed' : days === 0 ? 'Today!' : `${days} day${days !== 1 ? 's' : ''} away`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{deadline.description}</p>

                    {deadline.tip && (
                      <p className="mt-2 rounded-lg bg-violet-500/8 border border-violet-500/15 px-2.5 py-1.5 text-xs text-violet-400">
                        <span className="font-semibold">Tip: </span>{deadline.tip}
                      </p>
                    )}

                    {deadline.docsUrl && (
                      <a
                        href={deadline.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        IRS Documentation <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {!isPast && (
                    <div className={cn('flex-shrink-0 rounded-lg border px-2.5 py-1.5 text-center', urgencyBg(days))}>
                      <p className={cn('text-lg font-bold leading-none tabular-nums', urgencyColor(days))}>
                        {days === 0 ? '!' : days}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{days === 0 ? 'today' : 'days'}</p>
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
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Free Tools for F-1 Students</h2>
        <div className="space-y-1">
          {[
            { name: 'Sprintax',         desc: 'Non-resident tax prep — often free via your university',                   url: 'https://www.sprintax.com' },
            { name: 'GLACIER Tax Prep', desc: 'Tax compliance software for international students',                       url: 'https://www.glaciertax.com' },
            { name: 'IRS VITA',         desc: 'Free in-person tax prep for eligible taxpayers including students',         url: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers' },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 rounded-lg p-2.5 text-sm hover:bg-slate-800 transition-colors group"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              <div>
                <span className="font-medium text-slate-300 group-hover:text-slate-100 transition-colors">{tool.name}</span>
                <span className="ml-1.5 text-slate-600">{tool.desc}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
