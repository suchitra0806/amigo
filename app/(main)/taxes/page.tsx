import type { Metadata } from 'next';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, CalendarDays, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { getAllDeadlinesSorted } from '@/lib/constants/deadlines';
import { daysUntil, urgencyBg, urgencyColor, cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Tax Hub' };

const DEADLINES = getAllDeadlinesSorted();

const CATEGORY_STYLE: Record<string, string> = {
  federal:     'bg-black/5 text-neutral-900 border-black/10',
  state:       'bg-neutral-200 text-neutral-600 border-neutral-300',
  immigration: 'bg-neutral-900 text-white border-transparent',
  employment:  'bg-neutral-100 text-neutral-600 border-neutral-200',
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
        <h1 className="text-lg font-black text-neutral-900">
          Tax <span className="neon-text">Hub</span>
        </h1>
        <p className="text-xs text-neutral-400 font-semibold">
          Filing dates & compliance for F-1 international students
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 rounded-2xl border-2 border-neutral-200 bg-neutral-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-neutral-500" />
        <div>
          <p className="text-sm font-black text-neutral-800">Not Financial or Tax Advice</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 font-medium">
            This page is for general educational purposes only and does not constitute tax, legal, or
            financial advice. Tax rules for non-resident aliens are complex.{' '}
            <strong className="text-neutral-700">Always consult a licensed CPA, Enrolled Agent, or
            your university&apos;s international office</strong> before filing. Many universities provide
            free Sprintax or GLACIER Tax Prep access — check with your DSO.
          </p>
        </div>
      </div>

      {/* F-1 Tax Basics */}
      <section className="card p-5">
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-neutral-400">
          F-1 Tax Basics
        </h2>
        <ul className="space-y-2.5 text-sm">
          {[
            'F-1 students in their first 5 calendar years are non-resident aliens — file Form 1040-NR, not the standard 1040.',
            'F-1 students are exempt from FICA (Social Security & Medicare) while on F-1 status — but NOT during OPT.',
            'Even with $0 income, you may still need to file Form 8843 for IRS compliance.',
            'Tax treaties between the U.S. and your home country may reduce or eliminate tax on certain income.',
            'OPT and STEM OPT holders are subject to FICA — confirm your employer is withholding correctly.',
          ].map((fact, i) => (
            <li key={i} className="flex items-start gap-2.5 text-neutral-600 font-medium">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* Deadline list */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-neutral-400" />
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            2026 Deadlines
          </h2>
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
                      ? <CheckCircle2 className="h-5 w-5 text-neutral-300" />
                      : <Circle className={cn('h-5 w-5', urgencyColor(days))} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-neutral-900">{deadline.title}</h3>
                      <span className={cn('badge text-[10px]', CATEGORY_STYLE[deadline.category])}>
                        {CATEGORY_LABEL[deadline.category]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs text-neutral-400 font-medium">
                        {format(parseISO(deadline.date), 'MMMM d, yyyy')}
                      </span>
                      <span className={cn('text-xs font-black', urgencyColor(days))}>
                        {isPast ? 'Passed' : days === 0 ? 'Today!' : `${days} day${days !== 1 ? 's' : ''} away`}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                      {deadline.description}
                    </p>

                    {deadline.tip && (
                      <p className="mt-2 rounded-xl bg-neutral-100 border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-700 font-medium">
                        <span className="font-black">Tip: </span>{deadline.tip}
                      </p>
                    )}

                    {deadline.docsUrl && (
                      <a
                        href={deadline.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-black text-neutral-900 hover:text-black underline transition-colors"
                      >
                        IRS Documentation <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {!isPast && (
                    <div className={cn('flex-shrink-0 rounded-xl border px-2.5 py-1.5 text-center', urgencyBg(days))}>
                      <p className={cn('text-lg font-black leading-none tabular-nums', urgencyColor(days))}>
                        {days === 0 ? '!' : days}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                        {days === 0 ? 'today' : 'days'}
                      </p>
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
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-neutral-400">
          Free Tools for F-1 Students
        </h2>
        <div className="space-y-1">
          {[
            { name: 'Sprintax',         desc: 'Non-resident tax prep — often free via your university',           url: 'https://www.sprintax.com' },
            { name: 'GLACIER Tax Prep', desc: 'Tax compliance software for international students',               url: 'https://www.glaciertax.com' },
            { name: 'IRS VITA',         desc: 'Free in-person tax prep for eligible taxpayers including students', url: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers' },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 rounded-xl p-2.5 text-sm hover:bg-neutral-100 transition-colors group"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
              <div>
                <span className="font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {tool.name}
                </span>
                <span className="ml-1.5 text-neutral-400 font-medium">{tool.desc}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
