import { differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

export type OPTType = 'OPT' | 'STEM OPT';

export type EmploymentPeriod = {
  id: string;
  employer: string;
  start_date: string;
  end_date: string | null;
};

export type OPTTrackerData = {
  setup: { opt_type: OPTType; start_date: string; end_date: string };
  periods: EmploymentPeriod[];
};

export type OPTStats = {
  elapsed: number;
  employed: number;
  unemployed: number;
  cap: number;
  notStarted: boolean;
  isExpired: boolean;
};

export const CAP: Record<OPTType, number> = { OPT: 90, 'STEM OPT': 150 };

function noon(d: Date): Date {
  const c = new Date(d);
  c.setHours(12, 0, 0, 0);
  return c;
}

export function pd(s: string) { return noon(parseISO(s)); }
export function todayNoon()   { return noon(new Date()); }
export function span(a: Date, b: Date) { return Math.max(0, differenceInDays(b, a)); }

export function calcStats(data: OPTTrackerData, now = todayNoon()): OPTStats {
  const optStart = pd(data.setup.start_date);
  const optEnd   = pd(data.setup.end_date);
  const winEnd   = isBefore(now, optEnd) ? now : optEnd;
  const cap      = CAP[data.setup.opt_type];
  const isExpired  = isBefore(optEnd, now);
  const notStarted = !isAfter(now, optStart);

  if (notStarted) return { elapsed: 0, employed: 0, unemployed: 0, cap, notStarted: true, isExpired };

  const elapsed = span(optStart, winEnd);

  const intervals = data.periods
    .map(p => {
      const s = pd(p.start_date);
      const e = p.end_date ? pd(p.end_date) : now;
      return {
        s: isAfter(s, optStart) ? s : optStart,
        e: isBefore(e, winEnd)  ? e : winEnd,
      };
    })
    .filter(iv => isAfter(iv.e, iv.s))
    .sort((a, b) => a.s.getTime() - b.s.getTime());

  // merge overlapping intervals
  let employed = 0;
  let cur: { s: Date; e: Date } | null = null;
  for (const iv of intervals) {
    if (!cur) { cur = { ...iv }; continue; }
    if (!isAfter(iv.s, cur.e)) { if (isAfter(iv.e, cur.e)) cur.e = iv.e; }
    else { employed += span(cur.s, cur.e); cur = { ...iv }; }
  }
  if (cur) employed += span(cur.s, cur.e);

  const unemployed = Math.max(0, elapsed - employed);
  return { elapsed, employed, unemployed, cap, notStarted: false, isExpired };
}
