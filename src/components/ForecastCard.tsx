import { formatWeatherDate } from '../lib/date';
import { toDisplayTemperature } from '../lib/temperature';
import { mapWeatherCode } from '../lib/weatherCode';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  timezone: string;
  unit: Unit;
}

function formatTemperature(valueC: number | null | undefined, unit: Unit): string {
  if (typeof valueC !== 'number' || !Number.isFinite(valueC)) return '—';
  const value = toDisplayTemperature(valueC, unit);
  if (value === undefined || !Number.isFinite(value)) return '—';
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export default function ForecastCard({ day, timezone, unit }: ForecastCardProps) {
  const { label, icon } = mapWeatherCode(day.weatherCode);
  const dayLabel = formatWeatherDate(day.date, timezone);
  const rainChance =
    typeof day.precipitationProbabilityPercent !== 'number' ||
    !Number.isFinite(day.precipitationProbabilityPercent)
      ? '—'
      : `${day.precipitationProbabilityPercent}%`;

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-glass backdrop-blur-md">
      <p className="text-sm font-medium capitalize text-white/80">{dayLabel}</p>
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="sr-only">{label}</p>
      <p className="text-sm text-white">
        <span className="sr-only">
          Máxima {formatTemperature(day.maxTemperatureC, unit)}, mínima{' '}
          {formatTemperature(day.minTemperatureC, unit)}
        </span>
        <span aria-hidden="true" className="font-semibold">
          {formatTemperature(day.maxTemperatureC, unit)}
        </span>{' '}
        <span aria-hidden="true" className="text-white/50">
          {formatTemperature(day.minTemperatureC, unit)}
        </span>
      </p>
      <p className="text-xs text-accent-400">
        <span className="sr-only">Chance de chuva: {rainChance}</span>
        <span aria-hidden="true">💧 {rainChance}</span>
      </p>
    </div>
  );
}
