/**
 * Demo data for the prototype. Everything the screens show comes from this file,
 * so the university, the student and the subjects can be replaced in one place.
 */

import { addDays, minutesOfDay, parseTime } from '@/lib/date';

export const university = {
  name: 'Университет',
};

export const student = {
  firstName: 'Айгерим',
  fullName: 'Айгерим Сейткали',
  id: '230104',
  group: 'ИС-23-1',
  course: 2,
  specialty: 'Информационные системы',
};

// ── Schedule ────────────────────────────────────────────────────────────────

/** The autumn semester: 15 study weeks, the first one starts on Monday, 31 August 2026. */
export const semester = {
  start: new Date(2026, 7, 31),
  weeks: 15,
};

export type LessonType = 'Лекция' | 'Практика' | 'Лабораторная';

export type Lesson = {
  id: string;
  subject: string;
  type: LessonType;
  room: string;
  teacher: string;
  start: string;
  end: string;
};

const SLOTS = [
  ['08:30', '09:50'],
  ['10:00', '11:20'],
  ['11:30', '12:50'],
  ['13:30', '14:50'],
  ['15:00', '16:20'],
] as const;

function lesson(
  day: number,
  slot: number,
  subject: string,
  type: LessonType,
  room: string,
  teacher: string
): Lesson {
  const [start, end] = SLOTS[slot - 1];
  return { id: `${day}-${slot}`, subject, type, room, teacher, start, end };
}

/** Lessons by weekday: 1 — Monday … 6 — Saturday. */
export const schedule: Record<number, Lesson[]> = {
  1: [
    lesson(1, 1, 'Математический анализ', 'Лекция', '304', 'Иванова А. С.'),
    lesson(1, 2, 'Базы данных', 'Лекция', '205', 'Сапаров Д. Е.'),
    lesson(1, 4, 'Английский язык', 'Практика', '412', 'Ким О. В.'),
  ],
  2: [
    lesson(2, 2, 'Алгоритмы и структуры данных', 'Лекция', '301', 'Ахметов Б. К.'),
    lesson(2, 3, 'Математический анализ', 'Практика', '118', 'Иванова А. С.'),
    lesson(2, 4, 'Физика', 'Лабораторная', '021', 'Смирнов П. А.'),
  ],
  3: [
    lesson(3, 1, 'Веб-технологии', 'Лекция', '207', 'Нурланова Г. Т.'),
    lesson(3, 2, 'Базы данных', 'Лабораторная', '210', 'Сапаров Д. Е.'),
    lesson(3, 3, 'Философия', 'Лекция', '101', 'Жумабаев Е. М.'),
    lesson(3, 5, 'Физическая культура', 'Практика', 'Спортзал', 'Тулегенов А. Р.'),
  ],
  4: [
    lesson(4, 2, 'Физика', 'Лекция', '302', 'Смирнов П. А.'),
    lesson(4, 3, 'Алгоритмы и структуры данных', 'Лабораторная', '214', 'Ахметов Б. К.'),
    lesson(4, 4, 'Английский язык', 'Практика', '412', 'Ким О. В.'),
  ],
  5: [
    lesson(5, 1, 'Веб-технологии', 'Лабораторная', '210', 'Нурланова Г. Т.'),
    lesson(5, 2, 'Математический анализ', 'Лекция', '304', 'Иванова А. С.'),
    lesson(5, 3, 'Философия', 'Практика', '116', 'Жумабаев Е. М.'),
  ],
  6: [lesson(6, 2, 'Базы данных', 'Практика', '205', 'Сапаров Д. Е.')],
};

export function lessonsOn(date: Date) {
  return schedule[date.getDay()] ?? [];
}

export type UpcomingLesson = {
  lesson: Lesson;
  date: Date;
  status: 'now' | 'next';
};

/** The lesson in progress, otherwise the nearest one within the next week. */
export function currentOrNextLesson(now: Date): UpcomingLesson | null {
  const minutes = minutesOfDay(now);

  for (let offset = 0; offset <= 7; offset++) {
    const date = addDays(now, offset);
    for (const item of lessonsOn(date)) {
      const start = parseTime(item.start);
      const end = parseTime(item.end);
      if (offset === 0 && minutes >= start && minutes < end) {
        return { lesson: item, date, status: 'now' };
      }
      if (offset > 0 || minutes < start) {
        return { lesson: item, date, status: 'next' };
      }
    }
  }
  return null;
}

// ── Grades ──────────────────────────────────────────────────────────────────

