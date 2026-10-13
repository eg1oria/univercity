import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** `sky` is the data colour: attendance, grades, the lesson in progress. */
export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme();
  const percent = Math.max(0, Math.min(1, value)) * 100;

  return (
    <View style={[styles.track, { backgroundColor: theme.surfaceSunken }]}>
      <View style={[styles.fill, { width: `${percent}%`, backgroundColor: theme.sky }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
