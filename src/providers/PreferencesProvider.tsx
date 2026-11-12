import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  cancelDailyReminders,
  ensureDailyReminders,
  requestPermission,
  scheduleDailyReminders,
  type PermissionResult,
  type ReminderSettings,
} from '@/services/notifications';
import { resolveLocale } from '@/i18n/device';
import { DEFAULT_PREFERENCES, localPreferences, type PreferencesRepository } from '@/services/storage';
import type { LanguagePreference, NotificationStyle, Preferences } from '@/types';

/** Preferences with no side effects beyond being saved. */
export type SimplePreferences = Pick<Preferences, 'hapticsEnabled' | 'appearance' | 'accent' | 'welcomed' | 'hasTried' | 'reminderAsked'>;

interface PreferencesContextValue {
  ready: boolean;
  prefs: Preferences;
  /** Saves simple flags and choices (haptics, appearance, onboarding state). */
  update: (patch: Partial<SimplePreferences>) => void;
  /** Turns reminders on (asking permission if needed) or off. */
  setNotificationsEnabled: (enabled: boolean) => Promise<PermissionResult | 'off'>;
  setNotificationTime: (hour: number, minute: number) => Promise<void>;
  /** Discreet or full-message reminders; pending ones are rewritten. */
  setNotificationStyle: (style: NotificationStyle) => Promise<void>;
  /** Switches language; pending reminders are rewritten in the new language. */
  setLanguage: (language: LanguagePreference) => Promise<void>;
  /**
   * Applies settings from a backup. Reminders are never switched on this way
   * (that needs the person's permission on this phone); if they are already
   * on, they are rescheduled with the restored time and style.
   */
  restore: (patch: Partial<Omit<Preferences, 'notificationsEnabled'>>) => Promise<void>;
}

/** Keeps reminder bookkeeping off the critical path at launch. */
const TOP_UP_DELAY_MS = 1500;

const reminderSettings = (p: Preferences): ReminderSettings => ({
  hour: p.notificationHour,
  minute: p.notificationMinute,
  locale: resolveLocale(p.language),
  style: p.notificationStyle,
});

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
          const ok = await ensureDailyReminders(reminderSettings(loaded));
          if (!ok && alive) commit({ notificationsEnabled: false });
        }, TOP_UP_DELAY_MS);
      }
    });
    return () => {
      alive = false;
      clearTimeout(topUp);
    };
  }, [repository, commit]);

  const update = useCallback((patch: Partial<SimplePreferences>) => void commit(patch), [commit]);

  /** Rewrites pending reminders after a change, if they're on. */
  const reschedule = useCallback(async (next: Preferences) => {
    if (next.notificationsEnabled) await scheduleDailyReminders(reminderSettings(next));
  }, []);

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
      const ok = await scheduleDailyReminders(reminderSettings(next));
      if (!ok) {
        commit({ notificationsEnabled: false });
        return 'error' as const;
      }
      return 'granted' as const;
    },
    [commit],
  );

  const setNotificationTime = useCallback(
    (hour: number, minute: number) => reschedule(commit({ notificationHour: hour, notificationMinute: minute })),
    [commit, reschedule],
  );

  const setNotificationStyle = useCallback(
    (style: NotificationStyle) => reschedule(commit({ notificationStyle: style })),
    [commit, reschedule],
  );

  const setLanguage = useCallback(
    (language: LanguagePreference) => reschedule(commit({ language })),
    [commit, reschedule],
  );

  const restore = useCallback(
    (patch: Partial<Omit<Preferences, 'notificationsEnabled'>>) => {
      // Never let a backup turn reminders on.
      const { notificationsEnabled: _ignored, ...safe } = patch as Partial<Preferences>;
      return reschedule(commit(safe));
    },
    [commit, reschedule],
  );

  const value = useMemo(
    () => ({ ready, prefs, update, setNotificationsEnabled, setNotificationTime, setNotificationStyle, setLanguage, restore }),
    [ready, prefs, update, setNotificationsEnabled, setNotificationTime, setNotificationStyle, setLanguage, restore],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
