import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
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

const styles = StyleSheet.create({
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
