import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { ChevronRight, Settings } from '@/components/icons';
import { MessageCard } from '@/components/message/MessageCard';
import { MoodPicker } from '@/components/mood/MoodPicker';
import { NeedChips } from '@/components/need/NeedChips';
import { ReminderOffer } from '@/components/reminder/ReminderOffer';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Screen, type ScreenScrollView } from '@/components/ui/Screen';
import { TextLink } from '@/components/ui/TextLink';
import { WarmGlow } from '@/components/ui/WarmGlow';
import { spacing } from '@/constants/theme';
import { getMood, type Mood } from '@/data/moods';
import { useDailyMessage } from '@/hooks/useDailyMessage';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useTodayMood } from '@/hooks/useTodayMood';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback } from '@/services/haptics';
import type { NeedId } from '@/types';
import { formatLongDate, greeting } from '@/utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, scheme } = useTheme();
  const { prefs } = usePreferences();
  const { message, date } = useDailyMessage();
  const { t, locale } = useI18n();
  const { moodId, choose } = useTodayMood();
  const mood = getMood(moodId, locale);
  const hello = greeting(new Date(), locale);
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<ScreenScrollView>(null);
  const checkinY = useRef(0);

  // The feeling leads: each face opens the collection written for it, where
  // "what would help" can narrow the message further.
  const onMood = (next: Mood) => {
    selectionFeedback(prefs.hapticsEnabled);
    choose(next.id);
    router.push({ pathname: '/category/[id]', params: { id: next.category, mood: next.id } });
  };

  // Shortcut for when naming a feeling isn't what someone wants right now.
  const onNeed = (need: NeedId) => {
    selectionFeedback(prefs.hapticsEnabled);
    if (mood) router.push({ pathname: '/category/[id]', params: { id: mood.category, mood: mood.id, need } });
    else router.push({ pathname: '/moment', params: { need } });
  };

  const toCheckin = () => {
    scrollRef.current?.scrollTo({ y: Math.max(0, checkinY.current - spacing.md), animated: !reduceMotion });
  };

  return (
    <Screen scrollRef={scrollRef} background={<WarmGlow evening={hello.evening} dark={scheme === 'dark'} />}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.headerText}>
          <AppText tone="muted" style={styles.greeting}>
            {t.greeting[hello.key]}
          </AppText>
          <AppText variant="display" accessibilityRole="header">
            A little better.
          </AppText>
          <AppText tone="subtle" style={styles.date}>
            {formatLongDate(date, locale)}
          </AppText>
        </View>
        <View style={styles.settings}>
          <IconButton
            icon={Settings}
            onPress={() => router.push('/settings')}
            accessibilityLabel={t.home.settings}
            color={colors.textMuted}
          />
        </View>
      </Animated.View>

      <Animated.View key={message.id} entering={FadeInDown.duration(600).delay(120)}>
        <MessageCard message={message} label={t.home.todayLabel} />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(500).delay(260)} style={styles.somethingElse}>
        <TextLink
          label={t.home.somethingElse}
          icon={ChevronRight}
          onPress={toCheckin}
          accessibilityHint={t.home.somethingElseHint}
          align="center"
        />
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(500).delay(320)}
        style={styles.checkin}
        onLayout={(e) => {
          checkinY.current = e.nativeEvent.layout.y;
        }}
      >
        <AppText variant="title" accessibilityRole="header">
          {t.home.checkinTitle}
        </AppText>
        <AppText tone="muted" style={styles.checkinHint}>
          {mood ? t.home.checkinChosen(mood.phrase) : t.home.checkinHint}
        </AppText>
        <MoodPicker selected={mood} onSelect={onMood} />

        <View style={styles.direct}>
          <AppText variant="caption" tone="muted" style={styles.directLabel}>
            {t.home.needDirect}
          </AppText>
          <NeedChips onSelect={onNeed} label={t.home.needDirect} accessibilityHint={t.home.needA11yHint} />
        </View>
      </Animated.View>

      <ReminderOffer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  headerText: { flex: 1 },
  greeting: { marginBottom: spacing.xxs },
  date: { marginTop: spacing.xxs },
  settings: { marginRight: -spacing.sm, marginTop: -spacing.xxs },
  somethingElse: { marginTop: spacing.sm },
  checkin: { marginTop: spacing.xl },
  checkinHint: { marginTop: spacing.xxs, marginBottom: spacing.lg },
  direct: { marginTop: spacing.lg },
  directLabel: { marginBottom: spacing.xs },
});
