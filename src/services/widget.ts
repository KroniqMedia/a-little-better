import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import { localizeMessage } from '@/data/messages';
import { STRINGS } from '@/i18n/strings';
import { getDailyMessage } from '@/services/messageService';
import type { Locale } from '@/types';
import type { DailyMessageProps } from '@/widgets/types';

/** iOS swaps entries at midnight on its own, so it gets two weeks ahead. */
const IOS_DAYS_AHEAD = 14;

type DailyWidget = {
  updateTimeline(entries: { date: Date; props: DailyMessageProps }[]): void;
  updateSnapshot(props: DailyMessageProps): void;
};

let cached: DailyWidget | null | undefined;

/**
 * The widget module needs native code that Expo Go doesn't have. Check for
 * it first: requiring expo-widgets without it throws during module
 * evaluation, which shows as an uncaught error even inside try/catch.
 */
function loadWidget(): DailyWidget | null {
  if (cached !== undefined) return cached;
  cached = null;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return cached;
  if (!requireOptionalNativeModule('ExpoWidgets')) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = (require('../widgets/DailyMessageWidget').default as DailyWidget | null) ?? null;
  } catch (err) {
    console.warn('[widget] not available in this build', err);
  }
  return cached;
}

/**
 * Pushes today's message to the home-screen widget, in the app's language.
 * iOS gets a timeline so it rolls over at midnight by itself; Android shows
 * a snapshot that refreshes whenever the app is opened (or is open at midnight).
 */
export function syncDailyWidget(locale: Locale, today: Date = new Date()): void {
  const widget = loadWidget();
  if (!widget) return;
  const label = STRINGS[locale].home.todayLabel;
  const textFor = (date: Date) => localizeMessage(getDailyMessage(date), locale).text;
  try {
    if (Platform.OS === 'ios') {
      const now = today;
      widget.updateTimeline(
        Array.from({ length: IOS_DAYS_AHEAD }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
          return { date, props: { text: textFor(date), label } };
        }),
      );
    } else {
      widget.updateSnapshot({ text: textFor(today), label });
    }
  } catch (err) {
    console.warn('[widget] update failed', err);
  }
}
