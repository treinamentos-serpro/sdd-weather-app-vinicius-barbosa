import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

export default function CityResults({ cities, onSelect }: CityResultsProps) {
  return (
    <section aria-labelledby="city-results-heading">
      <h2 id="city-results-heading" className="mb-3 text-sm font-medium text-white/80">
        Resultados da busca
      </h2>
      <ul className="flex flex-col gap-2" aria-label="Cidades encontradas">
        {cities.map((city) => {
          const location = [city.region, city.country].filter(Boolean).join(', ');

          return (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => onSelect(city)}
                className="flex w-full items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <span className="font-medium text-white">{city.name}</span>
                {location && <span className="text-right text-sm text-white/60">{location}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
