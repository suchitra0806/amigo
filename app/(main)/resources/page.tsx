import type { Metadata } from 'next';
import { ExternalLink, BookOpen } from 'lucide-react';

export const metadata: Metadata = { title: 'Resources' };

const RESOURCES = [
  {
    category: 'Tax & Finance',
    links: [
      { label: 'IRS — Non-Resident Aliens', url: 'https://www.irs.gov/individuals/international-taxpayers/nonresident-aliens' },
      { label: 'IRS Form 1040-NR Instructions', url: 'https://www.irs.gov/forms-pubs/about-form-1040-nr' },
      { label: 'IRS Form 8843', url: 'https://www.irs.gov/forms-pubs/about-form-8843' },
      { label: 'FinCEN FBAR Filing', url: 'https://www.fincen.gov/report-foreign-bank-and-financial-accounts' },
      { label: 'Sprintax (Non-Resident Tax Software)', url: 'https://www.sprintax.com' },
    ],
  },
  {
    category: 'Immigration & Work Authorization',
    links: [
      { label: 'USCIS — F-1 Students', url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment' },
      { label: 'USCIS — OPT', url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students' },
      { label: 'USCIS — STEM OPT Extension', url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt' },
      { label: 'SEVP — Student Exchange Portal', url: 'https://studyinthestates.dhs.gov' },
      { label: 'E-Verify — Employer Enrollment', url: 'https://www.e-verify.gov' },
    ],
  },
  {
    category: 'Official Forms',
    links: [
      { label: 'I-765 (Employment Authorization)', url: 'https://www.uscis.gov/i-765' },
      { label: 'I-20 — Certificate of Eligibility', url: 'https://studyinthestates.dhs.gov/school-officials/i-20-basics' },
      { label: 'DS-2019 (J-1 Exchange Visitors)', url: 'https://j1visa.state.gov/participants/current/renew-extend/' },
    ],
  },
  {
    category: 'Financial & Banking',
    links: [
      { label: 'CFPB — Banking Basics', url: 'https://www.consumerfinance.gov/consumer-tools/bank-accounts/' },
      { label: 'Wise — International Money Transfers', url: 'https://wise.com/us' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Resources</h1>
        <p className="text-sm text-slate-500">
          Curated official links for F-1 students — taxes, work authorization, immigration
        </p>
      </div>

      {RESOURCES.map((section) => (
        <section key={section.category} className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-800">{section.category}</h2>
          </div>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <strong>Reminder:</strong> External links lead to official government and third-party websites. Always verify URLs. Amigo is not affiliated with any of these organizations.
      </p>
    </div>
  );
}
