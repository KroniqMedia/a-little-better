import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { isSavedEntry } from '@/services/storage';
import type { Preferences, SavedEntry } from '@/types';

/**
 * Local backups: a small JSON file the person keeps wherever they like
 * (Files, Drive, email to themselves). Nothing is uploaded by the app.
 */
const FORMAT = 'a-little-better-backup';
const VERSION = 1;

/** Settings worth carrying to a new phone. Reminders on/off is left out: it needs permission there. */
export type BackupPreferences = Pick<
  Preferences,
  'notificationHour' | 'notificationMinute' | 'notificationStyle' | 'hapticsEnabled' | 'language' | 'appearance' | 'accent'
>;

export interface Backup {
  favorites: SavedEntry[];
  notForMe: string[];
  helped: string[];
  preferences: Partial<BackupPreferences>;
}

export const backupSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export async function exportBackup(data: Backup, dialogTitle: string): Promise<void> {
  const stamp = new Date().toISOString().slice(0, 10);
  const file = new File(Paths.cache, `a-little-better-backup-${stamp}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify({ format: FORMAT, version: VERSION, exportedAt: Date.now(), ...data }, null, 2));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle });
}

const PREF_CHECKS: { [K in keyof BackupPreferences]: (v: unknown) => boolean } = {
  notificationHour: (v) => Number.isInteger(v) && (v as number) >= 0 && (v as number) < 24,
  notificationMinute: (v) => Number.isInteger(v) && (v as number) >= 0 && (v as number) < 60,
  notificationStyle: (v) => v === 'discreet' || v === 'full',
  hapticsEnabled: (v) => typeof v === 'boolean',
  language: (v) => v === 'system' || v === 'en' || v === 'es',
  appearance: (v) => v === 'system' || v === 'light' || v === 'dark',
  accent: (v) => v === 'sage' || v === 'clay' || v === 'lavender' || v === 'sea',
};

/** Validates parsed JSON; anything unknown or malformed is dropped. Returns null if it isn't a backup. */
export function parseBackup(raw: unknown): Backup | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.format !== FORMAT || typeof obj.version !== 'number' || obj.version > VERSION) return null;

  const favorites = Array.isArray(obj.favorites) ? obj.favorites.filter(isSavedEntry) : [];
  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  const notForMe = strings(obj.notForMe);
  const helped = strings(obj.helped);
  const preferences: Partial<BackupPreferences> = {};
  const source = typeof obj.preferences === 'object' && obj.preferences !== null ? (obj.preferences as Record<string, unknown>) : {};
  for (const key of Object.keys(PREF_CHECKS) as (keyof BackupPreferences)[]) {
    if (PREF_CHECKS[key](source[key])) (preferences as Record<string, unknown>)[key] = source[key];
  }
  return { favorites, notForMe, helped, preferences };
}

/** Opens the system file picker. Returns null if the person cancels; throws if the file isn't a backup. */
export async function pickBackup(): Promise<Backup | null> {
  const picked = await File.pickFileAsync({ mimeTypes: ['application/json', 'text/plain', 'application/octet-stream'] });
  if (picked.canceled) return null;
  const backup = parseBackup(JSON.parse(await picked.result.text()));
  if (!backup) throw new Error('Not an A Little Better backup');
  return backup;
}
