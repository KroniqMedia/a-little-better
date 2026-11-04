// Per-weight imports: each package's index pulls in every weight it has (18 TTFs for Inter).
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display/400Regular';
import { DMSerifDisplay_400Regular_Italic } from '@expo-google-fonts/dm-serif-display/400Regular_Italic';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { lightColors } from '@/constants/theme';
import { FavoritesProvider } from '@/providers/FavoritesProvider';
import { PreferencesProvider } from '@/providers/PreferencesProvider';
import { configureNotificationHandler } from '@/services/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 350, fade: true });
configureNotificationHandler();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (error) console.warn('[fonts] failed to load, using system fonts', error);
    if (loaded || error) SplashScreen.hide();
  }, [loaded, error]);

  // Keep the splash up until fonts resolve (they're bundled, so this is quick).
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: lightColors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="category/[id]" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="settings/privacy" />
            <Stack.Screen name="settings/about" />
            <Stack.Screen
              name="share/[id]"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </Stack>
        </FavoritesProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
