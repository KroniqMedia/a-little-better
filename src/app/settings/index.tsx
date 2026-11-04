import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Bell, Clock, Info, Shield, Smartphone, Vibrate } from '@/components/icons';
import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { Divider, SettingsGroup, SettingsRow } from '@/components/settings/SettingsRow';
import { TimePicker } from '@/components/settings/TimePicker';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback } from '@/services/haptics';
import { notificationsSupported } from '@/services/notifications';
import { appVersion } from '@/utils/appInfo';
import { formatTime } from '@/utils/date';

export default function SettingsScreen() {
  const { ready } = usePreferences();
  const { colors } = useTheme();
  if (!ready) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackHeader />
        <ActivityIndicator color={colors.accentStrong} />
      </Screen>
    );
  }
  return <SettingsContent />;
}

function SettingsContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const { prefs, setHaptics, setNotificationsEnabled, setNotificationTime, setLanguage } = usePreferences();
  const [notice, setNotice] = useState<'denied' | 'error' | null>(null);
  const [toggling, setToggling] = useState(false);

  // The picker updates instantly; rescheduling waits until the user pauses.
  const [draft, setDraft] = useState({ hour: prefs.notificationHour, minute: prefs.notificationMinute });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<(() => void) | null>(null);

  // Leaving the screen mid-adjustment still saves the last chosen time.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    pending.current?.();
  }, []);

  const onTimeChange = (hour: number, minute: number) => {
    selectionFeedback(prefs.hapticsEnabled);
    setDraft({ hour, minute });
    if (timer.current) clearTimeout(timer.current);
    pending.current = () => {
      pending.current = null;
      void setNotificationTime(hour, minute);
    };
    timer.current = setTimeout(() => pending.current?.(), 500);
  };

  const onToggleNotifications = async (enabled: boolean) => {
    setToggling(true);
    setNotice(null);
    const result = await setNotificationsEnabled(enabled);
    setToggling(false);
    if (result === 'denied' || result === 'error') setNotice(result);
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />
      <AppText variant="display" accessibilityRole="header" style={styles.title}>
        {t.settings.title}
      </AppText>

      <SettingsGroup title={t.settings.reminderGroup}>
        <SettingsRow
          kind="switch"
          icon={Bell}
          label={t.settings.dailyMessage}
          description={
            notificationsSupported
              ? prefs.notificationsEnabled
                ? t.settings.reminderOn(formatTime(draft.hour, draft.minute, locale))
                : t.settings.reminderOff
              : t.settings.reminderUnsupported
          }
          value={prefs.notificationsEnabled}
          onValueChange={onToggleNotifications}
          disabled={toggling || !notificationsSupported}
        />
        {prefs.notificationsEnabled ? (
          <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)}>
            <Divider />
            <View style={styles.timeLabel}>
              <Clock size={14} color={colors.textMuted} strokeWidth={1.6} />
              <AppText variant="caption" tone="muted">
                {t.settings.reminderTime}
              </AppText>
            </View>
            <TimePicker hour={draft.hour} minute={draft.minute} onChange={onTimeChange} />
          </Animated.View>
        ) : null}
      </SettingsGroup>

      {notice === 'error' ? (
        <Animated.View entering={FadeIn} style={styles.notice}>
          <AppText variant="caption" tone="muted" style={styles.noticeText}>
            {t.settings.noticeError}
          </AppText>
        </Animated.View>
      ) : null}

      {notice === 'denied' ? (
        <Animated.View entering={FadeIn} style={styles.notice}>
          <AppText variant="caption" tone="muted" style={styles.noticeText}>
            {t.settings.noticeDenied}
          </AppText>
          <Button label={t.settings.openDeviceSettings} variant="secondary" onPress={() => void Linking.openSettings()} />
        </Animated.View>
      ) : null}

      {prefs.notificationsEnabled ? (
        <View style={styles.preview}>
          <AppText variant="caption" tone="subtle">
            {t.settings.preview(t.notification.title)}
          </AppText>
        </View>
      ) : null}

      <SettingsGroup title={t.settings.languageGroup}>
        <LanguagePicker
          value={prefs.language}
          onChange={(language) => {
            selectionFeedback(prefs.hapticsEnabled);
            void setLanguage(language);
          }}
          systemLabel={t.settings.languageSystem}
          label={t.settings.languageGroup}
        />
      </SettingsGroup>
      <AppText variant="caption" tone="subtle" style={styles.hint}>
        {t.settings.languageHint}
      </AppText>

      <SettingsGroup title={t.settings.feelGroup}>
        <SettingsRow
          kind="switch"
          icon={Vibrate}
          label={t.settings.haptics}
          description={t.settings.hapticsDescription}
          value={prefs.hapticsEnabled}
          onValueChange={(v) => {
            setHaptics(v);
            selectionFeedback(v);
          }}
        />
      </SettingsGroup>

      <SettingsGroup title={t.settings.aboutGroup}>
        <SettingsRow kind="link" icon={Shield} label={t.settings.privacy} onPress={() => router.push('/settings/privacy')} />
        <Divider />
        <SettingsRow kind="link" icon={Info} label={t.settings.about} onPress={() => router.push('/settings/about')} />
        <Divider />
        <SettingsRow kind="value" icon={Smartphone} label={t.settings.version} value={appVersion()} />
      </SettingsGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.xl },
  timeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  notice: { marginTop: -spacing.sm, marginBottom: spacing.lg, gap: spacing.sm },
  noticeText: { paddingHorizontal: spacing.xxs },
  preview: { marginTop: -spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.xxs },
  hint: { marginTop: -spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.xxs },
});
