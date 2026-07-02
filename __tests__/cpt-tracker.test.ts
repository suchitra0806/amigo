import { describe, it, expect } from 'vitest';
import { calcCPTStats, FULL_TIME_DANGER_MONTHS, FULL_TIME_WARNING_MONTHS } from '@/lib/cpt-tracker';
import type { CPTAuthorization } from '@/lib/cpt-tracker';

function auth(
  cpt_type: 'part-time' | 'full-time',
  start_date: string,
  end_date: string | null
): CPTAuthorization {
  return { id: crypto.randomUUID(), employer: 'Test Co', cpt_type, start_date, end_date };
}

const NOW = new Date('2025-06-01T12:00:00');

describe('calcCPTStats', () => {
  it('returns zero when no authorizations', () => {
    const stats = calcCPTStats([], NOW);
    expect(stats.fullTimeMonths).toBe(0);
    expect(stats.isWarning).toBe(false);
    expect(stats.isDanger).toBe(false);
  });

  it('does not count part-time CPT toward full-time total', () => {
    const stats = calcCPTStats([auth('part-time', '2024-01-01', '2025-01-01')], NOW);
    expect(stats.fullTimeMonths).toBe(0);
  });

  it('counts full-time CPT days', () => {
    // ~6 months of full-time
    const stats = calcCPTStats([auth('full-time', '2025-01-01', '2025-07-01')], NOW);
    expect(stats.fullTimeMonths).toBeGreaterThan(5.5);
    expect(stats.fullTimeMonths).toBeLessThan(6.5);
  });

  it('uses today for open-ended authorizations', () => {
    const stats = calcCPTStats([auth('full-time', '2024-06-01', null)], NOW);
    // exactly 365 days / 30.44 ≈ 12 months
    expect(stats.fullTimeMonths).toBeCloseTo(12, 0);
  });

  it('sums multiple full-time authorizations', () => {
    const auths = [
      auth('full-time', '2023-01-01', '2023-07-01'),
      auth('full-time', '2024-01-01', '2024-07-01'),
    ];
    const stats = calcCPTStats(auths, NOW);
    expect(stats.fullTimeMonths).toBeGreaterThan(11);
    expect(stats.fullTimeMonths).toBeLessThan(13);
  });

  it(`sets isWarning at ${FULL_TIME_WARNING_MONTHS}+ months`, () => {
    // 10.5 months of full-time
    const stats = calcCPTStats([auth('full-time', '2024-07-15', '2025-06-01')], NOW);
    expect(stats.isWarning).toBe(true);
    expect(stats.isDanger).toBe(false);
  });

  it(`sets isDanger at ${FULL_TIME_DANGER_MONTHS}+ months`, () => {
    // ~12.5 months
    const stats = calcCPTStats([auth('full-time', '2024-05-15', '2025-06-01')], NOW);
    expect(stats.isDanger).toBe(true);
  });

  it('mixes part-time and full-time correctly', () => {
    const auths = [
      auth('part-time', '2024-01-01', '2025-01-01'),
      auth('full-time', '2024-06-01', '2024-12-01'),
    ];
    const stats = calcCPTStats(auths, NOW);
    // only ~6 months of full-time counts
    expect(stats.fullTimeMonths).toBeGreaterThan(5.5);
    expect(stats.fullTimeMonths).toBeLessThan(6.5);
    expect(stats.isDanger).toBe(false);
  });
});
