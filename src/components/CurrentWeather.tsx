import { memo } from 'react';
import { toDisplayTemperature } from '../lib/temperature';
import { mapWeatherCode } from '../lib/weatherCode';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatTemperature(valueC: number | null | undefined, unit: Unit): string {
  if (typeof valueC !== 'number' || !Number.isFinite(valueC)) return '—';
  const value = toDisplayTemperature(valueC, unit);
  if (value === undefined || !Number.isFinite(value)) return '—';
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

function formatMetric(value: number | null | undefined, suffix: string): string {
  return typeof value !== 'number' || !Number.isFinite(value) ? '—' : `${value}${suffix}`;
}

function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const { label, icon } = mapWeatherCode(current.weatherCode);

  return (
    <section
      aria-label={`Clima atual em ${city.name}`}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{city.name}</h2>
          <p className="text-sm text-white/60">
            {[city.region, city.country].filter(Boolean).join(', ')}
          </p>
        </div>
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
      </header>

      <p className="mt-4 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        {formatTemperature(current.temperatureC, unit)}
      </p>
      <p className="mt-1 text-base text-white/70">{label}</p>
      <p className="text-sm text-white/50">
        Sensação térmica: {formatTemperature(current.apparentTemperatureC, unit)}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-white/50">Umidade</dt>
          <dd className="text-lg font-medium text-white">
            {formatMetric(current.humidityPercent, '%')}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-white/50">Vento</dt>
          <dd className="text-lg font-medium text-white">
            {formatMetric(current.windSpeedKmh, ' km/h')}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-white/50">Precipitação</dt>
          <dd className="text-lg font-medium text-white">
            {formatMetric(current.precipitationMm, ' mm')}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-white/50">Pressão</dt>
          <dd className="text-lg font-medium text-white">
            {formatMetric(current.pressureHpa, ' hPa')}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default memo(CurrentWeather);
