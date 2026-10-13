import { Colors, type Theme } from '@/constants/theme';

/** The app has a single light theme; components read its colours through this hook. */
export function useTheme(): Theme {
  return Colors;
}
