import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { WarmGlow } from '@/components/ui/WarmGlow';
import { spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';

/**
 * Shown once. One screen, no questions and no permission prompts: the
 * reminder is offered later, after the person has seen what it would bring.
 */
export default function WelcomeScreen() {
  const { colors, scheme } = useTheme();
  const { t } = useI18n();
  const { update } = usePreferences();

  return (
    <Screen edges={['top', 'bottom']} background={<WarmGlow dark={scheme === 'dark'} />}>
      <View style={styles.content}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.top}>
        <AppText variant="display" accessibilityRole="header">
          A little better.
        </AppText>
        <View style={[styles.rule, { backgroundColor: colors.accent }]} />
        {t.welcome.body.map((p, i) => (
          <AppText key={p} tone={i === 0 ? 'default' : 'muted'} variant={i === 0 ? 'messageSmall' : 'body'} style={styles.p}>
            {p}
          </AppText>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(250)}>
        <Button label={t.welcome.start} onPress={() => update({ welcomed: true })} />
      </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between' },
  top: { paddingTop: spacing.xxl, marginBottom: spacing.xl },
  rule: { width: 32, height: 2, borderRadius: 1, marginVertical: spacing.lg },
  p: { marginBottom: spacing.md },
});
