import { describe, it, expect } from 'vitest';
import { calcStats } from '@/lib/opt-tracker';
import type { OPTTrackerData } from '@/lib/opt-tracker';

function makeData(
  opt_type: 'OPT' | 'STEM OPT',
  start_date: string,
  end_date: string,
  periods: OPTTrackerData['periods'] = []
): OPTTrackerData {
  return { setup: { opt_type, start_date, end_date }, periods };
}

function date(s: string) { return new Date(`${s}T12:00:00`); }

describe('calcStats', () => {
  it('returns notStarted when today is before OPT start', () => {
    const data = makeData('OPT', '2030-01-01', '2031-01-01');
    const stats = calcStats(data, date('2029-12-31'));
    expect(stats.notStarted).toBe(true);
    expect(stats.unemployed).toBe(0);
    expect(stats.employed).toBe(0);
  });

  it('counts all elapsed days as unemployed when no periods logged', () => {
    const data = makeData('OPT', '2025-01-01', '2026-01-01');
    const stats = calcStats(data, date('2025-01-31'));
    expect(stats.elapsed).toBe(30);
    expect(stats.unemployed).toBe(30);
    expect(stats.employed).toBe(0);
  });

  it('subtracts employment period from unemployed days', () => {
    const data = makeData('OPT', '2025-01-01', '2026-01-01', [
      { id: '1', employer: 'Acme', start_date: '2025-01-01', end_date: '2025-01-11' },
    ]);
    const stats = calcStats(data, date('2025-01-31'));
    expect(stats.employed).toBe(10);
    expect(stats.unemployed).toBe(20);
  });

  it('handles current (open-ended) employment period', () => {
    const data = makeData('OPT', '2025-01-01', '2026-01-01', [
      { id: '1', employer: 'Acme', start_date: '2025-01-01', end_date: null },
    ]);
    const stats = calcStats(data, date('2025-01-31'));
    expect(stats.employed).toBe(30);
    expect(stats.unemployed).toBe(0);
  });

  it('merges overlapping employment periods', () => {
    const data = makeData('OPT', '2025-01-01', '2026-01-01', [
      { id: '1', employer: 'A', start_date: '2025-01-01', end_date: '2025-01-21' },
      { id: '2', employer: 'B', start_date: '2025-01-11', end_date: '2025-01-31' },
    ]);
    const stats = calcStats(data, date('2025-01-31'));
    expect(stats.employed).toBe(30);
    expect(stats.unemployed).toBe(0);
  });

  it('uses 90-day cap for OPT', () => {
    const stats = calcStats(makeData('OPT', '2025-01-01', '2026-01-01'), date('2025-01-31'));
    expect(stats.cap).toBe(90);
  });

  it('uses 150-day cap for STEM OPT', () => {
    const stats = calcStats(makeData('STEM OPT', '2025-01-01', '2027-01-01'), date('2025-01-31'));
    expect(stats.cap).toBe(150);
  });

  it('sets isExpired when today is past EAD end date', () => {
    const data = makeData('OPT', '2020-01-01', '2021-01-01');
    const stats = calcStats(data, date('2024-01-01'));
    expect(stats.isExpired).toBe(true);
  });

  it('does not count employment outside OPT window', () => {
    const data = makeData('OPT', '2025-06-01', '2026-06-01', [
      { id: '1', employer: 'Early', start_date: '2025-01-01', end_date: '2025-05-31' },
    ]);
    const stats = calcStats(data, date('2025-07-01'));
    expect(stats.employed).toBe(0);
    expect(stats.unemployed).toBe(30);
  });
});
