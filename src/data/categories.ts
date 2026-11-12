import { STRINGS } from '@/i18n/strings';
import type { Category, CategoryId, ColorSchemeName, Locale } from '@/types';

type Colors = { tint: string; ink: string };

/** The six collections, in display order, with their colors per scheme. Text lives in i18n/strings. */
const COLLECTIONS: readonly (readonly [CategoryId, Record<ColorSchemeName, Colors>])[] = [
  ['confidence', { light: { tint: '#F2E6DC', ink: '#B47E66' }, dark: { tint: '#3A302A', ink: '#D9A88F' } }],
  ['hope', { light: { tint: '#E8ECE2', ink: '#76846E' }, dark: { tint: '#2E332B', ink: '#A9B89F' } }],
  ['comfort', { light: { tint: '#EEE7DF', ink: '#968470' }, dark: { tint: '#35302A', ink: '#C4AE97' } }],
  ['fresh-start', { light: { tint: '#E3E9E5', ink: '#6A867B' }, dark: { tint: '#2A322E', ink: '#9BBCAF' } }],
  ['perspective', { light: { tint: '#F2EBDE', ink: '#A88D5E' }, dark: { tint: '#37322A', ink: '#D2B987' } }],
  ['courage', { light: { tint: '#EEE2DC', ink: '#A06F5B' }, dark: { tint: '#382D29', ink: '#D39E88' } }],
];

const cache = new Map<string, readonly Category[]>();

export function getCategories(locale: Locale = 'en', scheme: ColorSchemeName = 'light'): readonly Category[] {
  const key = `${locale}:${scheme}`;
  let list = cache.get(key);
  if (!list) {
    list = COLLECTIONS.map(([id, colors]) => ({ id, ...colors[scheme], ...STRINGS[locale].categories[id] }));
    cache.set(key, list);
  }
  return list;
}

export function getCategory(id: string, locale: Locale = 'en', scheme: ColorSchemeName = 'light'): Category | undefined {
  return getCategories(locale, scheme).find((c) => c.id === id);
}

export function isCategoryId(id: string): id is CategoryId {
  return COLLECTIONS.some(([c]) => c === id);
}