export type Grade = {
  subject: string;
  teacher: string;
  credits: number;
  rk1?: number;
  rk2?: number;
  exam?: number;
};

export type Semester = {
  id: string;
  title: string;
  current?: boolean;
  grades: Grade[];
};

export const semesters: Semester[] = [
  {
    id: '3',
    title: '3 семестр',
    current: true,
    grades: [
      { subject: 'Математический анализ', teacher: 'Иванова А. С.', credits: 5, rk1: 88 },
      { subject: 'Алгоритмы и структуры данных', teacher: 'Ахметов Б. К.', credits: 5, rk1: 92 },
      { subject: 'Базы данных', teacher: 'Сапаров Д. Е.', credits: 5, rk1: 85 },
      { subject: 'Веб-технологии', teacher: 'Нурланова Г. Т.', credits: 4, rk1: 96 },
      { subject: 'Физика', teacher: 'Смирнов П. А.', credits: 4, rk1: 74 },
      { subject: 'Философия', teacher: 'Жумабаев Е. М.', credits: 3, rk1: 90 },
    ],
  },
  {
    id: '2',
    title: '2 семестр',
    grades: [
      { subject: 'Линейная алгебра', teacher: 'Иванова А. С.', credits: 5, rk1: 84, rk2: 88, exam: 82 },
      { subject: 'Программирование', teacher: 'Ахметов Б. К.', credits: 6, rk1: 95, rk2: 97, exam: 94 },
      { subject: 'Дискретная математика', teacher: 'Сапаров Д. Е.', credits: 4, rk1: 78, rk2: 81, exam: 76 },
      { subject: 'Английский язык', teacher: 'Ким О. В.', credits: 4, rk1: 91, rk2: 93, exam: 90 },
      { subject: 'История Казахстана', teacher: 'Жумабаев Е. М.', credits: 5, rk1: 86, rk2: 90, exam: 88 },
    ],
  },
  {
    id: '1',
    title: '1 семестр',
    grades: [
      { subject: 'Введение в специальность', teacher: 'Нурланова Г. Т.', credits: 3, rk1: 94, rk2: 96, exam: 95 },
      { subject: 'Основы программирования', teacher: 'Ахметов Б. К.', credits: 6, rk1: 90, rk2: 92, exam: 89 },
      { subject: 'Математика', teacher: 'Иванова А. С.', credits: 5, rk1: 72, rk2: 80, exam: 75 },
      { subject: 'Казахский язык', teacher: 'Тулегенова Ж. К.', credits: 4, rk1: 88, rk2: 85, exam: 87 },
      { subject: 'Информационные технологии', teacher: 'Сапаров Д. Е.', credits: 5, rk1: 97, rk2: 95, exam: 96 },
    ],
  },
];

/** Final score: 60% — the two midterm controls, 40% — the exam. */
export function totalScore(grade: Grade) {
  if (grade.rk1 === undefined || grade.rk2 === undefined || grade.exam === undefined) {
    return null;
  }
  return Math.round(grade.rk1 * 0.3 + grade.rk2 * 0.3 + grade.exam * 0.4);
}

const LETTERS: [min: number, letter: string, points: number][] = [
  [95, 'A', 4.0],
  [90, 'A−', 3.67],
  [85, 'B+', 3.33],
  [80, 'B', 3.0],
  [75, 'B−', 2.67],
  [70, 'C+', 2.33],
  [65, 'C', 2.0],
  [60, 'C−', 1.67],
  [55, 'D+', 1.33],
  [50, 'D', 1.0],
  [0, 'F', 0],
];

export function letterGrade(score: number) {
  const [, letter, points] = LETTERS.find(([min]) => score >= min) ?? LETTERS[LETTERS.length - 1];
  return { letter, points };
}

/** Credit-weighted GPA over the subjects that already have a final score. */
export function gpa(grades: Grade[]) {
  let points = 0;
  let credits = 0;
  for (const grade of grades) {
    const total = totalScore(grade);
    if (total === null) continue;
    points += letterGrade(total).points * grade.credits;
    credits += grade.credits;
  }
  return credits === 0 ? null : points / credits;
}

export const allGrades = semesters.flatMap((semester) => semester.grades);

export function earnedCredits() {
  return allGrades
    .filter((grade) => totalScore(grade) !== null)
    .reduce((sum, grade) => sum + grade.credits, 0);
}

// ── Attendance ──────────────────────────────────────────────────────────────

export const attendance = {
  attended: 83,
  total: 90,
};

// ── Documents ───────────────────────────────────────────────────────────────

