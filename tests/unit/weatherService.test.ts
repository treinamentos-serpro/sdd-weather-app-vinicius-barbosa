import { afterEach, describe, expect, it, vi } from 'vitest';

import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'São Paulo',
  country: 'Brasil',
  countryCode: 'BR',
  region: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
};

function mockResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it('does not call fetch for an empty input', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes accents and special characters in the geocoding query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ results: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await searchCities('São Paulo & Co.');

    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] as string);
    expect(requestUrl.searchParams.get('name')).toBe('São Paulo & Co.');
  });

  it('maps geocoding results to cities', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          results: [
            {
              id: 1,
              name: 'São Paulo',
              latitude: -23.55,
              longitude: -46.63,
              country: 'Brasil',
              country_code: 'BR',
              admin1: 'São Paulo',
              timezone: 'America/Sao_Paulo',
            },
          ],
        }),
      ),
    );

    await expect(searchCities('São Paulo')).resolves.toEqual([
      {
        ...city,
        timezone: 'America/Sao_Paulo',
      },
    ]);
  });

  it('returns an empty list when results are absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({})));

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
  });

  it('discards cities with missing required fields and normalizes nullable fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          results: [
            { id: null, name: 'Sem identificador', latitude: 1, longitude: 2 },
            {
              id: 2,
              name: 'Cidade válida',
              latitude: 1,
              longitude: 2,
              country: null,
              country_code: null,
              admin1: null,
              timezone: null,
            },
          ],
        }),
      ),
    );

    await expect(searchCities('Cidade')).resolves.toEqual([
      {
        id: 2,
        name: 'Cidade válida',
        country: '',
        countryCode: undefined,
        region: undefined,
        latitude: 1,
        longitude: 2,
        timezone: undefined,
      },
    ]);
  });

  it('throws WeatherServiceError for a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({}, false, 503)));

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      statusCode: 503,
    });
  });

  it('converts network failures and invalid JSON to WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network failure')));
    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      kind: 'network',
      message:
        'Não foi possível conectar ao serviço de clima. Verifique sua internet e tente novamente.',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new SyntaxError('invalid JSON')),
      }),
    );
    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      kind: 'invalid-response',
      message: 'Recebemos uma resposta inesperada. Tente novamente em instantes.',
    });
  });

  it('classifies an aborted request as a timeout after 10 seconds', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }),
      ),
    );

    const request = searchCities('São Paulo');
    const rejection = expect(request).rejects.toMatchObject({
      kind: 'timeout',
      message: 'A conexão demorou mais de 10 segundos. Verifique sua internet e tente novamente.',
    });
    await vi.advanceTimersByTimeAsync(10_000);

    await rejection;
  });
});

describe('getWeather', () => {
  it('maps current weather and five forecast days', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-09-16T12:00',
            temperature_2m: 24,
            apparent_temperature: 25,
            relative_humidity_2m: 70,
            wind_speed_10m: 12,
            precipitation: 1.5,
            surface_pressure: 1012,
            weather_code: 2,
          },
          daily: {
            time: [
              '2026-09-16',
              '2026-09-17',
              '2026-09-18',
              '2026-09-19',
              '2026-09-20',
              '2026-09-21',
            ],
            temperature_2m_min: [18, 19, 20, 21, 22, 23],
            temperature_2m_max: [27, 28, 29, 30, 31, 32],
            precipitation_probability_max: [10, 20, 30, 40, 50, 60],
            weather_code: [2, 3, 61, 0, 1, 95],
          },
        }),
      ),
    );

    const result = await getWeather(city);

    expect(result.city).toEqual(city);
    expect(result.timezone).toBe('America/Sao_Paulo');
    expect(result.current).toMatchObject({
      temperatureC: 24,
      apparentTemperatureC: 25,
      precipitationMm: 1.5,
      weatherCode: 2,
    });
    expect(result.forecast).toHaveLength(5);
    expect(result.forecast[0]).toEqual({
      date: '2026-09-16',
      minTemperatureC: 18,
      maxTemperatureC: 27,
      precipitationProbabilityPercent: 10,
      weatherCode: 2,
    });
  });

  it('normalizes null precipitation to zero', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          current: { precipitation: null },
          daily: { time: [] },
        }),
      ),
    );

    const result = await getWeather(city);

    expect(result.current.precipitationMm).toBe(0);
  });

  it('normalizes nullable forecast fields and falls back to UTC timezone', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          timezone: null,
          current: {
            time: null,
            temperature_2m: null,
            apparent_temperature: null,
            relative_humidity_2m: null,
            wind_speed_10m: null,
            precipitation: null,
            surface_pressure: null,
            weather_code: null,
          },
          daily: {
            time: ['2026-09-16', null],
            temperature_2m_min: [null],
            temperature_2m_max: [null],
            precipitation_probability_max: [null],
            weather_code: [null],
          },
        }),
      ),
    );

    const result = await getWeather(city);

    expect(result.timezone).toBe('UTC');
    expect(result.current).toEqual({
      time: undefined,
      temperatureC: undefined,
      apparentTemperatureC: undefined,
      humidityPercent: undefined,
      windSpeedKmh: undefined,
      precipitationMm: 0,
      pressureHpa: undefined,
      weatherCode: undefined,
    });
    expect(result.forecast).toEqual([
      {
        date: '2026-09-16',
        minTemperatureC: undefined,
        maxTemperatureC: undefined,
        precipitationProbabilityPercent: undefined,
        weatherCode: undefined,
      },
    ]);
  });

  it('preserves partial current data and maps missing daily arrays as undefined', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse({
          current: { temperature_2m: 19 },
          daily: { time: ['2026-09-16'] },
        }),
      ),
    );

    const result = await getWeather(city);

    expect(result.current).toMatchObject({ temperatureC: 19, precipitationMm: 0 });
    expect(result.current.apparentTemperatureC).toBeUndefined();
    expect(result.forecast).toEqual([
      {
        date: '2026-09-16',
        minTemperatureC: undefined,
        maxTemperatureC: undefined,
        precipitationProbabilityPercent: undefined,
        weatherCode: undefined,
      },
    ]);
  });

  it('throws WeatherServiceError when the forecast response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({}, false, 502)));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      kind: 'api',
      statusCode: 502,
      message: 'O serviço de clima está indisponível no momento. Tente novamente em instantes.',
    });
  });

  it('throws WeatherServiceError when current is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({ daily: { time: [] } })));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('throws WeatherServiceError when daily is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse({ current: {} })));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
