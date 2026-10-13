import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { lessonPlace, NowBadge } from '@/components/lesson-card';
import { Card, Divider } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { lessonsOn, semester } from '@/data/mock';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatDay, formatRange, isSameDay, parseTime, startOfStudyWeek } from '@/lib/date';
import { plural } from '@/lib/plural';

const STUDY_DAYS = 6;
const WEEK_SIZE = 44;
const WEEK_GAP = Spacing.s2;
const DAY_MS = 24 * 60 * 60 * 1000;

const WEEKS = Array.from({ length: semester.weeks }, (_, index) => index + 1);

/** Number of the study week the date falls into; outside 1…15 between semesters. */
function weekOf(date: Date) {
  const days = Math.round((startOfStudyWeek(date).getTime() - semester.start.getTime()) / DAY_MS);
  return Math.floor(days / 7) + 1;
}

/** '11:20' on the given day as a moment in time. */
function timeOn(day: Date, time: string) {
  const moment = new Date(day);
  moment.setHours(0, parseTime(time), 0, 0);
  return moment;
}

export default function ScheduleScreen() {
  const theme = useTheme();
  const now = useNow();
  const currentWeek = weekOf(now);
  const inSemester = currentWeek >= 1 && currentWeek <= semester.weeks;
  const [week, setWeek] = useState(Math.min(Math.max(currentWeek, 1), semester.weeks));
  const strip = useRef<ScrollView>(null);

  const weekStart = addDays(semester.start, (week - 1) * 7);
  const days = Array.from({ length: STUDY_DAYS }, (_, index) => addDays(weekStart, index));

  // Keeps two earlier weeks in view to the left of the given one.
  const scrollToWeek = (target: number, animated: boolean) => {
    strip.current?.scrollTo({
      x: Math.max(0, (target - 3) * (WEEK_SIZE + WEEK_GAP)),
      animated,
    });
  };

  return (
    <Screen>
      <View style={styles.intro}>
        <View style={styles.titleRow}>
          <Text variant="title">Расписание</Text>
          {inSemester && week !== currentWeek ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                setWeek(currentWeek);
                scrollToWeek(currentWeek, true);
              }}>
              <Text variant="bodyStrong" color="brand">
                К текущей неделе
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text color="inkMuted">
          Неделя {week} из {semester.weeks} · {formatRange(days[0], days[STUDY_DAYS - 1])}
        </Text>
      </View>

      <ScrollView
        ref={strip}
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        onLayout={() => scrollToWeek(week, false)}
        style={styles.weeks}
        contentContainerStyle={styles.weeksContent}>
        {WEEKS.map((item) => {
          const isSelected = item === week;
          return (
            <Pressable
              key={item}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Неделя ${item}`}
              onPress={() => setWeek(item)}
              style={[
                styles.week,
                isSelected
                  ? { backgroundColor: theme.brandTint, borderColor: theme.brandTint }
                  : { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
              ]}>
              <Text variant="heading" color={isSelected ? 'brandTintInk' : 'ink'}>
                {item}
              </Text>
              <View
                style={[
                  styles.currentDot,
                  inSemester && item === currentWeek && { backgroundColor: theme.brand },
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {days.map((day) => (
        <Day key={day.getTime()} day={day} now={now} />
      ))}
    </Screen>
  );
}

function Day({ day, now }: { day: Date; now: Date }) {
  const theme = useTheme();
  const lessons = lessonsOn(day);
  const isToday = isSameDay(day, now);

  return (
    <View style={styles.day}>
      <View style={styles.dayHeader}>
        <Text variant="label" color={isToday ? 'brand' : 'inkMuted'} style={styles.uppercase}>
          {isToday ? `Сегодня · ${formatDay(day)}` : formatDay(day)}
        </Text>
        {lessons.length > 0 ? (
          <Text variant="caption" color="inkMuted">
            {lessons.length} {plural(lessons.length, ['пара', 'пары', 'пар'])}
          </Text>
        ) : null}
      </View>
      <Card padded={false}>
        {lessons.length === 0 ? (
          <View style={styles.row}>
            <Text color="inkMuted">Пар нет</Text>
          </View>
        ) : (
          lessons.map((lesson, index) => {
            const isPast = now >= timeOn(day, lesson.end);
            const isNow = !isPast && now >= timeOn(day, lesson.start);
            return (
              <View key={lesson.id}>
                {index > 0 ? <Divider /> : null}
                <View style={[styles.row, isNow && { backgroundColor: theme.brandTint }]}>
                  <View style={styles.time}>
                    <Text variant="bodyStrong" color={isPast ? 'inkMuted' : 'ink'}>
                      {lesson.start}
                    </Text>
                    <Text variant="caption" color="inkMuted">
                      {lesson.end}
                    </Text>
                  </View>
                  <View style={styles.rowBody}>
                    {isNow ? <NowBadge /> : null}
                    <Text variant="bodyStrong" color={isPast ? 'inkMuted' : 'ink'}>
                      {lesson.subject}
                    </Text>
                    <Text variant="caption" color={isNow ? 'ink' : 'inkMuted'}>
                      {lessonPlace(lesson)} · {lesson.teacher}
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
  intro: {
    gap: Spacing.s1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  weeks: {
    // The strip scrolls edge to edge, past the screen's side padding.
    marginHorizontal: -Spacing.s4,
    flexGrow: 0,
  },
  weeksContent: {
    paddingHorizontal: Spacing.s4,
    gap: WEEK_GAP,
  },
  week: {
    width: WEEK_SIZE,
    paddingTop: Spacing.s2,
    paddingBottom: 6,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  currentDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.pill,
  },
  day: {
    gap: Spacing.s2,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  time: {
    width: 48,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
});
