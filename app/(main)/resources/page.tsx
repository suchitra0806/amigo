import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = { title: 'Resources' };

const RESOURCES = [
  {
    category: 'Tax & Finance',
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    dot: 'bg-amber-400',
    links: [
      { label: 'IRS — Non-Resident Aliens',          url: 'https://www.irs.gov/individuals/international-taxpayers/nonresident-aliens' },
      { label: 'IRS Form 1040-NR Instructions',       url: 'https://www.irs.gov/forms-pubs/about-form-1040-nr' },
      { label: 'IRS Form 8843',                       url: 'https://www.irs.gov/forms-pubs/about-form-8843' },
      { label: 'FinCEN FBAR Filing',                  url: 'https://www.fincen.gov/report-foreign-bank-and-financial-accounts' },
      { label: 'Sprintax (Non-Resident Tax Software)',url: 'https://www.sprintax.com' },
    ],
  },
  {
    category: 'Immigration & Work Auth',
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
    dot: 'bg-violet-400',
    links: [
      { label: 'USCIS — F-1 Students',         url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment' },
      { label: 'USCIS — OPT',                  url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students' },
      { label: 'USCIS — STEM OPT Extension',   url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt' },
      { label: 'Study in the States (SEVP)',    url: 'https://studyinthestates.dhs.gov' },
      { label: 'E-Verify — Employer Enrollment',url: 'https://www.e-verify.gov' },
    ],
  },
  {
    category: 'Official Forms',
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    dot: 'bg-cyan-400',
    links: [
      { label: 'I-765 (Employment Authorization)',url: 'https://www.uscis.gov/i-765' },
      { label: 'I-20 — Certificate of Eligibility', url: 'https://studyinthestates.dhs.gov/school-officials/i-20-basics' },
    ],
  },
  {
    category: 'Banking & Transfers',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    dot: 'bg-emerald-400',
    links: [
      { label: 'CFPB — Banking Basics',           url: 'https://www.consumerfinance.gov/consumer-tools/bank-accounts/' },
      { label: 'Wise — International Transfers',  url: 'https://wise.com/us' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-100">
          <span className="neon-text">Resources</span>
        </h1>
        <p className="text-xs text-slate-600">
          Curated official links — taxes, immigration, work auth
        </p>
      </div>

      <div className="space-y-4">
        {RESOURCES.map((section) => (
          <section key={section.category} className={`card border p-4 ${section.color.split(' ').slice(1).join(' ')}`}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${section.dot} shadow-sm`} />
              <h2 className={`text-xs font-semibold uppercase tracking-wider ${section.color.split(' ')[0]}`}>
                {section.category}
              </h2>
            </div>
            <ul className="space-y-0.5">
              {section.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all group"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3 text-xs text-amber-400/70">
        External links lead to official government and third-party websites. Amigo is not affiliated with any of these organizations.
      </p>
    </div>
  );
}
