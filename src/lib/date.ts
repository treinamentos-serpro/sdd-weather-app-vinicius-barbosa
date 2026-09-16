/** Formata a data de um dia de previsão em pt-BR relativa ao fuso da cidade. */
const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function getDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';
  return WEEKDAYS[parseLocalDate(iso).getDay()];
}

export function getShortDate(iso: string): string {
  const date = parseLocalDate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatWeatherDate(date: string, timezone: string): string {
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(tomorrow);

  if (date === todayStr) return 'Hoje';
  if (date === tomorrowStr) return 'Amanhã';

  const referenceDate = new Date(`${date}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', weekday: 'long' }).format(
    referenceDate,
  );
  return weekday;
}
