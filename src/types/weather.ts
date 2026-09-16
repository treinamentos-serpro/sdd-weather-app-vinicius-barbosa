/** Contratos de domínio do clima, compartilhados entre services, hooks e componentes. */

export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  /** Identificador da cidade retornado pelo geocoding. */
  id: number;
  /** Nome da cidade. */
  name: string;
  /** Nome do país. */
  country: string;
  /** Código ISO do país, quando disponível. */
  countryCode?: string;
  /** Estado ou região administrativa (`admin1`). */
  region?: string;
  /** Latitude usada na consulta meteorológica. */
  latitude: number;
  /** Longitude usada na consulta meteorológica. */
  longitude: number;
  /** Fuso horário retornado pelo geocoding. */
  timezone?: string;
}

export interface CurrentWeather {
  /** Horário da observação em `timezone=auto`. */
  time?: string;
  /** `temperature_2m`, sempre normalizada para Celsius. */
  temperatureC?: number;
  /** `apparent_temperature`, em Celsius. */
  apparentTemperatureC?: number;
  /** `relative_humidity_2m`, em percentual. */
  humidityPercent?: number;
  /** `wind_speed_10m`, normalizada para km/h. */
  windSpeedKmh?: number;
  /** `precipitation`, em milímetros. */
  precipitationMm?: number;
  /** `surface_pressure`, em hPa. */
  pressureHpa?: number;
  /** `weather_code` WMO para condição e ícone. */
  weatherCode?: number;
}

export interface ForecastDay {
  /** Data local do dia no fuso da cidade. */
  date: string;
  /** `temperature_2m_min`, em Celsius. */
  minTemperatureC?: number;
  /** `temperature_2m_max`, em Celsius. */
  maxTemperatureC?: number;
  /** `precipitation_probability_max`, em percentual. */
  precipitationProbabilityPercent?: number;
  /** `weather_code` diário WMO. */
  weatherCode?: number;
}

export interface WeatherData {
  /** Cidade associada às coordenadas consultadas. */
  city: City;
  /** Fuso retornado pela API para formatar datas e horários. */
  timezone: string;
  /** Condições meteorológicas atuais. */
  current: CurrentWeather;
  /** Previsão normalizada para exatamente cinco dias. */
  forecast: ForecastDay[];
  /** Instante ISO de recebimento da resposta. */
  fetchedAt: string;
}

export interface CachedWeather {
  /** Última resposta meteorológica válida. */
  data: WeatherData;
  /** Instante usado para validar a expiração do cache. */
  cachedAt: string;
}
