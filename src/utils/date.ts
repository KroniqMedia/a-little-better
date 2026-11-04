import { INTL_TAG } from '@/i18n/locale';
import type { Locale } from '@/types';

/**
 * Whole days since 1970-01-01 for the *local* calendar date. Using
 * Date.UTC on local Y/M/D avoids DST and timezone drift, so the value only
 * changes at local midnight.
 */
export function localDayNumber(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

const FALLBACK_NAMES: Record<Locale, { days: string[]; months: string[] }> = {
  en: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  es: {
    days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  },
};

/** "Wednesday, November 4" / "Miércoles, 4 de noviembre". */
export function formatLongDate(date: Date = new Date(), locale: Locale = 'en'): string {
  let text: string;
  try {
    text = new Intl.DateTimeFormat(INTL_TAG[locale], { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
  } catch {
    const { days, months } = FALLBACK_NAMES[locale];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    text = locale === 'es' ? `${day}, ${date.getDate()} de ${month}` : `${day}, ${month} ${date.getDate()}`;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** 12-hour clock in English ("9:00 AM"), 24-hour in Spanish ("9:00", "20:30"). */
export function formatTime(hour: number, minute: number, locale: Locale = 'en'): string {
  const mm = String(minute).padStart(2, '0');
  if (locale === 'es') return `${hour}:${mm}`;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${mm} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** Milliseconds until the next local midnight (+1s margin). */
export function msUntilMidnight(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return next.getTime() - now.getTime();
}

export type GreetingKey = 'night' | 'morning' | 'afternoon' | 'evening';

/**
 * Which greeting fits the hour. Spanish "buenas tardes" runs until about 9pm.
 * `evening` drives the warmer glow on Home and is the same in every language.
 */
export function greeting(date: Date = new Date(), locale: Locale = 'en'): { key: GreetingKey; evening: boolean } {
  const h = date.getHours();
  const evening = h < 5 || h >= 18;
  if (h < 5) return { key: 'night', evening };
  if (h < 12) return { key: 'morning', evening };
  if (h < (locale === 'es' ? 21 : 18)) return { key: 'afternoon', evening };
  return { key: 'evening', evening };
}
