import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import { CategoryIcon } from '@/components/category/CategoryIcon';
import { RefreshCw } from '@/components/icons';
import { MessageCard } from '@/components/message/MessageCard';
import { MoodFace } from '@/components/mood/MoodFace';
import { NeedChips } from '@/components/need/NeedChips';
import { NeedIcon } from '@/components/need/NeedIcon';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { HelpfulPrompt } from './HelpfulPrompt';
import { PracticalStep } from './PracticalStep';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { actionFor } from '@/data/actions';
import { getCategory } from '@/data/categories';
import { localizeMessage } from '@/data/messages';
import { getMood } from '@/data/moods';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback, tapFeedback } from '@/services/haptics';
import { nextMessage, type MessageFilter } from '@/services/messageService';
import { addNotForMe, getNotForMe, removeNotForMe } from '@/services/notForMe';
import type { CategoryId, Message, NeedId } from '@/types';

interface MomentScreenProps {
  /** Collection to draw from; omitted means the whole library. */
  categoryId?: CategoryId;
  /** Arriving from a feeling personalises the intro. */
  moodId?: string;
  initialNeed?: NeedId;
}

/**
 * One message for this moment. The flow is meant to be short: read, maybe
 * save, and leave. "Another message" is there, but not the main action.
 */
export function MomentScreen({ categoryId, moodId, initialNeed }: MomentScreenProps) {
  const router = useRouter();
  const { colors, scheme } = useTheme();
  const { t, locale } = useI18n();
  const { prefs, update } = usePreferences();
  const category = categoryId ? getCategory(categoryId, locale, scheme) : undefined;
  const mood = getMood(moodId, locale);
  const fromMood = mood && mood.category === categoryId ? mood : undefined;

  const [need, setNeed] = useState<NeedId | undefined>(initialNeed);
  const filter = useCallback((n: NeedId | undefined): MessageFilter => ({ category: categoryId, need: n }), [categoryId]);
  const [current, setCurrent] = useState<Message>(() => nextMessage(filter(initialNeed), { hidden: getNotForMe() }));
  /** Set right after "not for me", so it can be undone. */
  const [dismissed, setDismissed] = useState<Message | null>(null);

  // Lets the Home reminder offer appear only after someone has tried the app.
  useEffect(() => {
    if (!prefs.hasTried) update({ hasTried: true });
  }, [prefs.hasTried, update]);

  // Screen readers hear the new message when it changes (not on first render).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    AccessibilityInfo.announceForAccessibility(localizeMessage(current, locale).text);
  }, [current, locale]);

  const show = (msg: Message) => setCurrent(msg);

  const another = () => {
    selectionFeedback(prefs.hapticsEnabled);
    setDismissed(null);
    show(nextMessage(filter(need), { hidden: getNotForMe() }));
  };

  const chooseNeed = (n: NeedId) => {
    selectionFeedback(prefs.hapticsEnabled);
    // Inside a collection, tapping the active need clears it; on its own, a need is always chosen.
    if (need === n && !categoryId) return;
    const next = need === n ? undefined : n;
    setNeed(next);
    setDismissed(null);
    show(nextMessage(filter(next), { hidden: getNotForMe() }));
  };

  const notForMe = () => {
    tapFeedback(prefs.hapticsEnabled);
    addNotForMe(current.id);
    setDismissed(current);
    show(nextMessage(filter(need), { hidden: getNotForMe(), differentToneFrom: current.tone }));
  };

  /** "Not really" → something of a different tone, without hiding this one. */
  const tryDifferent = () => {
    selectionFeedback(prefs.hapticsEnabled);
    show(nextMessage(filter(need), { hidden: getNotForMe(), differentToneFrom: current.tone }));
  };

  const action = actionFor(current);

  const undo = () => {
    if (!dismissed) return;
    tapFeedback(prefs.hapticsEnabled);
    removeNotForMe(dismissed.id);
    show(dismissed);
    setDismissed(null);
  };

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  let intro;
  if (fromMood && category) {
    intro = {
      art: <MoodFace mood={fromMood} size={60} />,
      overline: t.category.feeling(fromMood.phrase),
      title: category.title,
      body: fromMood.reply,
    };
  } else if (category) {
    intro = {
      art: (
        <View style={[styles.icon, { backgroundColor: category.tint }]}>
          <CategoryIcon id={category.id} color={category.ink} size={26} />
        </View>
      ),
      overline: category.theme,
      title: category.title,
      body: category.description,
    };
  } else {
    const n = need ?? 'comfort';
    intro = {
      art: (
        <View style={[styles.icon, { backgroundColor: colors.surface }]}>
          <NeedIcon id={n} color={colors.accentStrong} size={26} />
        </View>
      ),
      overline: t.moment.forNow,
      title: t.needs[n].label,
      body: t.needs[n].description,
    };
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />

      <Animated.View entering={FadeIn.duration(400)} style={styles.intro}>
        <View style={styles.art}>{intro.art}</View>
        <AppText variant="overline" tone="muted">
          {intro.overline}
        </AppText>
        <AppText variant="display" accessibilityRole="header" style={styles.title}>
          {intro.title}
        </AppText>
        <AppText tone="muted">{intro.body}</AppText>
      </Animated.View>

      <View style={styles.needs} accessibilityLabel={t.moment.needsLabel}>
        <AppText variant="caption" tone="muted" style={styles.needsLabel}>
          {t.moment.needsLabel}
        </AppText>
        <NeedChips
          selected={need}
          onSelect={chooseNeed}
          label={t.moment.needsLabel}
          accessibilityHint={categoryId ? t.moment.needChipHint : undefined}
        />
      </View>

      <Animated.View key={current.id} entering={FadeInDown.duration(450)}>
        <MessageCard message={current} showCategory={!category} />
      </Animated.View>

      {dismissed ? (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)} style={styles.notice}>
          <AppText variant="caption" tone="muted" style={styles.noticeText} accessibilityLiveRegion="polite">
            {t.moment.notForMeDone}
          </AppText>
          <PressableScale onPress={undo} accessibilityRole="button" accessibilityLabel={t.moment.undo} hitSlop={8} style={styles.undo}>
            <AppText variant="caption" style={{ color: colors.text, textDecorationLine: 'underline' }}>
              {t.moment.undo}
            </AppText>
          </PressableScale>
        </Animated.View>
      ) : (
        <>
          {action ? (
            <PracticalStep key={current.id} action={action} />
          ) : (
            <AppText variant="caption" tone="subtle" align="center" style={styles.pause}>
              {t.moment.pause}
            </AppText>
          )}
          <HelpfulPrompt key={`helped-${current.id}`} message={current} onTryDifferent={tryDifferent} />
        </>
      )}

      <View style={styles.actions}>
        <Button label={t.moment.done} onPress={done} />
        <Button label={t.category.another} icon={RefreshCw} variant="secondary" onPress={another} />
        <Button label={t.moment.notForMe} variant="ghost" onPress={notForMe} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.lg },
  art: { marginBottom: spacing.lg },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: spacing.xs, marginBottom: spacing.sm },
  needs: { marginBottom: spacing.lg },
  needsLabel: { marginBottom: spacing.xs },
  pause: { marginTop: spacing.md },
  notice: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  noticeText: { textAlign: 'center' },
  undo: { minHeight: 32, justifyContent: 'center', paddingHorizontal: spacing.xxs },
  actions: { marginTop: spacing.lg, gap: spacing.xs },
});
