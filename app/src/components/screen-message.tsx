import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenMessageProps = {
  icon: IconName;
  title: string;
  text: string;
  /** Buttons under the text. */
  children: ReactNode;
};

/** A whole screen given to one message: a missing page, a crash. */
export function ScreenMessage({ icon, title, text, children }: ScreenMessageProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.surface,
          paddingTop: insets.top + Spacing.s6,
          paddingBottom: insets.bottom + Spacing.s6,
        },
      ]}>
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: theme.brandTint }]}>
          <Icon name={icon} size={28} color={theme.brandTintInk} />
        </View>
        <View style={styles.texts}>
          <Text variant="title" style={styles.centered}>
            {title}
          </Text>
          <Text color="inkMuted" style={styles.centered}>
            {text}
          </Text>
        </View>
        <View style={styles.actions}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.s6,
  },
  icon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    gap: Spacing.s2,
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.s2,
  },
});
