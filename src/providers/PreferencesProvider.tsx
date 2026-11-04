import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  cancelDailyReminders,
  ensureDailyReminders,
  requestPermission,
  scheduleDailyReminders,
  type PermissionResult,
} from '@/services/notifications';
import { resolveLocale } from '@/i18n/device';
import { DEFAULT_PREFERENCES, localPreferences, type PreferencesRepository } from '@/services/storage';
import type { LanguagePreference, Preferences } from '@/types';

interface PreferencesContextValue {
  ready: boolean;
  prefs: Preferences;
  setHaptics: (enabled: boolean) => void;
  /** Turns reminders on (asking permission if needed) or off. */
  setNotificationsEnabled: (enabled: boolean) => Promise<PermissionResult | 'off'>;
  setNotificationTime: (hour: number, minute: number) => Promise<void>;
  /** Switches language; pending reminders are rewritten in the new language. */
  setLanguage: (language: LanguagePreference) => Promise<void>;
}

/** Keeps reminder bookkeeping off the critical path at launch. */
const TOP_UP_DELAY_MS = 1500;

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({
  children,
  repository = localPreferences,
}: {
  children: ReactNode;
  repository?: PreferencesRepository;
}) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);
  // Mirrors `prefs` for synchronous reads in callbacks; written only via commit/load.
  const prefsRef = useRef<Preferences>(DEFAULT_PREFERENCES);

  const commit = useCallback(
    (patch: Partial<Preferences>) => {
      const next = { ...prefsRef.current, ...patch };
      prefsRef.current = next;
      setPrefs(next);
      void repository.save(next);
      return next;
    },
    [repository],
  );

  useEffect(() => {
    let alive = true;
    let topUp: ReturnType<typeof setTimeout> | undefined;
    repository.load().then((loaded) => {
      if (!alive) return;
      prefsRef.current = loaded;
      setPrefs(loaded);
      setReady(true);
      // Top up the rolling reminder window, once launch animations have
      // settled. If the user revoked permission in system settings, reflect
      // that here.
      if (loaded.notificationsEnabled) {
        topUp = setTimeout(async () => {
          const ok = await ensureDailyReminders(
            loaded.notificationHour,
            loaded.notificationMinute,
            resolveLocale(loaded.language),
          );
          if (!ok && alive) commit({ notificationsEnabled: false });
        }, TOP_UP_DELAY_MS);
      }
    });
    return () => {
      alive = false;
      clearTimeout(topUp);
    };
  }, [repository, commit]);

  const setHaptics = useCallback((enabled: boolean) => void commit({ hapticsEnabled: enabled }), [commit]);

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      if (!enabled) {
        commit({ notificationsEnabled: false });
        await cancelDailyReminders();
        return 'off' as const;
      }
      const permission = await requestPermission();
      if (permission !== 'granted') {
        commit({ notificationsEnabled: false });
        return permission;
      }
      const next = commit({ notificationsEnabled: true });
      const ok = await scheduleDailyReminders(next.notificationHour, next.notificationMinute, resolveLocale(next.language));
      if (!ok) {
        commit({ notificationsEnabled: false });
        return 'error' as const;
      }
      return 'granted' as const;
    },
    [commit],
  );

  const setNotificationTime = useCallback(
    async (hour: number, minute: number) => {
      const next = commit({ notificationHour: hour, notificationMinute: minute });
      if (next.notificationsEnabled) await scheduleDailyReminders(hour, minute, resolveLocale(next.language));
    },
    [commit],
  );

  const setLanguage = useCallback(
    async (language: LanguagePreference) => {
      const next = commit({ language });
      if (next.notificationsEnabled) {
        await scheduleDailyReminders(next.notificationHour, next.notificationMinute, resolveLocale(language));
      }
    },
    [commit],
  );

  const value = useMemo(
    () => ({ ready, prefs, setHaptics, setNotificationsEnabled, setNotificationTime, setLanguage }),
    [ready, prefs, setHaptics, setNotificationsEnabled, setNotificationTime, setLanguage],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
