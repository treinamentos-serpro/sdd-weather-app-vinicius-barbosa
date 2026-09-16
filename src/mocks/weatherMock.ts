import type { WeatherData } from '../types/weather';

/** Dado mockado de São Paulo para desenvolver a UI sem depender da API. */
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-16T10:00',
    temperatureC: 22.4,
    apparentTemperatureC: 22.1,
    humidityPercent: 68,
    windSpeedKmh: 12.5,
    precipitationMm: 0.2,
    pressureHpa: 1014,
    weatherCode: 2,
  },
  forecast: [
    {
      date: '2026-09-16',
      minTemperatureC: 16.2,
      maxTemperatureC: 25.8,
      precipitationProbabilityPercent: 10,
      weatherCode: 2,
    },
    {
      date: '2026-09-17',
      minTemperatureC: 17.0,
      maxTemperatureC: 27.1,
      precipitationProbabilityPercent: 70,
      weatherCode: 61,
    },
    {
      date: '2026-09-18',
      minTemperatureC: 15.5,
      maxTemperatureC: 24.3,
      precipitationProbabilityPercent: 30,
      weatherCode: 3,
    },
    {
      date: '2026-09-19',
      minTemperatureC: 14.8,
      maxTemperatureC: 23.6,
      precipitationProbabilityPercent: 0,
      weatherCode: 0,
    },
    {
      date: '2026-09-20',
      minTemperatureC: 16.0,
      maxTemperatureC: 26.2,
      precipitationProbabilityPercent: 5,
      weatherCode: 1,
    },
  ],
  fetchedAt: '2026-09-16T10:00:00.000Z',
};
