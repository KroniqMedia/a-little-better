import { useRouter } from 'expo-router';
import { Heart } from '@/components/icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { MessageCard } from '@/components/message/MessageCard';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/providers/FavoritesProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { tapFeedback } from '@/services/haptics';

export default function SavedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { ready, saved, remove } = useFavorites();
  const { prefs } = usePreferences();

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
        <View style={styles.list}>
          {saved.map(({ message }) => (
            <Animated.View
              key={message.id}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(220)}
              layout={LinearTransition.duration(260)}
            >
              <MessageCard
                message={message}
                size="compact"
                onRemove={() => {
                  tapFeedback(prefs.hapticsEnabled);
                  remove(message.id);
                }}
              />
            </Animated.View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, marginBottom: spacing.xl },
  count: { marginTop: spacing.xs },
  loading: { marginTop: spacing.xxl },
  list: { gap: spacing.md },
});
