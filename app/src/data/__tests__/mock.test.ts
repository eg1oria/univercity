import {
  currentOrNextLesson,
  gpa,
  letterGrade,
  lessonsOn,
  schedule,
  totalScore,
  type Grade,
} from '@/data/mock';
import { isSameDay } from '@/lib/date';

const grade = (credits: number, rk1?: number, rk2?: number, exam?: number): Grade => ({
  subject: 'Предмет',
  teacher: 'Преподаватель',
  credits,
  rk1,
  rk2,
  exam,
});

describe('totalScore', () => {
  it('weighs the midterms at 30% each and the exam at 40%', () => {
    expect(totalScore(grade(5, 100, 100, 50))).toBe(80);
    expect(totalScore(grade(5, 84, 88, 82))).toBe(84);
  });

  it('is unknown until every score is in', () => {
    expect(totalScore(grade(5))).toBeNull();
    expect(totalScore(grade(5, 88))).toBeNull();
    expect(totalScore(grade(5, 88, 90))).toBeNull();
  });

  it('counts a zero as a score, not as a missing one', () => {
    expect(totalScore(grade(5, 0, 0, 0))).toBe(0);
  });
});

describe('letterGrade', () => {
  it.each([
    [100, 'A', 4.0],
    [95, 'A', 4.0],
    [94, 'A−', 3.67],
    [90, 'A−', 3.67],
    [89, 'B+', 3.33],
    [75, 'B−', 2.67],
    [50, 'D', 1.0],
    [49, 'F', 0],
    [0, 'F', 0],
  ])('%i → %s (%f)', (score, letter, points) => {
    expect(letterGrade(score)).toEqual({ letter, points });
  });
});

describe('gpa', () => {
  it('weighs grade points by credits', () => {
    // A (4.0) × 5 credits and B (3.0) × 3 credits.
    expect(gpa([grade(5, 95, 95, 95), grade(3, 80, 80, 80)])).toBeCloseTo(3.625);
  });

  it('skips subjects without a final score', () => {
    expect(gpa([grade(5, 95, 95, 95), grade(6, 60)])).toBe(4);
  });

  it('is unknown when nothing is finished', () => {
    expect(gpa([])).toBeNull();
    expect(gpa([grade(5, 88)])).toBeNull();
  });
});

describe('lessonsOn', () => {
  it('returns the lessons of the weekday', () => {
    expect(lessonsOn(new Date(2026, 9, 12))).toBe(schedule[1]);
  });

  it('has no lessons on Sunday', () => {
    expect(lessonsOn(new Date(2026, 9, 18))).toEqual([]);
  });
});

describe('currentOrNextLesson', () => {
  // 12 October 2026 is a Monday: lessons at 08:30, 10:00 and 13:30.
  const at = (day: number, hours: number, minutes: number) => new Date(2026, 9, day, hours, minutes);

  it('finds the lesson in progress', () => {
    const now = at(12, 9, 0);
    expect(currentOrNextLesson(now)).toMatchObject({ lesson: schedule[1][0], status: 'now' });
  });

  it('treats the start as inside the lesson and the end as outside', () => {
    expect(currentOrNextLesson(at(12, 8, 30))).toMatchObject({ lesson: schedule[1][0], status: 'now' });
    expect(currentOrNextLesson(at(12, 9, 50))).toMatchObject({ lesson: schedule[1][1], status: 'next' });
  });

  it('finds the next lesson of the day during a break', () => {
    const now = at(12, 12, 0);
    const upcoming = currentOrNextLesson(now);
    expect(upcoming).toMatchObject({ lesson: schedule[1][2], status: 'next' });
    expect(isSameDay(upcoming!.date, now)).toBe(true);
  });

  it('moves to the next day once the lessons are over', () => {
    const upcoming = currentOrNextLesson(at(12, 20, 0));
    expect(upcoming).toMatchObject({ lesson: schedule[2][0], status: 'next' });
    expect(isSameDay(upcoming!.date, at(13, 0, 0))).toBe(true);
  });

  it('skips Sunday', () => {
    const upcoming = currentOrNextLesson(at(17, 12, 0));
    expect(upcoming).toMatchObject({ lesson: schedule[1][0], status: 'next' });
    expect(isSameDay(upcoming!.date, at(19, 0, 0))).toBe(true);
  });
});
