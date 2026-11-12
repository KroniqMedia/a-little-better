import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/** A small, device-only list of message IDs with a React hook. */
export interface IdListStore {
  load(): Promise<void>;
  get(): readonly string[];
  add(id: string): void;
  remove(id: string): void;
  /** Adds several at once (backup restore). Returns how many were new. */
  merge(more: readonly string[]): number;
  clear(): void;
  useIds(): readonly string[];
}

export function createIdListStore(key: string, label: string): IdListStore {
  let ids: readonly string[] = [];
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  const emit = (next: readonly string[]) => {
    ids = next;
    notify();
    AsyncStorage.setItem(key, JSON.stringify(next)).catch((err) => console.warn(`[${label}] could not save`, err));
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const get = () => ids;

  return {
    async load() {
      try {
        const raw = await AsyncStorage.getItem(key);
        const data: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(data)) {
          ids = data.filter((v): v is string => typeof v === 'string');
          notify();
        }
      } catch (err) {
        console.warn(`[${label}] could not load`, err);
      }
    },
    get,
    add(id) {
      if (!ids.includes(id)) emit([...ids, id]);
    },
    remove(id) {
      if (ids.includes(id)) emit(ids.filter((x) => x !== id));
    },
    merge(more) {
      const fresh = more.filter((id, i) => !ids.includes(id) && more.indexOf(id) === i);
      if (fresh.length) emit([...ids, ...fresh]);
      return fresh.length;
    },
    clear() {
      if (ids.length) emit([]);
    },
    useIds() {
      return useSyncExternalStore(subscribe, get, get);
    },
  };
}
