import { STRINGS } from '@/i18n/strings';
import type { Category, CategoryId, Locale } from '@/types';

/** The six collections, in display order, with their colors. Text lives in i18n/strings. */
const COLLECTIONS: readonly (readonly [CategoryId, { tint: string; ink: string }])[] = [
  ['confidence', { tint: '#F2E6DC', ink: '#B47E66' }],
  ['hope', { tint: '#E8ECE2', ink: '#76846E' }],
  ['comfort', { tint: '#EEE7DF', ink: '#968470' }],
  ['fresh-start', { tint: '#E3E9E5', ink: '#6A867B' }],
  ['perspective', { tint: '#F2EBDE', ink: '#A88D5E' }],
  ['courage', { tint: '#EEE2DC', ink: '#A06F5B' }],
];

const cache = new Map<Locale, readonly Category[]>();

export function getCategories(locale: Locale = 'en'): readonly Category[] {
  let list = cache.get(locale);
  if (!list) {
    list = COLLECTIONS.map(([id, colors]) => ({ id, ...colors, ...STRINGS[locale].categories[id] }));
    cache.set(locale, list);
  }
  return list;
}

export function getCategory(id: string, locale: Locale = 'en'): Category | undefined {
  return getCategories(locale).find((c) => c.id === id);
}

export function isCategoryId(id: string): id is CategoryId {
  return COLLECTIONS.some(([c]) => c === id);
}
