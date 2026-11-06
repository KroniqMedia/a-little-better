import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CategoryRow } from '@/components/category/CategoryRow';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { getCategories } from '@/data/categories';
import { useI18n } from '@/hooks/useI18n';

export default function ExploreScreen() {
  const router = useRouter();
  const { t, locale } = useI18n();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display" accessibilityRole="header">
          {t.explore.title}
        </AppText>
        <AppText tone="muted" style={styles.intro}>
          {t.explore.intro}
        </AppText>
      </View>

      <View style={styles.list}>
        {getCategories(locale).map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.duration(450).delay(60 * i)}>
            <CategoryRow
              category={c}
              onPress={() => router.push({ pathname: '/category/[id]', params: { id: c.id } })}
            />
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, marginBottom: spacing.xl },
  intro: { marginTop: spacing.xs, maxWidth: 420 },
  list: { gap: spacing.md },
});
