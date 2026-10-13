import {
  GolosText_400Regular,
  GolosText_600SemiBold,
  GolosText_700Bold,
  useFonts,
} from '@expo-google-fonts/golos-text';
import { DefaultTheme, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ChatProvider } from '@/components/chat-store';
import { ScreenMessage } from '@/components/screen-message';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

/** Shown instead of the app when a screen throws while rendering. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // A crash before the fonts are ready would otherwise leave the splash screen up forever.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ScreenMessage
      icon="error"
      title="Что-то пошло не так"
      text={
        __DEV__
          ? error.message
          : 'Попробуйте ещё раз. Если ошибка повторяется, перезапустите приложение.'
      }>
      <Button title="Повторить" onPress={retry} />
    </ScreenMessage>
  );
}

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
