import { useLocalSearchParams, useRouter } from 'expo-router';
import { Compass, RefreshCw } from '@/components/icons';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { CategoryIcon } from '@/components/category/CategoryIcon';
import { MessageCard } from '@/components/message/MessageCard';
import { MoodFace } from '@/components/mood/MoodFace';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { getCategory } from '@/data/categories';
import { getMood } from '@/data/moods';
import { useI18n } from '@/hooks/useI18n';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback } from '@/services/haptics';
import { nextMessageFor } from '@/services/messageService';

export default function CategoryScreen() {
  const { id, mood: moodId } = useLocalSearchParams<{ id: string; mood?: string }>();
  const router = useRouter();
  const { prefs } = usePreferences();
  const { t, locale } = useI18n();
  const category = getCategory(id ?? '', locale);
  // Arriving from "How do you feel today?" personalises the intro.
  const mood = getMood(moodId, locale);
  const fromMood = mood && mood.category === category?.id ? mood : undefined;

  const [current, setCurrent] = useState(() => (category ? nextMessageFor(category.id) : undefined));

  const another = useCallback(() => {
    if (!category) return;
    selectionFeedback(prefs.hapticsEnabled);
    setCurrent(nextMessageFor(category.id));
  }, [category, prefs.hapticsEnabled]);

  if (!category || !current) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackHeader />
        <EmptyState
          icon={Compass}
          title={t.category.notFoundTitle}
          body={t.category.notFoundBody}
          action={<Button label={t.category.backToExplore} variant="secondary" onPress={() => router.replace('/explore')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />

      <Animated.View entering={FadeIn.duration(400)} style={styles.intro}>
        {fromMood ? (
          <View style={styles.face}>
            <MoodFace mood={fromMood} size={60} />
          </View>
        ) : (
          <View style={[styles.icon, { backgroundColor: category.tint }]}>
            <CategoryIcon id={category.id} color={category.ink} size={26} />
          </View>
        )}
        <AppText variant="overline" tone="muted">
          {fromMood ? t.category.feeling(fromMood.phrase) : category.theme}
        </AppText>
        <AppText variant="display" accessibilityRole="header" style={styles.title}>
          {category.title}
        </AppText>
        <AppText tone="muted">{fromMood ? fromMood.reply : category.description}</AppText>
      </Animated.View>

      <Animated.View key={current.id} entering={FadeInDown.duration(450)}>
        <MessageCard message={current} showCategory={false} />
      </Animated.View>

      <View style={styles.actions}>
        <Button label={t.category.another} icon={RefreshCw} onPress={another} />
        <Button
          label={fromMood ? t.category.backHome : t.category.backToCategories}
          variant="ghost"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))}
        />
      </View>

    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.xl },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  face: { marginBottom: spacing.lg },
  title: { marginTop: spacing.xs, marginBottom: spacing.sm },
  actions: { marginTop: spacing.lg, gap: spacing.xs },
});
