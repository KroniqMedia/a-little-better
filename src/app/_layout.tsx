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
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useDailyMessage } from '@/hooks/useDailyMessage';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { FavoritesProvider } from '@/providers/FavoritesProvider';
import { PreferencesProvider, usePreferences } from '@/providers/PreferencesProvider';
import { loadHelped } from '@/services/helped';
import { loadNotForMe } from '@/services/notForMe';
import { configureNotificationHandler } from '@/services/notifications';
import { loadPlus } from '@/services/purchases';
import { syncDailyWidget } from '@/services/widget';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 350, fade: true });
configureNotificationHandler();
void loadNotForMe();
void loadHelped();
void loadPlus();

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
  }, [error]);

  // Keep the splash up until fonts resolve (they're bundled, so this is quick).
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <AppStack />
        </FavoritesProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

/** Waits for saved preferences, so the first screen (welcome or home) and the theme are right from the start. */
function AppStack() {
  const { ready, prefs } = usePreferences();
  const { colors, scheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const { locale } = useI18n();
  const { date } = useDailyMessage();

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // Keep the home-screen widget on today's message, in the app's language.
  useEffect(() => {
    if (ready) syncDailyWidget(locale, date);
  }, [ready, locale, date]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduceMotion ? 'fade' : 'slide_from_right',
        }}
      >
        <Stack.Protected guard={prefs.welcomed} redirectTo="/welcome">
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="category/[id]" />
          <Stack.Screen name="moment" />
          <Stack.Screen name="settings/index" />
          <Stack.Screen name="settings/privacy" />
          <Stack.Screen name="settings/about" />
          <Stack.Screen name="settings/plus" />
          <Stack.Screen
            name="share/[id]"
            options={{ presentation: 'modal', animation: reduceMotion ? 'fade' : 'slide_from_bottom' }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!prefs.welcomed} redirectTo="/">
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
