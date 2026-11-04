import { getLocales } from 'expo-localization';

import type { LanguagePreference, Locale } from '@/types';
import { localeFromLanguageCode } from './locale';

/** Kept apart from locale.ts so plain modules (dates, scripts) don't load native code. */
export function deviceLocale(): Locale {
  try {
    return localeFromLanguageCode(getLocales()[0]?.languageCode);
  } catch {
    return 'en';
  }
}

/** The language to use right now for a stored preference. */
export function resolveLocale(preference: LanguagePreference): Locale {
  return preference === 'system' ? deviceLocale() : preference;
}
