import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { lessonPlace, NowBadge } from '@/components/lesson-card';
import { Card, Divider } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { currentOrNextLesson, lessonsOn, type UpcomingLesson } from '@/data/mock';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import {
  addDays,
  formatDay,
  formatDuration,
  isSameDay,
  minutesOfDay,
  parseTime,
} from '@/lib/date';

const SHORTCUTS: { icon: IconName; label: string; href: Href }[] = [
  { icon: 'document', label: 'Документы', href: '/documents' },
  { icon: 'calendar', label: 'Расписание', href: '/schedule' },
  { icon: 'transcript', label: 'Транскрипт', href: '/transcript' },
  { icon: 'journal', label: 'Журнал', href: '/grades' },
  { icon: 'calculator', label: 'Калькулятор GPA', href: '/gpa-calculator' },
  { icon: 'qr', label: 'QR-сканер', href: '/qr' },
  { icon: 'chat', label: 'Чаты', href: '/chats' },
  { icon: 'settings', label: 'Настройки', href: '/settings' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const now = useNow();
  const upcoming = currentOrNextLesson(now);

  return (
    <Screen>
      <Text variant="title" style={styles.title}>
        Главная
      </Text>

      <View style={styles.shortcuts}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable
            key={shortcut.label}
            accessibilityRole="button"
            accessibilityLabel={shortcut.label}
            onPress={() => router.navigate(shortcut.href)}
            style={styles.shortcut}>
            {({ pressed }) => (
              <>
                <View
                  style={[
                    styles.shortcutIcon,
                    {
                      backgroundColor: pressed ? theme.surfaceSunken : theme.surfaceRaised,
                      borderColor: theme.border,
                    },
                  ]}>
                  <Icon name={shortcut.icon} size={24} color={theme.brand} />
                </View>
                <Text variant="caption" numberOfLines={2} style={styles.shortcutLabel}>
                  {shortcut.label}
                </Text>
              </>
            )}
          </Pressable>
        ))}
      </View>

      {upcoming ? <UpcomingCard upcoming={upcoming} now={now} /> : null}

      <Section
        title="Расписание"
        action={
          <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.navigate('/schedule')}>
            <Text variant="bodyStrong" color="brand">
              Вся неделя
            </Text>
          </Pressable>
        }>
        <DayLessons title="Сегодня" date={now} now={now} />
        <DayLessons title="Завтра" date={addDays(now, 1)} now={now} />
      </Section>
    </Screen>
  );
}

/** The lesson in progress or the nearest one: a single quiet row with the time on the left. */
function UpcomingCard({ upcoming, now }: { upcoming: UpcomingLesson; now: Date }) {
  const theme = useTheme();
  const { lesson, date, status } = upcoming;
  const minutes = minutesOfDay(now);
  const start = parseTime(lesson.start);
  const end = parseTime(lesson.end);

  let when: string;
  if (status === 'now') {
    when = `ещё ${formatDuration(end - minutes)}`;
  } else if (isSameDay(date, now)) {
    when = `через ${formatDuration(start - minutes)}`;
  } else if (isSameDay(date, addDays(now, 1))) {
    when = 'Завтра';
  } else {
    when = formatDay(date);
  }

  return (
    <Card padded={false}>
      <View style={styles.upcoming}>
        <View style={styles.upcomingHeader}>
          {status === 'now' ? (
            <NowBadge />
          ) : (
            <Text variant="label" color="inkMuted" style={styles.uppercase}>
              Следующая пара
            </Text>
          )}
          <Text variant="caption" color="inkMuted">
            {when}
          </Text>
        </View>
        <View style={styles.upcomingLesson}>
          <View style={styles.rowTime}>
            <Text variant="bodyStrong">{lesson.start}</Text>
            <Text variant="caption" color="inkMuted">
              {lesson.end}
            </Text>
          </View>
          <View style={styles.rowBody}>
            <Text variant="heading">{lesson.subject}</Text>
            <Text variant="caption" color="inkMuted">
              {lessonPlace(lesson)} · {lesson.teacher}
            </Text>
          </View>
        </View>
      </View>
      {status === 'now' ? (
        // A hairline of progress along the bottom edge of the card.
        <View style={[styles.upcomingTrack, { backgroundColor: theme.surfaceSunken }]}>
          <View
            style={[
              styles.upcomingProgress,
              { width: `${((minutes - start) / (end - start)) * 100}%`, backgroundColor: theme.sky },
            ]}
          />
        </View>
      ) : null}
    </Card>
  );
}

/** One day of the schedule; lessons that are already over are muted. */
function DayLessons({ title, date, now }: { title: string; date: Date; now: Date }) {
  const lessons = lessonsOn(date);
  const minutes = isSameDay(date, now) ? minutesOfDay(now) : -1;

  return (
    <View style={styles.day}>
      <Text variant="label" color="inkMuted" style={styles.uppercase}>
        {title} · {formatDay(date)}
      </Text>
      <Card padded={false}>
        {lessons.length === 0 ? (
          <View style={styles.row}>
            <Text color="inkMuted">Пар нет</Text>
          </View>
        ) : (
          lessons.map((lesson, index) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  shortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.s4,
  },
  shortcut: {
    // Four in a row; the fifth and later wrap to the next line.
    width: '25%',
    alignItems: 'center',
    gap: 6,
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  upcoming: {
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s2,
  },
  upcomingLesson: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  upcomingTrack: {
    height: 3,
  },
  upcomingProgress: {
    height: '100%',
  },
  day: {
    gap: Spacing.s2,
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
});
