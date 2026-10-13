import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatusTone = 'success' | 'warning' | 'danger';

const STATUS_ICON: Record<StatusTone, IconName> = {
  success: 'check',
  warning: 'warning',
  danger: 'error',
};

/** A status is always a word with an icon — colour alone is only a hint. */
export function Status({ tone, children }: { tone: StatusTone; children: string }) {
  const theme = useTheme();

  return (
    <View style={styles.status}>
      <Icon name={STATUS_ICON[tone]} size={14} color={theme[tone]} />
      <Text variant="label" color={tone}>
        {children}
      </Text>
    </View>
  );
}

type BadgeProps = {
  children: string;
  background?: ThemeColor;
  color?: ThemeColor;
};

export function Badge({ children, background = 'brandTint', color = 'brandTintInk' }: BadgeProps) {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme[background] }]}>
      <Text variant="label" color={color}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.s2,
    paddingVertical: 2,
  },
});
