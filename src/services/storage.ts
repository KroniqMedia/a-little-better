import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Preferences, SavedEntry } from '@/types';

/**
 * Persistence boundary. Screens never talk to AsyncStorage directly; they use
 * these repositories through providers. To add cloud sync later, implement
 * the same interfaces with Supabase (see services/sync.ts) and compose them.
 */
export interface FavoritesRepository {
  load(): Promise<SavedEntry[]>;
  save(entries: SavedEntry[]): Promise<void>;
}

export interface PreferencesRepository {
  load(): Promise<Preferences>;
  save(prefs: Preferences): Promise<void>;
}

const KEYS = {
  favorites: 'alb:favorites:v1',
  preferences: 'alb:preferences:v1',
} as const;

export const DEFAULT_PREFERENCES: Preferences = {
  notificationsEnabled: false,
  notificationHour: 9,
  notificationMinute: 0,
  notificationStyle: 'discreet',
  hapticsEnabled: true,
  language: 'system',
  appearance: 'system',
  accent: 'sage',
  welcomed: false,
  hasTried: false,
  reminderAsked: false,
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.warn(`[storage] could not read ${key}`, err);
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] could not write ${key}`, err);
  }
}

export function isSavedEntry(v: unknown): v is SavedEntry {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as SavedEntry).id === 'string' &&
    typeof (v as SavedEntry).savedAt === 'number' &&
    ((v as SavedEntry).pinned === undefined || typeof (v as SavedEntry).pinned === 'boolean')
  );
}

export const localFavorites: FavoritesRepository = {
  async load() {
    const data = await readJson<unknown>(KEYS.favorites);
    return Array.isArray(data) ? data.filter(isSavedEntry) : [];
  },
  save: (entries) => writeJson(KEYS.favorites, entries),
};

export const localPreferences: PreferencesRepository = {
  async load() {
    const data = await readJson<Partial<Preferences>>(KEYS.preferences);
    return { ...DEFAULT_PREFERENCES, ...(data ?? {}) };
  },
  save: (prefs) => writeJson(KEYS.preferences, prefs),
};
