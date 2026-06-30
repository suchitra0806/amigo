import { describe, it, expect } from 'vitest';
import { addDays, subDays, parseISO } from 'date-fns';

function getMilestones(gradDate: Date) {
  return {
    earliest: subDays(gradDate, 90),
    recommended: subDays(gradDate, 60),
    grad: gradDate,
    latest: addDays(gradDate, 60),
    ead_earliest: addDays(gradDate, 90),
    ead_latest: addDays(gradDate, 150),
  };
}

describe('OPT deadline calculator', () => {
  const grad = parseISO('2025-05-15');
  const m = getMilestones(grad);

  it('earliest application is 90 days before graduation', () => {
    expect(m.earliest).toEqual(subDays(grad, 90));
  });

  it('latest application deadline is 60 days after graduation', () => {
    expect(m.latest).toEqual(addDays(grad, 60));
  });

  it('recommended date is 60 days before graduation', () => {
    expect(m.recommended).toEqual(subDays(grad, 60));
  });

  it('EAD receipt window is 90–150 days after graduation', () => {
    expect(m.ead_earliest).toEqual(addDays(grad, 90));
    expect(m.ead_latest).toEqual(addDays(grad, 150));
  });

  it('earliest date is before graduation', () => {
    expect(m.earliest < grad).toBe(true);
  });

  it('latest deadline is after graduation', () => {
    expect(m.latest > grad).toBe(true);
  });
});
