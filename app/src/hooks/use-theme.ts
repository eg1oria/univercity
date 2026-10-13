import { useThemePreference } from '@/components/theme-preference';
import { Colors, type Scheme, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useScheme(): Scheme {
  const system = useColorScheme();
  const { preference } = useThemePreference();

  if (preference !== 'system') {
    return preference;
  }
  return system === 'dark' ? 'dark' : 'light';
}

export function useTheme(): Theme {
  return Colors[useScheme()];
}
