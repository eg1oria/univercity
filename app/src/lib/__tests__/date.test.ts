import {
  addDays,
  formatDateTime,
  formatDay,
  formatDuration,
  formatRange,
  formatTime,
  isSameDay,
  minutesOfDay,
  parseTime,
  startOfStudyWeek,
} from '@/lib/date';

// 12 October 2026 is a Monday.
const monday = new Date(2026, 9, 12, 9, 5);

describe('formatting', () => {
  it('formats a day as weekday, date and short month', () => {
    expect(formatDay(monday)).toBe('Пн, 12 окт');
    expect(formatDay(new Date(2026, 4, 3))).toBe('Вс, 3 мая');
  });

  it('pads hours and minutes', () => {
    expect(formatTime(monday)).toBe('09:05');
    expect(formatTime(new Date(2026, 9, 12, 0, 0))).toBe('00:00');
  });

  it('joins the day and the time', () => {
    expect(formatDateTime(monday)).toBe('Пн, 12 окт · 09:05');
  });

  it('names the month once when the range stays inside it', () => {
    expect(formatRange(new Date(2026, 9, 12), new Date(2026, 9, 17))).toBe('12–17 окт');
  });

  it('names both months when the range crosses a month', () => {
    expect(formatRange(new Date(2026, 8, 28), new Date(2026, 9, 3))).toBe('28 сен – 3 окт');
  });
});

describe('time of day', () => {
  it('converts a clock time to minutes', () => {
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('09:00')).toBe(540);
    expect(parseTime('16:20')).toBe(980);
  });

  it('reads minutes of the day from a date', () => {
    expect(minutesOfDay(monday)).toBe(545);
  });
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(isSameDay(addDays(new Date(2026, 9, 31), 1), new Date(2026, 10, 1))).toBe(true);
    expect(isSameDay(addDays(new Date(2026, 11, 31), 1), new Date(2027, 0, 1))).toBe(true);
    expect(isSameDay(addDays(new Date(2026, 9, 1), -1), new Date(2026, 8, 30))).toBe(true);
  });

  it('keeps the time and leaves the original date untouched', () => {
    const next = addDays(monday, 1);
    expect(formatTime(next)).toBe('09:05');
    expect(monday.getDate()).toBe(12);
  });
});

describe('isSameDay', () => {
  it('ignores the time', () => {
    expect(isSameDay(new Date(2026, 9, 12, 0, 0), new Date(2026, 9, 12, 23, 59))).toBe(true);
  });

  it('tells apart the same date in another month or year', () => {
    expect(isSameDay(new Date(2026, 9, 12), new Date(2026, 10, 12))).toBe(false);
    expect(isSameDay(new Date(2026, 9, 12), new Date(2027, 9, 12))).toBe(false);
  });
});

describe('startOfStudyWeek', () => {
  it('returns midnight of the Monday of the same week', () => {
    const start = startOfStudyWeek(new Date(2026, 9, 15, 14, 30));
    expect(isSameDay(start, new Date(2026, 9, 12))).toBe(true);
    expect(minutesOfDay(start)).toBe(0);
  });

  it('stays on Monday and reaches back from Saturday', () => {
    expect(isSameDay(startOfStudyWeek(monday), new Date(2026, 9, 12))).toBe(true);
    expect(isSameDay(startOfStudyWeek(new Date(2026, 9, 17)), new Date(2026, 9, 12))).toBe(true);
  });

  it('moves Sunday to the upcoming week', () => {
    expect(isSameDay(startOfStudyWeek(new Date(2026, 9, 18)), new Date(2026, 9, 19))).toBe(true);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0 минут'],
    [1, '1 минуту'],
    [10, '10 минут'],
    [22, '22 минуты'],
    [60, '1 час'],
    [65, '1 час 5 минут'],
    [120, '2 часа'],
    [301, '5 часов 1 минуту'],
  ])('%i → %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
