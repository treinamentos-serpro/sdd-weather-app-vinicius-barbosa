/** Acesso às APIs de geocoding e forecast da Open-Meteo. */

import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

export type WeatherServiceErrorKind =
  | 'timeout'
  | 'network'
  | 'api'
  | 'invalid-response'
  | 'unavailable';

/** Erro interno com causa categorizada para mensagens amigáveis na UI. */
export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly kind: WeatherServiceErrorKind,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isAbortError(error: unknown): boolean {
  return (
    (typeof DOMException !== 'undefined' &&
      error instanceof DOMException &&
      error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

/** Executa `fetch` com timeout explícito e classifica falhas de transporte. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (isAbortError(error)) {
      throw new WeatherServiceError(
        'A conexão demorou mais de 10 segundos. Verifique sua internet e tente novamente.',
        'timeout',
      );
    }
    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço de clima. Verifique sua internet e tente novamente.',
      'network',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

interface GeocodingResult {
  id?: number | null;
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  country?: string | null;
  country_code?: string | null;
  admin1?: string | null;
  timezone?: string | null;
}

interface GeocodingResponse {
  results?: GeocodingResult[] | null;
}

function isValidGeocodingResult(result: GeocodingResult): result is GeocodingResult & {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
} {
  return (
    typeof result.id === 'number' &&
    Number.isFinite(result.id) &&
    typeof result.name === 'string' &&
    result.name.trim() !== '' &&
    typeof result.latitude === 'number' &&
    Number.isFinite(result.latitude) &&
    typeof result.longitude === 'number' &&
    Number.isFinite(result.longitude)
  );
}

function mapResultToCity(
  result: GeocodingResult & {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  },
): City {
  return {
    id: result.id,
    name: result.name,
    country: result.country?.trim() ?? '',
    countryCode: result.country_code ?? undefined,
    region: result.admin1?.trim() || undefined,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone?.trim() || undefined,
  };
}

/** Busca cidades pelo nome usando o endpoint de geocoding da Open-Meteo. */
export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (query === '') {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      'O serviço de cidades está indisponível no momento. Tente novamente em instantes.',
      'api',
      response.status,
    );
  }

  let data: GeocodingResponse | null;
  try {
    data = (await response.json()) as GeocodingResponse | null;
  } catch {
    throw new WeatherServiceError(
      'Recebemos uma resposta inesperada. Tente novamente em instantes.',
      'invalid-response',
    );
  }

  return (Array.isArray(data?.results) ? data.results : [])
    .filter(isValidGeocodingResult)
    .map(mapResultToCity);
}

interface ForecastCurrentResponse {
  time?: string | null;
  temperature_2m?: number | null;
  apparent_temperature?: number | null;
  relative_humidity_2m?: number | null;
  wind_speed_10m?: number | null;
  precipitation?: number | null;
  surface_pressure?: number | null;
  weather_code?: number | null;
}

interface ForecastDailyResponse {
  time?: Array<string | null> | null;
  temperature_2m_min?: Array<number | null> | null;
  temperature_2m_max?: Array<number | null> | null;
  precipitation_probability_max?: Array<number | null> | null;
  weather_code?: Array<number | null> | null;
}

interface ForecastResponse {
  timezone?: string | null;
  current?: ForecastCurrentResponse | null;
  daily?: ForecastDailyResponse | null;
}

function finiteNumber(value: number | null | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function mapCurrent(raw: ForecastCurrentResponse): CurrentWeather {
  return {
    time: raw.time ?? undefined,
    temperatureC: finiteNumber(raw.temperature_2m),
    apparentTemperatureC: finiteNumber(raw.apparent_temperature),
    humidityPercent: finiteNumber(raw.relative_humidity_2m),
    windSpeedKmh: finiteNumber(raw.wind_speed_10m),
    precipitationMm: finiteNumber(raw.precipitation) ?? 0,
    pressureHpa: finiteNumber(raw.surface_pressure),
    weatherCode: finiteNumber(raw.weather_code),
  };
}

function mapDaily(daily: ForecastDailyResponse): ForecastDay[] {
  const dates = Array.isArray(daily.time) ? daily.time : [];
  return dates.flatMap((date, index) => {
    if (typeof date !== 'string' || date.trim() === '') return [];

    return [
      {
        date,
        minTemperatureC: finiteNumber(daily.temperature_2m_min?.[index]),
        maxTemperatureC: finiteNumber(daily.temperature_2m_max?.[index]),
        precipitationProbabilityPercent: finiteNumber(daily.precipitation_probability_max?.[index]),
        weatherCode: finiteNumber(daily.weather_code?.[index]),
      },
    ];
  });
}

function normalizeTimezone(timezone: string | null | undefined): string {
  const candidate = timezone?.trim();
  if (!candidate) return 'UTC';

  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: candidate }).format();
    return candidate;
  } catch {
    return 'UTC';
  }
}

/** Busca o clima atual e a previsão de cinco dias para a cidade informada. */
export async function getWeather(city: City): Promise<WeatherData> {
  const url =
    `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&forecast_days=5&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto';

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      'O serviço de clima está indisponível no momento. Tente novamente em instantes.',
      'api',
      response.status,
    );
  }

  let data: ForecastResponse | null;
  try {
    data = (await response.json()) as ForecastResponse | null;
  } catch {
    throw new WeatherServiceError(
      'Recebemos uma resposta inesperada. Tente novamente em instantes.',
      'invalid-response',
    );
  }

  if (!data?.current || !data.daily) {
    throw new WeatherServiceError(
      'Os dados do clima estão indisponíveis no momento. Tente novamente em instantes.',
      'unavailable',
    );
  }

  return {
    city,
    timezone: normalizeTimezone(data.timezone),
    current: mapCurrent(data.current),
    forecast: mapDaily(data.daily).slice(0, 5),
    fetchedAt: new Date().toISOString(),
  };
}
