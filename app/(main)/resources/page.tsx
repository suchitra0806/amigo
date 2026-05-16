import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = { title: 'Resources' };

const RESOURCES = [
  {
    category: 'Tax & Finance',
    cardClass: 'border-neutral-200 bg-white',
    headingClass: 'text-neutral-900',
    dotClass: 'bg-neutral-900',
    links: [
      { label: 'IRS — Non-Resident Aliens',           url: 'https://www.irs.gov/individuals/international-taxpayers/nonresident-aliens' },
      { label: 'IRS Form 1040-NR Instructions',        url: 'https://www.irs.gov/forms-pubs/about-form-1040-nr' },
      { label: 'IRS Form 8843',                        url: 'https://www.irs.gov/forms-pubs/about-form-8843' },
      { label: 'FinCEN FBAR Filing',                   url: 'https://www.fincen.gov/report-foreign-bank-and-financial-accounts' },
      { label: 'Sprintax (Non-Resident Tax Software)', url: 'https://www.sprintax.com' },
    ],
  },
  {
    category: 'Immigration & Work Auth',
    cardClass: 'border-neutral-900 bg-neutral-900',
    headingClass: 'text-white',
    dotClass: 'bg-white',
    links: [
      { label: 'USCIS — F-1 Students',          url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment' },
      { label: 'USCIS — OPT',                   url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students' },
      { label: 'USCIS — STEM OPT Extension',    url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt' },
      { label: 'Study in the States (SEVP)',     url: 'https://studyinthestates.dhs.gov' },
      { label: 'E-Verify — Employer Enrollment', url: 'https://www.e-verify.gov' },
    ],
  },
  {
    category: 'Official Forms',
    cardClass: 'border-neutral-200 bg-neutral-50',
    headingClass: 'text-neutral-700',
    dotClass: 'bg-neutral-500',
    links: [
      { label: 'I-765 (Employment Authorization)',   url: 'https://www.uscis.gov/i-765' },
      { label: 'I-20 — Certificate of Eligibility', url: 'https://studyinthestates.dhs.gov/school-officials/i-20-basics' },
    ],
  },
  {
    category: 'Banking & Transfers',
    cardClass: 'border-neutral-200 bg-white',
    headingClass: 'text-neutral-600',
    dotClass: 'bg-neutral-400',
    links: [
      { label: 'CFPB — Banking Basics',          url: 'https://www.consumerfinance.gov/consumer-tools/bank-accounts/' },
      { label: 'Wise — International Transfers', url: 'https://wise.com/us' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-black text-neutral-900">
          <span className="neon-text">Resources</span>
        </h1>
        <p className="text-xs text-neutral-400 font-semibold">
          Curated official links — taxes, immigration, work auth
        </p>
      </div>

      <div className="space-y-4">
        {RESOURCES.map((section) => (
          <section
            key={section.category}
            className={`rounded-2xl border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${section.cardClass}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${section.dotClass}`} />
              <h2 className={`text-xs font-black uppercase tracking-wider ${section.headingClass}`}>
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
                    className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all group ${
                      section.cardClass.includes('neutral-900')
                        ? 'text-neutral-300 hover:bg-white/10 hover:text-white'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-400 font-medium">
        External links lead to official government and third-party websites. Amigo is not affiliated with any of these organizations.
      </p>
    </div>
  );
}
