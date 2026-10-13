import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & {
  /** `tint` is the quiet highlight: the lesson in progress, an info note. */
  tone?: 'raised' | 'tint';
  padded?: boolean;
};

export function Card({ tone = 'raised', padded = true, style, ...rest }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        tone === 'tint'
          ? { backgroundColor: theme.brandTint, borderColor: theme.brandTint }
          : { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
        style,
      ]}
      {...rest}
    />
  );
}

export function Divider() {
  const theme = useTheme();

  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.s4,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.s4,
  },
});
