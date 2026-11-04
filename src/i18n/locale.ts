import type { Locale } from '@/types';

export const LOCALES: readonly Locale[] = ['en', 'es'];

/** Native names, shown as-is in every language. */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

/** Spanish-speaking devices (any region) get Spanish; everything else English. */
export function localeFromLanguageCode(code: string | null | undefined): Locale {
  return code === 'es' ? 'es' : 'en';
}

/** BCP 47 tag for Intl date formatting. */
export const INTL_TAG: Record<Locale, string> = { en: 'en-US', es: 'es-ES' };