export type StudentDocument = {
  id: string;
  title: string;
  /** Where the document is needed or what it covers. */
  note: string;
  date: string;
  status: 'ready' | 'pending';
};

export const initialDocuments: StudentDocument[] = [
  { id: 'doc1', title: 'Справка с места учёбы', note: 'По месту требования', date: '12 окт', status: 'ready' },
  { id: 'doc2', title: 'Транскрипт', note: '1–2 семестры', date: '2 окт', status: 'ready' },
  { id: 'doc3', title: 'Заявление на академическую мобильность', note: 'Весенний семестр', date: '9 окт', status: 'pending' },
  { id: 'doc4', title: 'Договор об оказании образовательных услуг', note: '2023–2027', date: '1 сен', status: 'ready' },
];

// ── Chats ───────────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  from: 'me' | 'them';
  /** Shown in group chats above the first message of another person. */
  author?: string;
  text: string;
  time: string;
};

export type Chat = {
  id: string;
  title: string;
  subtitle: string;
  lastAt: string;
  unread: number;
  messages: Message[];
};

export const initialChats: Chat[] = [
  {
    id: 'group',
    title: 'ИС-23-1',
    subtitle: 'Группа · 24 участника',
    lastAt: '09:41',
    unread: 3,
    messages: [
      { id: 'g1', from: 'them', author: 'Данияр, староста', text: 'Коллеги, в пятницу сдаём списки на практику.', time: '08:12' },
      { id: 'g2', from: 'me', text: 'Принято. Форму заполнять в портале или на бумаге?', time: '08:20' },
      { id: 'g3', from: 'them', author: 'Данияр, староста', text: 'В портале, раздел «Заявления».', time: '08:24' },
      { id: 'g4', from: 'them', author: 'Алина', text: 'Кто идёт на консультацию по матанализу?', time: '09:30' },
      { id: 'g5', from: 'them', author: 'Тимур', text: 'Я буду, после третьей пары.', time: '09:36' },
      { id: 'g6', from: 'them', author: 'Данияр, староста', text: 'Завтра пара по базам данных в 205 аудитории.', time: '09:41' },
    ],
  },
  {
    id: 'ivanova',
    title: 'Иванова А. С.',
    subtitle: 'Преподаватель · Математический анализ',
    lastAt: '08:05',
    unread: 1,
    messages: [
      { id: 'i1', from: 'me', text: 'Здравствуйте. Можно ли пересдать контрольную по пределам?', time: 'Вчера' },
      { id: 'i2', from: 'them', text: 'Здравствуйте, Айгерим. Да, в четверг после второй пары, аудитория 118.', time: 'Вчера' },
      { id: 'i3', from: 'them', text: 'Оценка за РК1 выставлена.', time: '08:05' },
    ],
  },
  {
    id: 'advisor',
    title: 'Нурланова Г. Т.',
    subtitle: 'Эдвайзер',
    lastAt: 'Вчера',
    unread: 0,
    messages: [
      { id: 'a1', from: 'them', text: 'Регистрация на дисциплины весеннего семестра открыта до 20 октября.', time: 'Вчера' },
      { id: 'a2', from: 'me', text: 'Спасибо. Хочу взять «Машинное обучение» как электив.', time: 'Вчера' },
      { id: 'a3', from: 'them', text: 'Хороший выбор. Проверьте пререквизиты и отправьте ИУП на согласование.', time: 'Вчера' },
    ],
  },
  {
    id: 'dean',
    title: 'Деканат',
    subtitle: 'Факультет информационных технологий',
    lastAt: 'Пн',
    unread: 0,
    messages: [
      { id: 'de1', from: 'me', text: 'Здравствуйте. Нужна справка с места учёбы.', time: 'Пн' },
      { id: 'de2', from: 'them', text: 'Справка готова. Электронная версия доступна в разделе «Документы».', time: 'Пн' },
    ],
  },
  {
    id: 'saparov',
    title: 'Сапаров Д. Е.',
    subtitle: 'Преподаватель · Базы данных',
    lastAt: 'Пт',
    unread: 0,
    messages: [
      { id: 's1', from: 'them', text: 'Лабораторную работу 4 принимаю до воскресенья включительно.', time: 'Пт' },
    ],
  },
  {
    id: 'registrar',
    title: 'Офис регистратора',
    subtitle: 'Транскрипты, справки, пересдачи',
    lastAt: '2 окт',
    unread: 0,
    messages: [
      { id: 'r1', from: 'them', text: 'Транскрипт за второй семестр подписан и доступен для скачивания.', time: '2 окт' },
    ],
  },
];
