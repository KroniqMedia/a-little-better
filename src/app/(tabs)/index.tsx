import { useRouter } from 'expo-router';
import { Settings } from '@/components/icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { MessageCard } from '@/components/message/MessageCard';
import { MoodPicker } from '@/components/mood/MoodPicker';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { WarmGlow } from '@/components/ui/WarmGlow';
import { spacing } from '@/constants/theme';
import { getMood, type Mood } from '@/data/moods';
import { useDailyMessage } from '@/hooks/useDailyMessage';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useTodayMood } from '@/hooks/useTodayMood';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback } from '@/services/haptics';
import { formatLongDate, greeting } from '@/utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { prefs } = usePreferences();
  const { message, date } = useDailyMessage();
  const { t, locale } = useI18n();
  const { moodId, choose } = useTodayMood();
  const mood = getMood(moodId, locale);
  const hello = greeting(new Date(), locale);

  const onMood = (next: Mood) => {
    selectionFeedback(prefs.hapticsEnabled);
    choose(next.id);
    router.push({ pathname: '/category/[id]', params: { id: next.category, mood: next.id } });
  };

  return (
    <Screen background={<WarmGlow evening={hello.evening} />}>
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

      <Animated.View entering={FadeIn.duration(500).delay(320)} style={styles.checkin}>
        <AppText variant="title" accessibilityRole="header">
          {t.home.checkinTitle}
        </AppText>
        <AppText tone="muted" style={styles.checkinHint}>
          {mood ? t.home.checkinChosen(mood.phrase) : t.home.checkinHint}
        </AppText>
        <MoodPicker selected={mood} onSelect={onMood} />
      </Animated.View>
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
  checkin: { marginTop: spacing.xxl },
  checkinHint: { marginTop: spacing.xxs, marginBottom: spacing.lg },
});
