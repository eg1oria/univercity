import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import type { Lesson } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

/** «Лекция · ауд. 304» — rooms with a name («Спортзал») go without the prefix. */
export function lessonPlace(lesson: Lesson) {
  const room = /^\d/.test(lesson.room) ? `ауд. ${lesson.room}` : lesson.room;
  return `${lesson.type} · ${room}`;
}

export function NowBadge() {
  const theme = useTheme();

  return (
    <View style={styles.now}>
      <View style={[styles.nowDot, { backgroundColor: theme.sky }]} />
      <Text variant="label" color="brandTintInk" style={styles.uppercase}>
        Сейчас
      </Text>
    </View>
  );
}

export function LessonCard({ lesson, isNow = false }: { lesson: Lesson; isNow?: boolean }) {
  const theme = useTheme();

  return (
    <Card tone={isNow ? 'tint' : 'raised'} style={styles.card}>
      <View style={styles.time}>
        <Text variant="bodyStrong">{lesson.start}</Text>
        <Text variant="caption" color="inkMuted">
          {lesson.end}
        </Text>
      </View>
      <View
        style={[styles.rule, { backgroundColor: isNow ? theme.sky : theme.border }]}
      />
      <View style={styles.body}>
        {isNow ? <NowBadge /> : null}
        <Text variant="heading">{lesson.subject}</Text>
        <Text color="inkMuted">{lessonPlace(lesson)}</Text>
        <Text variant="caption" color="inkMuted">
          {lesson.teacher}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  time: {
    width: 44,
  },
  rule: {
    width: 2,
    borderRadius: Radius.pill,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  now: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
