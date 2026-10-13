import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** «Иванова А. С.» → «ИА», a single word such as the group «ИС-23-1» → «ИС». */
function initials(name: string) {
  const words = name.split(/[\s-]+/).filter((part) => /^[A-Za-zА-Яа-яЁё]/.test(part));
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const theme = useTheme();

  return (
    <View
      style={[styles.avatar, { width: size, height: size, backgroundColor: theme.brandTint }]}>
      <Text variant={size >= 56 ? 'heading' : 'bodyStrong'} color="brandTintInk">
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
