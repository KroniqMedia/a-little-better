import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { getMessage } from '@/data/messages';
import { localFavorites, type FavoritesRepository } from '@/services/storage';
import type { Message, SavedEntry } from '@/types';

interface FavoritesContextValue {
  ready: boolean;
  /** Saved messages, newest first. */
  saved: { message: Message; savedAt: number }[];
  isSaved: (id: string) => boolean;
  /** Returns the new saved state. */
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
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

  const value = useMemo<FavoritesContextValue>(() => {
    const saved = entries
      .map((e) => ({ message: getMessage(e.id), savedAt: e.savedAt }))
      .filter((s): s is { message: Message; savedAt: number } => Boolean(s.message))
      .sort((a, b) => b.savedAt - a.savedAt);
    return { ready, saved, isSaved: (id) => ids.has(id), toggle, remove };
  }, [entries, ids, ready, toggle, remove]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
