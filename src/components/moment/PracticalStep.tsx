import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ChevronRight, Timer } from '@/components/icons';
import { radius, spacing } from '@/constants/theme';
import { ACTION_SECONDS, type ActionId } from '@/data/actions';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { successFeedback, tapFeedback } from '@/services/haptics';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { PressableScale } from '../ui/PressableScale';

type Phase = 'closed' | 'open' | 'running' | 'finished';

/**
 * One optional 20–60 second action under a message. Opening it is a choice,
 * the timer is only a guide, and nothing is recorded or left "to do".
 */
export function PracticalStep({ action }: { action: ActionId }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { prefs } = usePreferences();
  const reduceMotion = useReducedMotion();
  const seconds = ACTION_SECONDS[action];
  const { title, body } = t.actions[action];
  const [phase, setPhase] = useState<Phase>('closed');
  const [left, setLeft] = useState(seconds);
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const finish = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPhase('finished');
    progress.set(1);
    successFeedback(prefs.hapticsEnabled);
    AccessibilityInfo.announceForAccessibility(t.practical.finished);
  };

  const start = () => {
    tapFeedback(prefs.hapticsEnabled);
    setPhase('running');
    setLeft(seconds);
    progress.set(0);
    progress.set(withTiming(1, { duration: seconds * 1000, easing: Easing.linear }));
    const endsAt = Date.now() + seconds * 1000;
    timer.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) finish();
    }, 250);
  };

  const bar = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  if (phase === 'closed') {
    return (
      <PressableScale
        onPress={() => {
          tapFeedback(prefs.hapticsEnabled);
          setPhase('open');
        }}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${t.practical.offer(seconds)}. ${title}`}
        accessibilityState={{ expanded: false }}
        style={[styles.offer, { borderColor: colors.border }]}
      >
        <Timer size={18} color={colors.accentStrong} strokeWidth={1.6} />
        <View style={styles.offerText}>
          <AppText variant="caption" tone="muted">
            {t.practical.offer(seconds)}
          </AppText>
          <AppText variant="bodyMedium">{title}</AppText>
        </View>
        <ChevronRight size={18} color={colors.textSubtle} strokeWidth={1.5} />
      </PressableScale>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(250)} style={[styles.panel, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Timer size={18} color={colors.accentStrong} strokeWidth={1.6} />
        <AppText variant="heading" style={styles.title} accessibilityRole="header">
          {title}
        </AppText>
      </View>
      <AppText tone="muted">{body}</AppText>

      {phase === 'running' || phase === 'finished' ? (
        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: colors.background }]}>
            {/* With reduced motion the bar stays still; the countdown carries the time. */}
            {reduceMotion ? null : <Animated.View style={[styles.fill, { backgroundColor: colors.accent }, bar]} />}
          </View>
          <AppText variant="caption" tone="muted" style={styles.left} accessibilityLiveRegion="none">
            {t.practical.remaining(left)}
          </AppText>
        </View>
      ) : null}

      {phase === 'finished' ? (
        <AppText variant="caption" tone="muted" style={styles.finished}>
          {t.practical.finished}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        {phase === 'open' ? <Button label={t.practical.start} variant="secondary" onPress={start} /> : null}
        {phase === 'running' ? <Button label={t.practical.done} variant="secondary" onPress={finish} /> : null}
        <Button
          label={t.practical.close}
          variant="ghost"
          onPress={() => {
            if (timer.current) clearInterval(timer.current);
            timer.current = null;
            setPhase('closed');
          }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  offer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    minHeight: 64,
  },
  offerText: { flex: 1 },
  panel: { marginTop: spacing.md, padding: spacing.lg, borderRadius: radius.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  title: { flex: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  left: { minWidth: 36, textAlign: 'right' },
  finished: { marginTop: spacing.sm },
  actions: { marginTop: spacing.md, gap: spacing.xxs },
});
