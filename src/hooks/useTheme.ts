import { useColorScheme } from 'react-native';

import { getTheme, type Theme } from '@/constants/theme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { usePlus } from '@/services/purchases';

/**
 * Single access point for theme tokens. Follows the device's light/dark
 * setting unless the person picked one in Settings. The accent colour is an
 * A Little Better+ choice, so without it the default accent is used.
 */
export function useTheme(): Theme {
  const { prefs } = usePreferences();
  const plus = usePlus();
  const device = useColorScheme();
  const scheme = prefs.appearance === 'system' ? (device === 'dark' ? 'dark' : 'light') : prefs.appearance;
  return getTheme(scheme, plus ? prefs.accent : 'sage');
}
