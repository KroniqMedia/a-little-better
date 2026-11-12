import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Heart, Pin } from '@/components/icons';
import { MessageCard } from '@/components/message/MessageCard';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites, type SavedItem } from '@/providers/FavoritesProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback, tapFeedback } from '@/services/haptics';

export default function SavedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { ready, saved, remove, togglePin } = useFavorites();
  const { prefs } = usePreferences();
  const [full, setFull] = useState(false);

  const pinned = saved.filter((s) => s.pinned);
  const rest = saved.filter((s) => !s.pinned);

  const onTogglePin = (id: string) => {
    const result = togglePin(id);
    setFull(result === 'full');
    if (result !== 'full') selectionFeedback(prefs.hapticsEnabled);
  };

  const card = ({ message, pinned: isPinned }: SavedItem) => (
    <Animated.View
      key={message.id}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(220)}
      layout={LinearTransition.duration(260)}
    >
      <MessageCard
        message={message}
        size="compact"
        pinned={isPinned}
        onTogglePin={() => onTogglePin(message.id)}
        onRemove={() => {
          tapFeedback(prefs.hapticsEnabled);
          setFull(false);
          remove(message.id);
        }}
      />
    </Animated.View>
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display" accessibilityRole="header">
          {t.saved.title}
        </AppText>
        {saved.length > 0 ? (
          <AppText tone="muted" style={styles.count}>
            {t.saved.count(saved.length)}
          </AppText>
        ) : null}
      </View>

      {!ready ? (
        <ActivityIndicator color={colors.accentStrong} style={styles.loading} />
      ) : saved.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t.saved.emptyTitle}
          body={t.saved.emptyBody}
          action={<Button label={t.saved.emptyAction} variant="secondary" onPress={() => router.navigate('/explore')} />}
        />
      ) : (
        <>
          <View style={styles.section}>
            <AppText variant="overline" tone="muted" accessibilityRole="header" style={styles.sectionTitle}>
              {t.saved.pinnedTitle}
            </AppText>
            {pinned.length === 0 ? (
              <View style={[styles.pinHint, { borderColor: colors.border }]}>
                <Pin size={16} color={colors.textMuted} strokeWidth={1.6} />
                <AppText variant="caption" tone="muted" style={styles.pinHintText}>
                  {t.saved.pinnedEmpty}
                </AppText>
              </View>
            ) : (
              <View style={styles.list}>{pinned.map(card)}</View>
            )}
            {full ? (
              <AppText variant="caption" tone="muted" style={styles.full} accessibilityLiveRegion="polite">
                {t.saved.pinFull}
              </AppText>
            ) : null}
          </View>

          {rest.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="overline" tone="muted" accessibilityRole="header" style={styles.sectionTitle}>
                {t.saved.allTitle}
              </AppText>
              <View style={styles.list}>{rest.map(card)}</View>
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, marginBottom: spacing.xl },
  count: { marginTop: spacing.xs },
  loading: { marginTop: spacing.xxl },
  section: { marginBottom: spacing.xl },
  sectionTitle: { marginBottom: spacing.sm, marginLeft: spacing.xxs },
  list: { gap: spacing.md },
  pinHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pinHintText: { flex: 1 },
  full: { marginTop: spacing.sm, marginLeft: spacing.xxs },
});
