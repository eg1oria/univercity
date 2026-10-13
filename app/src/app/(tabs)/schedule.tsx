import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson-card';
import { Card } from '@/components/ui/card';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { lessonsOn } from '@/data/mock';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import {
  addDays,
  formatDay,
  formatRange,
  isSameDay,
  minutesOfDay,
  parseTime,
  startOfStudyWeek,
  weekdayShort,
} from '@/lib/date';
import { plural } from '@/lib/plural';

const STUDY_DAYS = 6;

export default function ScheduleScreen() {
  const theme = useTheme();
  const now = useNow();
  const weekStart = startOfStudyWeek(now);
  const days = Array.from({ length: STUDY_DAYS }, (_, index) => addDays(weekStart, index));
  const todayIndex = days.findIndex((day) => isSameDay(day, now));
  const [selected, setSelected] = useState(Math.max(todayIndex, 0));

  const day = days[selected];
  const lessons = lessonsOn(day);
  const minutes = minutesOfDay(now);

  return (
    <Screen>
      <View style={styles.intro}>
        <Text variant="title">Расписание</Text>
        <Text color="inkMuted">Неделя {formatRange(days[0], days[STUDY_DAYS - 1])}</Text>
      </View>

      <View style={styles.days} accessibilityRole="tablist">
        {days.map((item, index) => {
          const isSelected = index === selected;
          const isToday = index === todayIndex;
          return (
            <Pressable
              key={item.getTime()}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={formatDay(item)}
              onPress={() => setSelected(index)}
              style={[
                styles.day,
                isSelected
                  ? { backgroundColor: theme.brandTint, borderColor: theme.brandTint }
                  : { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
              ]}>
              <Text
                variant="label"
                color={isSelected ? 'brandTintInk' : 'inkMuted'}
                style={styles.uppercase}>
                {weekdayShort(item)}
              </Text>
              <Text variant="heading" color={isSelected ? 'brandTintInk' : 'ink'}>
                {item.getDate()}
              </Text>
              <View
                style={[styles.todayDot, isToday && { backgroundColor: theme.brand }]}
              />
            </Pressable>
          );
        })}
      </View>

      <Section
        title={selected === todayIndex ? `Сегодня, ${formatDay(day)}` : formatDay(day)}
        action={
          lessons.length > 0 ? (
            <Text variant="caption" color="inkMuted">
              {lessons.length} {plural(lessons.length, ['пара', 'пары', 'пар'])}
            </Text>
          ) : null
        }>
        {lessons.length === 0 ? (
          <Card style={styles.empty}>
            <Text variant="heading">Пар нет</Text>
            <Text color="inkMuted" style={styles.centered}>
              В этот день занятий по расписанию нет.
            </Text>
          </Card>
        ) : (
          <View style={styles.lessons}>
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isNow={
                  selected === todayIndex &&
                  minutes >= parseTime(lesson.start) &&
                  minutes < parseTime(lesson.end)
                }
              />
            ))}
          </View>
        )}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.s1,
  },
  days: {
    flexDirection: 'row',
    gap: Spacing.s2,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s2,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.pill,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  lessons: {
    gap: Spacing.s3,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.s1,
    paddingVertical: Spacing.s8,
  },
  centered: {
    textAlign: 'center',
  },
});
