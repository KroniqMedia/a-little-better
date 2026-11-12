import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Bell } from '@/components/icons';
import { radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { notificationsSupported } from '@/services/notifications';
import { formatTime } from '@/utils/date';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';

/**
 * Offers the daily reminder once, on Home, only after someone has opened a
 * message for themselves: they've seen what they'd be reminded of first.
 */
export function ReminderOffer() {
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const { ready, prefs, update, setNotificationsEnabled } = usePreferences();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const time = formatTime(prefs.notificationHour, prefs.notificationMinute, locale);
  const offer = ready && notificationsSupported && prefs.hasTried && !prefs.reminderAsked && !prefs.notificationsEnabled;
  if (!offer && !result) return null;

  const yes = async () => {
    setBusy(true);
    const outcome = await setNotificationsEnabled(true);
    setBusy(false);
    setResult(outcome === 'granted' ? t.reminderOffer.done(time) : t.reminderOffer.denied);
    update({ reminderAsked: true });
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.titleRow}>
        <Bell size={18} color={colors.accentStrong} strokeWidth={1.6} />
        <AppText variant="heading" style={styles.title}>
          {t.reminderOffer.title}
        </AppText>
      </View>
      {result ? (
        <AppText tone="muted" accessibilityLiveRegion="polite">
          {result}
        </AppText>
      ) : (
        <>
          <AppText tone="muted" style={styles.body}>
            {t.reminderOffer.body(time)}
          </AppText>
          <View style={styles.actions}>
            <Button label={t.reminderOffer.yes} onPress={yes} loading={busy} />
            <Button label={t.reminderOffer.no} variant="ghost" onPress={() => update({ reminderAsked: true })} disabled={busy} />
          </View>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.xl, padding: spacing.lg, borderRadius: radius.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  title: { flex: 1 },
  body: { marginBottom: spacing.md },
  actions: { gap: spacing.xxs },
});
