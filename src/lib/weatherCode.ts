export interface WeatherCodeInfo {
  label: string;
  icon: string;
}

/** Mapeamento parcial dos códigos WMO usados pelo Open-Meteo. */
const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Poucas nuvens', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Nevoeiro', icon: '🌫️' },
  48: { label: 'Nevoeiro com geada', icon: '🌫️' },
  51: { label: 'Garoa fraca', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa forte', icon: '🌧️' },
  56: { label: 'Garoa congelante fraca', icon: '🌧️' },
  57: { label: 'Garoa congelante forte', icon: '🌧️' },
  61: { label: 'Chuva fraca', icon: '🌧️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '🌧️' },
  66: { label: 'Chuva congelante fraca', icon: '🌧️' },
  67: { label: 'Chuva congelante forte', icon: '🌧️' },
  71: { label: 'Neve fraca', icon: '❄️' },
  73: { label: 'Neve moderada', icon: '❄️' },
  75: { label: 'Neve forte', icon: '❄️' },
  77: { label: 'Grãos de neve', icon: '🌨️' },
  80: { label: 'Pancadas de chuva fracas', icon: '🌦️' },
  81: { label: 'Pancadas de chuva moderadas', icon: '🌦️' },
  82: { label: 'Pancadas de chuva fortes', icon: '⛈️' },
  85: { label: 'Pancadas de neve fracas', icon: '🌨️' },
  86: { label: 'Pancadas de neve fortes', icon: '🌨️' },
  95: { label: 'Trovoada', icon: '⛈️' },
  96: { label: 'Trovoada com granizo fraco', icon: '⛈️' },
  99: { label: 'Trovoada com granizo forte', icon: '⛈️' },
};

const UNKNOWN_WEATHER_CODE: WeatherCodeInfo = { label: 'Condição desconhecida', icon: '❓' };

/** Mapeia um código WMO para um rótulo em pt-BR e um ícone. Nunca lança exceção. */
export function mapWeatherCode(code: number | undefined): WeatherCodeInfo {
  if (code === undefined) return UNKNOWN_WEATHER_CODE;
  return WEATHER_CODE_MAP[code] ?? UNKNOWN_WEATHER_CODE;
}
