import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  /** `primary` is the filled `brand` button — at most one per screen. */
  variant?: 'primary' | 'secondary';
};

export function Button({ title, variant = 'primary', disabled, ...rest }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary
          ? { backgroundColor: pressed ? theme.brandHover : theme.brand }
          : { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
        disabled && styles.disabled,
      ]}
      {...rest}>
      <Text variant="bodyStrong" color={primary ? 'onBrand' : 'brand'}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.s4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
