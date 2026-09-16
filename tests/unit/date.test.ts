import { describe, expect, it } from 'vitest';

import { getDayLabel, getShortDate } from '../../src/lib/date';

describe('date format helpers', () => {
  it('labels the first two forecast indexes as today and tomorrow', () => {
    expect(getDayLabel('2026-09-16', 0)).toBe('Hoje');
    expect(getDayLabel('2026-09-17', 1)).toBe('Amanhã');
  });

  it('uses the weekday for later forecast indexes', () => {
    expect(getDayLabel('2026-09-18', 2)).toBe('sexta-feira');
  });

  it('formats an ISO date with a short month', () => {
    expect(getShortDate('2026-06-12')).toBe('12 Jun');
  });
});
