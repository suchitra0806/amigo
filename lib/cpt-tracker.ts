import { differenceInDays, parseISO } from 'date-fns';

export type CPTType = 'part-time' | 'full-time';

export type CPTAuthorization = {
  id: string;
  employer: string;
  cpt_type: CPTType;
  start_date: string;
  end_date: string | null;
};

export type CPTStats = {
  fullTimeMonths: number;
  isWarning: boolean;
  isDanger: boolean;
};

export const FULL_TIME_DANGER_MONTHS = 12;
export const FULL_TIME_WARNING_MONTHS = 10;

function daysToMonths(days: number): number {
  return days / 30.44;
}

export function calcCPTStats(authorizations: CPTAuthorization[], now = new Date()): CPTStats {
  const fullTimeDays = authorizations
    .filter((a) => a.cpt_type === 'full-time')
    .reduce((sum, a) => {
      const start = parseISO(a.start_date);
      const end = a.end_date ? parseISO(a.end_date) : now;
      return sum + Math.max(0, differenceInDays(end, start));
    }, 0);

  const fullTimeMonths = daysToMonths(fullTimeDays);

  return {
    fullTimeMonths,
    isWarning: fullTimeMonths >= FULL_TIME_WARNING_MONTHS,
    isDanger: fullTimeMonths >= FULL_TIME_DANGER_MONTHS,
  };
}
