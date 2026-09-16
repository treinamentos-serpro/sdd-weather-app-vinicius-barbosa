import { describe, expect, it } from 'vitest';

import { mapWeatherCode } from '../../src/lib/weatherCode';

describe('mapWeatherCode', () => {
  it('returns the label and icon for a known WMO code', () => {
    expect(mapWeatherCode(0)).toEqual({ label: 'Céu limpo', icon: '☀️' });
  });

  it('returns a fallback for an unknown code', () => {
    expect(mapWeatherCode(999)).toEqual({ label: 'Condição desconhecida', icon: '❓' });
    expect(mapWeatherCode(undefined)).toEqual({ label: 'Condição desconhecida', icon: '❓' });
  });
});
