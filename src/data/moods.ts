import { STRINGS } from '@/i18n/strings';
import type { CategoryId, Locale } from '@/types';

export type MoodId = 'good' | 'down' | 'overwhelmed' | 'nervous' | 'unsure' | 'stuck';

export interface Mood {
  id: MoodId;
  /** Short label under the face. */
  label: string;
  /** Used in sentences: "You're feeling {phrase} today." */
  phrase: string;
  /** Collection that answers this feeling. */
  category: CategoryId;
  /** Warm, validating reply shown at the top of the collection. */
  reply: string;
}

/** Face order and the collection each feeling opens. Text lives in i18n/strings. */
const MOOD_CATEGORIES: readonly (readonly [MoodId, CategoryId])[] = [
  ['good', 'perspective'],
  ['down', 'hope'],
  ['overwhelmed', 'comfort'],
  ['nervous', 'courage'],
  ['unsure', 'confidence'],
  ['stuck', 'fresh-start'],
];

const cache = new Map<Locale, readonly Mood[]>();

export function getMoods(locale: Locale = 'en'): readonly Mood[] {
  let moods = cache.get(locale);
  if (!moods) {
    moods = MOOD_CATEGORIES.map(([id, category]) => ({ id, category, ...STRINGS[locale].moods[id] }));
    cache.set(locale, moods);
  }
  return moods;
}

export function getMood(id: string | undefined, locale: Locale = 'en'): Mood | undefined {
  return id ? getMoods(locale).find((m) => m.id === id) : undefined;
}
