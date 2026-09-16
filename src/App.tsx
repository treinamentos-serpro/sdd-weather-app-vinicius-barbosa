import { useEffect, useRef, useState } from 'react';
import CityResults from './components/CityResults';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, cities, error, query, setQuery, search, selectCity, retry } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      resultRef.current?.focus();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-night-900 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">SDD Weather</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={search}
              disabled={status === 'loading'}
            />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </header>

        <main
          ref={resultRef}
          tabIndex={-1}
          aria-busy={status === 'loading'}
          className="flex flex-col gap-6 outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          {status === 'idle' && (
            <EmptyState
              title="Busque uma cidade para começar"
              hint="Digite o nome de uma cidade e pressione Enter."
            />
          )}
          {status === 'loading' && <LoadingState />}
          {status === 'results' && <CityResults cities={cities} onSelect={selectCity} />}
          {status === 'empty' && (
            <EmptyState
              title="Nenhuma cidade encontrada."
              hint="Tente buscar com outro nome ou verifique a ortografia."
            />
          )}
          {status === 'error' && <ErrorState message={error} onRetry={retry} />}
          {status === 'success' && data && (
            <>
              <CurrentWeather city={data.city} current={data.current} unit={unit} />
              <ForecastList forecast={data.forecast} timezone={data.timezone} unit={unit} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
