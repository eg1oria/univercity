import {
  GolosText_400Regular,
  GolosText_600SemiBold,
  GolosText_700Bold,
  useFonts,
} from '@expo-google-fonts/golos-text';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ChatProvider } from '@/components/chat-store';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GolosText_400Regular,
    GolosText_600SemiBold,
    GolosText_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ChatProvider>
      <Navigation />
    </ChatProvider>
  );
}

function Navigation() {
  const theme = useTheme();

  return (
    <ThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: theme.brand,
          background: theme.surface,
          card: theme.surfaceRaised,
          text: theme.ink,
          border: theme.border,
          notification: theme.danger,
        },
      }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.surface } }} />
    </ThemeProvider>
  );
}
