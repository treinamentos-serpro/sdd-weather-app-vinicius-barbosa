/** Hook que orquestra busca de cidades e carregamento do clima selecionado. */

import { useCallback, useRef, useState } from 'react';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
  type WeatherServiceErrorKind,
} from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'results' | 'success' | 'error' | 'empty';

interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | undefined;
  cities: City[];
  error: string | undefined;
  query: string;
  setQuery: (value: string) => void;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

const DEFAULT_ERROR_MESSAGE = 'Não foi possível carregar os dados do clima.';
const FRIENDLY_ERROR_MESSAGES: Record<WeatherServiceErrorKind, string> = {
  timeout: 'A conexão demorou mais de 10 segundos. Verifique sua internet e tente novamente.',
  network:
    'Não foi possível conectar ao serviço de clima. Verifique sua internet e tente novamente.',
  api: 'O serviço de clima está indisponível no momento. Tente novamente em instantes.',
  'invalid-response': 'Recebemos uma resposta inesperada. Tente novamente em instantes.',
  unavailable: 'Dados indisponíveis no momento.',
};

function getErrorMessage(error: unknown): string {
  if (!(error instanceof WeatherServiceError)) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return FRIENDLY_ERROR_MESSAGES[error.kind] ?? DEFAULT_ERROR_MESSAGE;
}

/** Gerencia o estado de busca de cidades e do clima da cidade selecionada. */
export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | undefined>(undefined);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState('');
  const lastActionRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const retryInProgressRef = useRef(false);

  const selectCity = useCallback(async (city: City) => {
    lastActionRef.current = () => selectCity(city);
    setStatus('loading');
    setError(undefined);

    try {
      const weather = await getWeather(city);
      setData(weather);
      setStatus('success');
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  const search = useCallback(async (name: string) => {
    lastActionRef.current = () => search(name);
    setQuery(name);
    setStatus('loading');
    setError(undefined);
    setCities([]);

    try {
      const results = await searchCities(name);
      setCities(results);

      if (results.length === 0) {
        setData(undefined);
        setStatus('empty');
        return;
      }

      setData(undefined);
      setStatus('results');
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  const retry = useCallback(async () => {
    const lastAction = lastActionRef.current;
    if (!lastAction || retryInProgressRef.current) {
      return;
    }

    retryInProgressRef.current = true;
    try {
      await lastAction();
    } finally {
      retryInProgressRef.current = false;
    }
  }, []);

  return { status, data, cities, error, query, setQuery, search, selectCity, retry };
}
