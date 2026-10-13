import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { lessonPlace, NowBadge } from '@/components/lesson-card';
import { Avatar } from '@/components/ui/avatar';
import { Status } from '@/components/ui/badge';
import { Card, Divider } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import {
  allGrades,
  attendance,
  currentOrNextLesson,
  deadlines,
  deadlineStatus,
  gpa,
  lessonsOn,
  student,
  university,
  type Deadline,
  type UpcomingLesson,
} from '@/data/mock';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import {
  addDays,
  formatDay,
  formatDuration,
  greeting,
  isSameDay,
  minutesOfDay,
  parseTime,
} from '@/lib/date';

export default function HomeScreen() {
  const theme = useTheme();
  const now = useNow();
  const minutes = minutesOfDay(now);
  const upcoming = currentOrNextLesson(now);
  const today = lessonsOn(now);
  const overallGpa = gpa(allGrades);
  const attendanceRate = attendance.attended / attendance.total;

  return (
    <Screen>
      <View style={styles.intro}>
        <View style={styles.topRow}>
          <Text variant="label" color="inkMuted" style={styles.uppercase}>
            {university.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Профиль и настройки"
            onPress={() => router.navigate('/settings')}>
            <Avatar name={student.fullName} size={40} />
          </Pressable>
        </View>
        <Text variant="display">
          {greeting(now)}, {student.firstName}
        </Text>
        <Text color="inkMuted">
          {formatDay(now)} · {student.group}
        </Text>
      </View>

      {upcoming ? <UpcomingCard upcoming={upcoming} now={now} /> : null}

      <View style={styles.stats}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Оценки и GPA"
          style={styles.stat}
          onPress={() => router.push('/grades')}>
          {({ pressed }) => (
            <Card style={[styles.statCard, pressed && { backgroundColor: theme.surfaceSunken }]}>
              <View style={styles.statHeader}>
                <Text variant="caption" color="inkMuted">
                  Средний балл
                </Text>
                <Icon name="chevronRight" size={16} color={theme.inkMuted} />
              </View>
              <Text variant="display">{overallGpa?.toFixed(2) ?? '—'}</Text>
              <Text variant="caption" color="inkMuted">
                GPA из 4.0
              </Text>
            </Card>
          )}
        </Pressable>
        <Card style={[styles.stat, styles.statCard]}>
          <Text variant="caption" color="inkMuted">
            Посещаемость
          </Text>
          <Text variant="display">{Math.round(attendanceRate * 100)}%</Text>
          <View style={styles.statBar}>
            <ProgressBar value={attendanceRate} />
          </View>
        </Card>
      </View>

      <Section
        title="Сегодня"
        action={
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.navigate('/schedule')}>
            <Text variant="bodyStrong" color="brand">
              Всё расписание
            </Text>
          </Pressable>
        }>
        <Card padded={false}>
          {today.length === 0 ? (
            <View style={styles.row}>
              <Text color="inkMuted">Сегодня пар нет</Text>
            </View>
          ) : (
            today.map((lesson, index) => {
              const isPast = minutes >= parseTime(lesson.end);
              return (
                <View key={lesson.id}>
                  {index > 0 ? <Divider /> : null}
                  <View style={styles.row}>
                    <Text variant="bodyStrong" color={isPast ? 'inkMuted' : 'ink'} style={styles.rowTime}>
                      {lesson.start}
                    </Text>
                    <View style={styles.rowBody}>
                      <Text color={isPast ? 'inkMuted' : 'ink'} numberOfLines={1}>
                        {lesson.subject}
                      </Text>
                      <Text variant="caption" color="inkMuted">
                        {lessonPlace(lesson)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Card>
      </Section>

      <Section title="Дедлайны">
        <Card padded={false}>
          {deadlines.map((deadline, index) => (
            <View key={deadline.id}>
              {index > 0 ? <Divider /> : null}
              <DeadlineRow deadline={deadline} now={now} />
            </View>
          ))}
        </Card>
      </Section>
    </Screen>
  );
}

function UpcomingCard({ upcoming, now }: { upcoming: UpcomingLesson; now: Date }) {
  const { lesson, date, status } = upcoming;
  const minutes = minutesOfDay(now);
  const start = parseTime(lesson.start);
  const end = parseTime(lesson.end);

  let when: string;
  if (status === 'now') {
    when = `Закончится через ${formatDuration(end - minutes)}`;
  } else if (isSameDay(date, now)) {
    when = `Начнётся через ${formatDuration(start - minutes)}`;
  } else if (isSameDay(date, addDays(now, 1))) {
    when = `Завтра · ${lesson.start}`;
  } else {
    when = `${formatDay(date)} · ${lesson.start}`;
  }

  return (
    <Card tone="tint" style={styles.upcoming}>
      {status === 'now' ? (
        <NowBadge />
      ) : (
        <Text variant="label" color="brandTintInk" style={styles.uppercase}>
          Следующая пара
        </Text>
      )}
      <View>
        <Text variant="title">{lesson.subject}</Text>
        <Text>
          {lessonPlace(lesson)} · {lesson.teacher}
        </Text>
      </View>
      {status === 'now' ? (
        <ProgressBar value={(minutes - start) / (end - start)} track="surfaceRaised" />
      ) : null}
      <View style={styles.upcomingFooter}>
        <Text variant="bodyStrong" color="brandTintInk">
          {lesson.start}–{lesson.end}
        </Text>
        <Text variant="caption" color="brandTintInk">
          {when}
        </Text>
      </View>
    </Card>
  );
}

function dueLabel(deadline: Deadline, now: Date) {
  if (deadline.dueInDays === 0) return `Сегодня · ${deadline.dueTime}`;
  if (deadline.dueInDays === 1) return `Завтра · ${deadline.dueTime}`;
  return `${formatDay(addDays(now, deadline.dueInDays))} · ${deadline.dueTime}`;
}

function DeadlineRow({ deadline, now }: { deadline: Deadline; now: Date }) {
  const status = deadlineStatus(deadline);

  return (
    <View style={styles.row}>
      <View style={styles.rowBody}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {deadline.title}
        </Text>
        <Text variant="caption" color="inkMuted" numberOfLines={1}>
          {deadline.subject}
        </Text>
      </View>
      <View style={styles.deadlineMeta}>
        {status === 'done' ? <Status tone="success">Сдано</Status> : null}
        {status === 'overdue' ? <Status tone="danger">Просрочено</Status> : null}
        {status === 'soon' ? <Status tone="warning">Дедлайн скоро</Status> : null}
        <Text variant="caption" color="inkMuted">
          {dueLabel(deadline, now)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.s1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.s2,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  upcoming: {
    gap: Spacing.s3,
  },
  upcomingFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.s2,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  stat: {
    flex: 1,
  },
  statCard: {
    gap: Spacing.s1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBar: {
    height: 18,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  rowTime: {
    width: 48,
  },
  rowBody: {
    flex: 1,
  },
  deadlineMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
