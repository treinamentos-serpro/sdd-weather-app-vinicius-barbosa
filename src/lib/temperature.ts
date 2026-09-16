import type { Unit } from '../types/weather';

/** Converte um valor em Celsius para a unidade de exibição escolhida. */
export function toDisplayTemperature(valueC: number | undefined, unit: Unit): number | undefined {
  if (valueC === undefined) return undefined;
  return convertTemperature(valueC, unit);
}

export function convertTemperature(valueC: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (valueC * 9) / 5 + 32 : valueC;
}

export function unitLabel(unit: Unit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function formatTemperature(valueC: number | undefined, unit: Unit): string {
  const value = toDisplayTemperature(valueC, unit);
  return value === undefined ? '—' : `${Math.round(value)}${unitLabel(unit)}`;
}
