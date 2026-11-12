import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { localizeMessage } from '@/data/messages';
import { STRINGS } from '@/i18n/strings';
import { getDailyMessage } from '@/services/messageService';
import type { Locale, NotificationStyle } from '@/types';

/**
 * Daily reminders.
 *
 * Instead of one repeating notification with fixed text, we schedule one
 * local notification per day for the next DAYS_AHEAD days, each carrying that
 * day's message, so the reminder matches what the user sees on Home. The
 * window is topped up every time the app opens. iOS allows 64 pending local
 * notifications, so 30 is comfortably inside the limit. Exactly one
 * notification per day, never more.
 */
const DAYS_AHEAD = 30;
const CHANNEL_ID = 'daily-reminder';

export type PermissionResult = 'granted' | 'denied' | 'unsupported' | 'error';

export const notificationsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

let handlerConfigured = false;

/** Call once at startup: show reminders even if the app is open. */
export function configureNotificationHandler(): void {
  if (!notificationsSupported || handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Creates our Android channel. Returns its id, or undefined to fall back to
 * the default channel (the app.json plugin also declares one). Never throws:
 * a channel problem must not block permission or scheduling. Expo Go on
 * SDK 58 is known to reject channel creation with a native NPE.
 */
async function ensureAndroidChannel(): Promise<string | undefined> {
  if (Platform.OS !== 'android') return undefined;
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily reminder',
    description: 'One gentle message each day at the time you choose.',
    // Re-exported enum via `export *`; the import plugin can't see it, TS can.
    // eslint-disable-next-line import/namespace
    importance: Notifications.AndroidImportance.DEFAULT,
    });
    return CHANNEL_ID;
  } catch (err) {
    console.warn('[notifications] channel setup failed, using default channel', err);
    return undefined;
  }
}

/** Asks for permission only if it hasn't been decided yet. */
export async function requestPermission(): Promise<PermissionResult> {
  if (!notificationsSupported) return 'unsupported';
  try {
    // Android 13+ only shows the system prompt once a channel exists.
    await ensureAndroidChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return 'granted';
    if (!current.canAskAgain) return 'denied';
    const asked = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: false },
    });
    return asked.granted ? 'granted' : 'denied';
  } catch (err) {
    console.warn('[notifications] permission request failed', err);
    return 'error';
  }
}

export async function hasPermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  try {
    return (await Notifications.getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

export async function cancelDailyReminders(): Promise<void> {
  if (!notificationsSupported) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn('[notifications] cancel failed', err);
  }
}

export interface ReminderSettings {
  hour: number;
  minute: number;
  locale: Locale;
  /** 'discreet' never puts the message itself on the lock screen. */
  style: NotificationStyle;
}

/** Identifies the time, language and style a pending notification was scheduled for. */
const slotOf = ({ hour, minute, locale, style }: ReminderSettings) => `${hour}:${minute}:${locale}:${style}`;

/** Replaces all pending reminders with a fresh 30-day window. */
export async function scheduleDailyReminders(settings: ReminderSettings): Promise<boolean> {
  const { hour, minute, locale, style } = settings;
  if (!notificationsSupported) return false;
  try {
    if (!(await hasPermission())) return false;
    const channelId = await ensureAndroidChannel();
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const startOffset =
      now.getHours() * 60 + now.getMinutes() < hour * 60 + minute ? 0 : 1;
    const slot = slotOf(settings);
    const strings = STRINGS[locale].notification;

    // Independent native calls: issue them together instead of 30 round trips in a row.
    await Promise.all(
      Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + startOffset + i, hour, minute, 0, 0);
        const message = localizeMessage(getDailyMessage(date), locale);
        return Notifications.scheduleNotificationAsync({
          content: {
            title: strings.title,
            body: style === 'full' ? message.text : strings.discreetBody,
            data: { messageId: message.id, slot },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            ...(channelId ? { channelId } : {}),
          },
        });
      }),
    );
    return true;
  } catch (err) {
    console.warn('[notifications] scheduling failed', err);
    return false;
  }
}

/**
 * Launch-time top-up. Rebuilding the window costs 30+ native calls, so it is
 * skipped while at least TOP_UP_BELOW days are still pending for the current
 * time, language and style. Returns false if permission was revoked, so the caller can switch the
 * toggle off.
 */
const TOP_UP_BELOW = 21;

export async function ensureDailyReminders(settings: ReminderSettings): Promise<boolean> {
  if (!notificationsSupported) return false;
  try {
    if (!(await hasPermission())) return false;
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    const slot = slotOf(settings);
    const healthy =
      pending.length >= TOP_UP_BELOW && pending.every((n) => n.content.data?.slot === slot);
    if (healthy) return true;
  } catch {
    // Fall through and rebuild.
  }
  return scheduleDailyReminders(settings);
}
