import { createContext, useContext, useState, type ReactNode } from 'react';
import { Appearance, Platform } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemePreferenceValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceValue>({
  preference: 'system',
  setPreference: () => {},
});

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    // Keeps the keyboard and system dialogs in the same theme as the app.
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(next === 'system' ? 'unspecified' : next);
    }
  };

  return (
    <ThemePreferenceContext value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext>
  );
}

export function useThemePreference() {
  return useContext(ThemePreferenceContext);
}
