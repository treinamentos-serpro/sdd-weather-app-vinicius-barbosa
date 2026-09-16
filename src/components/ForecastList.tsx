import { memo } from 'react';
import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  timezone: string;
  unit: Unit;
}

function ForecastList({ forecast, timezone, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading">
      <h2
        id="forecast-heading"
        className="mb-3 text-sm font-medium uppercase tracking-wide text-white/60"
      >
        Previsão de 5 dias
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day) => (
          <li key={day.date}>
            <ForecastCard day={day} timezone={timezone} unit={unit} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(ForecastList);
