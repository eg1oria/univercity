import { plural } from '@/lib/plural';

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

const pad = (value: number) => String(value).padStart(2, '0');

export function weekdayShort(date: Date) {
  return WEEKDAYS_SHORT[date.getDay()];
}

/** «Пн, 14 окт» */
export function formatDay(date: Date) {
  return `${weekdayShort(date)}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** «09:00» */
export function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** «Пн, 14 окт · 09:00» */
export function formatDateTime(date: Date) {
  return `${formatDay(date)} · ${formatTime(date)}`;
}

/** «13–18 окт» or «28 сен – 3 окт» */
export function formatRange(from: Date, to: Date) {
  if (from.getMonth() === to.getMonth()) {
    return `${from.getDate()}–${to.getDate()} ${MONTHS_SHORT[to.getMonth()]}`;
  }
  return `${from.getDate()} ${MONTHS_SHORT[from.getMonth()]} – ${to.getDate()} ${MONTHS_SHORT[to.getMonth()]}`;
}

export function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

/** '09:00' → 540 */
export function parseTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Monday of the study week; on Sunday the upcoming week is shown. */
export function startOfStudyWeek(date: Date) {
  const day = date.getDay();
  const monday = addDays(date, day === 0 ? 1 : 1 - day);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function greeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 18) return 'Добрый день';
  if (hour >= 18 && hour < 23) return 'Добрый вечер';
  return 'Доброй ночи';
}

/** Duration after «через»: «10 минут», «1 час 5 минут». */
export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${plural(hours, ['час', 'часа', 'часов'])}`);
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} ${plural(minutes, ['минуту', 'минуты', 'минут'])}`);
  }
  return parts.join(' ');
}
