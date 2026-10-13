import * as Haptics from 'expo-haptics';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BAR_HEIGHT = 58;
const QR_SIZE = 64;
/** How far the QR button rises above the bar; screens leave this much room at the bottom. */
export const TabBarOverhang = 22;

export function TabBar({ children, ...props }: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={styles.wrapper}>
      <View
        style={[
          styles.background,
          { backgroundColor: theme.surfaceRaised, borderTopColor: theme.border },
        ]}
      />
      <View style={[styles.row, { paddingBottom: insets.bottom }]}>{children}</View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  label: string;
};

export function TabButton({ icon, label, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.tab}>
      <View style={[styles.iconPill, isFocused && { backgroundColor: theme.brandTint }]}>
        <Icon name={icon} size={22} color={isFocused ? theme.brandTintInk : theme.inkMuted} />
      </View>
      <Text
        variant="label"
        color={isFocused ? 'brand' : 'inkMuted'}
        numberOfLines={1}
        style={styles.tabLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * The centre action: the only filled `brand` control, raised out of the bar.
 * On the scanner itself it switches to the tint, like any other selected tab,
 * so the screen's own primary button stays the single `brand` fill.
 */
export function QrTabButton({ isFocused, onPress, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      onPress={(event) => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(event);
      }}
      accessibilityRole="tab"
      accessibilityLabel="Сканировать QR"
      accessibilityState={{ selected: isFocused }}
      style={styles.qrSlot}>
      {({ pressed }) => (
        <View
          style={[
            styles.qr,
            {
              backgroundColor: isFocused
                ? theme.brandTint
                : pressed
                  ? theme.brandHover
                  : theme.brand,
              borderColor: theme.surfaceRaised,
            },
          ]}>
          <Icon name="qr" size={28} color={isFocused ? theme.brandTintInk : theme.onBrand} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Overlaps the screen by the overhang so the raised button stays tappable on Android.
    marginTop: -TabBarOverhang,
    pointerEvents: 'box-none',
  },
  background: {
    position: 'absolute',
    top: TabBarOverhang,
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    pointerEvents: 'box-none',
  },
  tab: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconPill: {
    width: 52,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  qrSlot: {
    flex: 1,
    height: BAR_HEIGHT + TabBarOverhang,
    alignItems: 'center',
  },
  qr: {
    width: QR_SIZE,
    height: QR_SIZE,
    borderRadius: Radius.pill,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
