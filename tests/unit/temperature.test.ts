import { describe, expect, it } from 'vitest';

import {
  convertTemperature,
  formatTemperature,
  toDisplayTemperature,
  unitLabel,
} from '../../src/lib/temperature';

describe('temperature helpers', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converts %d°C to %d°F', (valueC, expectedFahrenheit) => {
    expect(convertTemperature(valueC, 'fahrenheit')).toBe(expectedFahrenheit);
  });

  it('converts by the selected unit', () => {
    expect(convertTemperature(21, 'celsius')).toBe(21);
    expect(convertTemperature(21, 'fahrenheit')).toBe(69.8);
    expect(convertTemperature(20.5, 'fahrenheit')).toBe(68.9);
    expect(toDisplayTemperature(undefined, 'fahrenheit')).toBeUndefined();
  });

  it('rounds the value and appends the selected unit symbol', () => {
    expect(formatTemperature(21.4, 'celsius')).toBe('21°C');
    expect(formatTemperature(21.6, 'celsius')).toBe('22°C');
    expect(formatTemperature(21, 'fahrenheit')).toBe('70°F');
    expect(formatTemperature(undefined, 'celsius')).toBe('—');
  });

  it('returns the symbol for each unit', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
