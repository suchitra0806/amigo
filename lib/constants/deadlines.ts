export type DeadlineCategory = 'federal' | 'immigration' | 'employment' | 'state';

export interface Deadline {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: DeadlineCategory;
  docsUrl?: string;
  tip?: string;
}

// Tax Year 2025 / Immigration deadlines relevant for F-1 students (2026 cycle)
export const DEADLINES: Deadline[] = [
  {
    id: 'w2-2026',
    title: 'W-2 Wage Statements Due',
    shortTitle: 'W-2 Available',
    description: 'Employers must issue W-2 forms. Check with your university/employer payroll portal.',
    date: '2026-01-31',
    category: 'employment',
    tip: 'On-campus jobs issue W-2s. CPT/OPT employers must also send one by this date.',
  },
  {
    id: '1042s-2026',
    title: 'Form 1042-S Available',
    shortTitle: '1042-S Issued',
    description: "Foreign Person's U.S. Source Income Subject to Withholding — issued by your university for scholarship/fellowship income or tax treaty benefits.",
    date: '2026-03-15',
    category: 'federal',
    tip: 'Check GLACIER or your university international office for this form.',
  },
  {
    id: '1040nr-2026',
    title: 'Federal Tax Return Deadline (Form 1040-NR)',
    shortTitle: '1040-NR Due',
    description: 'Non-resident alien income tax return. Most F-1 students in years 1–5 must file 1040-NR (not 1040).',
    date: '2026-04-15',
    category: 'federal',
    docsUrl: 'https://www.irs.gov/forms-pubs/about-form-1040-nr',
    tip: 'Use Sprintax or GLACIER Tax Prep — these are designed for non-residents and are often provided free by universities.',
  },
  {
    id: 'fbar-2026',
    title: 'FBAR Deadline (FinCEN 114)',
    shortTitle: 'FBAR Due',
    description: 'Required if you had foreign bank/financial accounts totaling more than $10,000 at any point during the year.',
    date: '2026-04-15',
    category: 'federal',
    docsUrl: 'https://www.fincen.gov/report-foreign-bank-and-financial-accounts',
    tip: 'File online at BSA E-Filing System — there is an automatic extension to October 15.',
  },
  {
    id: '1040nr-late-2026',
    title: 'Alternative Federal Deadline (no withholding)',
    shortTitle: '1040-NR (no withhold)',
    description: 'If you had no U.S. source income subject to withholding (e.g., only scholarship income), your 1040-NR is due June 15.',
    date: '2026-06-15',
    category: 'federal',
    tip: 'When in doubt, file by April 15 to be safe.',
  },
  {
    id: 'fbar-ext-2026',
    title: 'FBAR Automatic Extension Deadline',
    shortTitle: 'FBAR Extension',
    description: 'Automatic extension for FinCEN 114 — no form needed to request this extension.',
    date: '2026-10-15',
    category: 'federal',
  },
  {
    id: 'opt-fall-2026',
    title: 'Fall OPT Application Window Opens',
    shortTitle: 'Fall OPT Window',
    description: 'Apply for OPT up to 90 days before your program end date. For December graduates, this window typically opens in September.',
    date: '2026-09-01',
    category: 'immigration',
    tip: 'USCIS processing can take 3–5 months. Apply as early as possible.',
  },
  {
    id: 'stem-opt-reminder-2026',
    title: 'STEM OPT Extension Reminder',
    shortTitle: 'STEM OPT Renewal',
    description: 'Apply for STEM OPT extension at least 90 days before your current OPT expires. Work can continue during the 180-day cap-gap period.',
    date: '2026-07-15',
    category: 'immigration',
    tip: 'Your employer must be enrolled in E-Verify for STEM OPT extension approval.',
  },
];

export const UPCOMING_DEADLINES_COUNT = 4;

export function getUpcomingDeadlines(count = UPCOMING_DEADLINES_COUNT): Deadline[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return DEADLINES
    .filter((d) => new Date(d.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

export function getAllDeadlinesSorted(): Deadline[] {
  return [...DEADLINES].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
