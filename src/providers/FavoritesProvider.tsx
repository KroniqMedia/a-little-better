import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { getMessage } from '@/data/messages';
import { localFavorites, type FavoritesRepository } from '@/services/storage';
import type { Message, SavedEntry } from '@/types';

/** "To come back to" stays a short list on purpose. */
export const MAX_PINNED = 3;

export interface SavedItem {
  message: Message;
  savedAt: number;
  pinned: boolean;
}

interface FavoritesContextValue {
  ready: boolean;
  /** Saved messages, newest first. */
  saved: SavedItem[];
  /** Raw entries, for backups. */
  entries: readonly SavedEntry[];
  isSaved: (id: string) => boolean;
  /** Returns the new saved state. */
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  /** 'full' means MAX_PINNED are already pinned and nothing changed. */
  togglePin: (id: string) => 'pinned' | 'unpinned' | 'full';
  /** Adds entries from a backup (existing ones are kept). Returns how many were new. */
  merge: (incoming: readonly SavedEntry[]) => number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({
  children,
  repository = localFavorites,
}: {
  children: ReactNode;
  repository?: FavoritesRepository;
}) {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [ready, setReady] = useState(false);
  // Mirrors `entries` for synchronous reads in callbacks; written only via commit/load.
  const entriesRef = useRef<SavedEntry[]>([]);

  useEffect(() => {
    let alive = true;
    repository.load().then((loaded) => {
      if (!alive) return;
      // Drop IDs that no longer exist in the library.
      const valid = loaded.filter((e) => getMessage(e.id));
      entriesRef.current = valid;
      setEntries(valid);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [repository]);

  const commit = useCallback(
    (next: SavedEntry[]) => {
      entriesRef.current = next;
      setEntries(next);
      void repository.save(next);
    },
    [repository],
  );

  const ids = useMemo(() => new Set(entries.map((e) => e.id)), [entries]);

  const toggle = useCallback(
    (id: string) => {
      const current = entriesRef.current;
      const exists = current.some((e) => e.id === id);
      commit(exists ? current.filter((e) => e.id !== id) : [{ id, savedAt: Date.now() }, ...current]);
      return !exists;
    },
    [commit],
  );

  const remove = useCallback(
    (id: string) => commit(entriesRef.current.filter((e) => e.id !== id)),
    [commit],
  );

  const togglePin = useCallback(
    (id: string) => {
      const current = entriesRef.current;
      const entry = current.find((e) => e.id === id);
      if (!entry) return 'unpinned' as const;
      if (entry.pinned) {
        commit(current.map((e) => (e.id === id ? { id: e.id, savedAt: e.savedAt } : e)));
        return 'unpinned' as const;
      }
      if (current.filter((e) => e.pinned).length >= MAX_PINNED) return 'full' as const;
      commit(current.map((e) => (e.id === id ? { ...e, pinned: true } : e)));
      return 'pinned' as const;
    },
    [commit],
  );

  const merge = useCallback(
    (incoming: readonly SavedEntry[]) => {
      const current = entriesRef.current;
      const have = new Set(current.map((e) => e.id));
      let pinnedCount = current.filter((e) => e.pinned).length;
      const fresh: SavedEntry[] = [];
      for (const e of incoming) {
        if (have.has(e.id) || !getMessage(e.id)) continue;
        have.add(e.id);
        const pinned = Boolean(e.pinned) && pinnedCount < MAX_PINNED;
        if (pinned) pinnedCount++;
        fresh.push(pinned ? { id: e.id, savedAt: e.savedAt, pinned } : { id: e.id, savedAt: e.savedAt });
      }
      if (fresh.length) commit([...fresh, ...current]);
      return fresh.length;
    },
    [commit],
  );

  const value = useMemo<FavoritesContextValue>(() => {
    const saved = entries
      .map((e) => ({ message: getMessage(e.id), savedAt: e.savedAt, pinned: Boolean(e.pinned) }))
      .filter((s): s is SavedItem => Boolean(s.message))
      .sort((a, b) => b.savedAt - a.savedAt);
    return { ready, saved, entries, isSaved: (id) => ids.has(id), toggle, remove, togglePin, merge };
  }, [entries, ids, ready, toggle, remove, togglePin, merge]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
