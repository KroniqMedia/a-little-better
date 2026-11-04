import { useLocales } from 'expo-localization';

import { localeFromLanguageCode } from '@/i18n/locale';
import { STRINGS, type Strings } from '@/i18n/strings';
import { usePreferences } from '@/providers/PreferencesProvider';
import type { Locale } from '@/types';

/**
 * The active language and its strings. Follows the device language unless the
 * person picked one in Settings, and updates live if either changes.
 */
export function useI18n(): { locale: Locale; t: Strings } {
  const { prefs } = usePreferences();
  const [device] = useLocales();
  const locale = prefs.language === 'system' ? localeFromLanguageCode(device?.languageCode) : prefs.language;
  return { locale, t: STRINGS[locale] };
}
