import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Bell, Clock, Download, Eye, Info, RotateCcw, Shield, Smartphone, Sparkles, ThumbsUp, Upload, Vibrate } from '@/components/icons';
import { ChoiceChips } from '@/components/settings/ChoiceChips';
import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { Divider, SettingsGroup, SettingsRow } from '@/components/settings/SettingsRow';
import { TimePicker } from '@/components/settings/TimePicker';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { getMessage } from '@/data/messages';
import { topNeed } from '@/data/needs';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/providers/FavoritesProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { backupSupported, exportBackup, pickBackup } from '@/services/backup';
import { selectionFeedback, successFeedback } from '@/services/haptics';
import { clearHelped, getHelped, mergeHelped, useHelped } from '@/services/helped';
import { clearNotForMe, getNotForMe, mergeNotForMe, useNotForMe } from '@/services/notForMe';
import { usePlus } from '@/services/purchases';
import { notificationsSupported } from '@/services/notifications';
import type { AppearancePreference, NotificationStyle } from '@/types';
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
  const { prefs, update, setNotificationsEnabled, setNotificationTime, setNotificationStyle, setLanguage, restore } =
    usePreferences();
  const { entries, merge } = useFavorites();
  const hidden = useNotForMe();
  const helped = useHelped();
  const plus = usePlus();
  const helpedNeed = topNeed(helped.map((id) => getMessage(id)).filter((m) => m !== undefined));
  const [notice, setNotice] = useState<'denied' | 'error' | null>(null);
  const [toggling, setToggling] = useState(false);
  const [dataNotice, setDataNotice] = useState<{ text: string; error: boolean } | null>(null);
  const [dataBusy, setDataBusy] = useState(false);

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

  const onExport = async () => {
    setDataNotice(null);
    setDataBusy(true);
    try {
      const { notificationHour, notificationMinute, notificationStyle, hapticsEnabled, language, appearance, accent } = prefs;
      await exportBackup(
        {
          favorites: [...entries],
          notForMe: [...getNotForMe()],
          helped: [...getHelped()],
          preferences: { notificationHour, notificationMinute, notificationStyle, hapticsEnabled, language, appearance, accent },
        },
        t.settings.exportLabel,
      );
    } catch (err) {
      console.warn('[backup] export failed', err);
      setDataNotice({ text: t.settings.exportError, error: true });
    } finally {
      setDataBusy(false);
    }
  };

  const onImport = async () => {
    setDataNotice(null);
    setDataBusy(true);
    try {
      const backup = await pickBackup();
      if (!backup) return;
      const added = merge(backup.favorites);
      mergeNotForMe(backup.notForMe);
      mergeHelped(backup.helped);
      await restore(backup.preferences);
      if (backup.preferences.notificationHour !== undefined || backup.preferences.notificationMinute !== undefined) {
        setDraft({
          hour: backup.preferences.notificationHour ?? prefs.notificationHour,
          minute: backup.preferences.notificationMinute ?? prefs.notificationMinute,
        });
      }
      successFeedback(prefs.hapticsEnabled);
      setDataNotice({ text: t.settings.importDone(added), error: false });
    } catch (err) {
      console.warn('[backup] import failed', err);
      setDataNotice({ text: t.settings.importError, error: true });
    } finally {
      setDataBusy(false);
    }
  };

  const styleOptions: { id: NotificationStyle; label: string }[] = [
    { id: 'discreet', label: t.settings.styles.discreet },
    { id: 'full', label: t.settings.styles.full },
  ];
  const appearanceOptions: { id: AppearancePreference; label: string }[] = [
    { id: 'system', label: t.settings.appearance.system },
    { id: 'light', label: t.settings.appearance.light },
    { id: 'dark', label: t.settings.appearance.dark },
  ];

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
            <View style={styles.subLabel}>
              <Clock size={14} color={colors.textMuted} strokeWidth={1.6} />
              <AppText variant="caption" tone="muted">
                {t.settings.reminderTime}
              </AppText>
            </View>
            <TimePicker hour={draft.hour} minute={draft.minute} onChange={onTimeChange} />
            <Divider />
            <View style={styles.subLabel}>
              <Eye size={14} color={colors.textMuted} strokeWidth={1.6} />
              <AppText variant="caption" tone="muted">
                {t.settings.styleLabel}
              </AppText>
            </View>
            <ChoiceChips
              options={styleOptions}
              value={prefs.notificationStyle}
              onChange={(style) => {
                selectionFeedback(prefs.hapticsEnabled);
                void setNotificationStyle(style);
              }}
              label={t.settings.styleLabel}
            />
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
        <AppText variant="caption" tone="subtle" style={styles.hint}>
          {prefs.notificationStyle === 'discreet'
            ? t.settings.styleHint.discreet(t.notification.title)
            : t.settings.styleHint.full}
        </AppText>
      ) : null}

      <SettingsGroup title={t.settings.appearanceGroup}>
        <ChoiceChips
          options={appearanceOptions}
          value={prefs.appearance}
          onChange={(appearance) => {
            selectionFeedback(prefs.hapticsEnabled);
            update({ appearance });
          }}
          label={t.settings.appearanceGroup}
        />
      </SettingsGroup>
      <AppText variant="caption" tone="subtle" style={styles.hint}>
        {t.settings.appearanceHint}
      </AppText>

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
            update({ hapticsEnabled: v });
            selectionFeedback(v);
          }}
        />
      </SettingsGroup>

      <SettingsGroup title={t.settings.dataGroup}>
        {backupSupported ? (
          <>
            <SettingsRow
              kind="link"
              icon={Download}
              label={t.settings.exportLabel}
              description={t.settings.exportDescription}
              onPress={dataBusy ? () => {} : onExport}
            />
            <Divider />
            <SettingsRow
              kind="link"
              icon={Upload}
              label={t.settings.importLabel}
              description={t.settings.importDescription}
              onPress={dataBusy ? () => {} : onImport}
            />
          </>
        ) : (
          <SettingsRow kind="value" icon={Download} label={t.settings.exportLabel} value="" description={t.settings.dataUnsupported} />
        )}
        {helped.length > 0 ? (
          <>
            <Divider />
            <SettingsRow
              kind="value"
              icon={ThumbsUp}
              label={t.settings.helpedLabel}
              description={t.settings.helpedDescription(helped.length, helpedNeed ? t.needs[helpedNeed].label : null)}
              value=""
            />
            <Divider />
            <SettingsRow
              kind="link"
              icon={RotateCcw}
              label={t.settings.helpedReset}
              onPress={() => {
                selectionFeedback(prefs.hapticsEnabled);
                clearHelped();
              }}
            />
          </>
        ) : null}
        {hidden.length > 0 ? (
          <>
            <Divider />
            <SettingsRow
              kind="link"
              icon={RotateCcw}
              label={t.settings.resetNotForMe}
              description={t.settings.resetNotForMeDescription(hidden.length)}
              onPress={() => {
                selectionFeedback(prefs.hapticsEnabled);
                clearNotForMe();
              }}
            />
          </>
        ) : null}
      </SettingsGroup>
      {dataNotice ? (
        <Animated.View entering={FadeIn} style={styles.notice}>
          <AppText
            variant="caption"
            style={[styles.noticeText, { color: dataNotice.error ? colors.danger : colors.textMuted }]}
            accessibilityLiveRegion="polite"
          >
            {dataNotice.text}
          </AppText>
        </Animated.View>
      ) : null}

      <SettingsGroup>
        <SettingsRow
          kind="link"
          icon={Sparkles}
          label={t.settings.plusLabel}
          description={plus ? t.settings.plusOwned : t.settings.plusDescription}
          onPress={() => router.push('/settings/plus')}
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
  subLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  notice: { marginTop: -spacing.sm, marginBottom: spacing.lg, gap: spacing.sm },
  noticeText: { paddingHorizontal: spacing.xxs },
  hint: { marginTop: -spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.xxs },
});
