import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { P, ProseSection } from '@/components/ui/Prose';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { ALL_MESSAGES } from '@/data/messages';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { appVersion } from '@/utils/appInfo';

export default function AboutScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />
      <AppText variant="display" accessibilityRole="header">
        A little better.
      </AppText>
      <AppText tone="muted" style={styles.tagline}>
        {t.about.tagline}
      </AppText>

      <View style={[styles.rule, { backgroundColor: colors.accent }]} />

      <ProseSection title={t.about.whyTitle}>
        {t.about.why.map((p) => (
          <P key={p}>{p}</P>
        ))}
      </ProseSection>

      <ProseSection title={t.about.messagesTitle}>
        {t.about.messages(ALL_MESSAGES.length).map((p) => (
          <P key={p}>{p}</P>
        ))}
      </ProseSection>

      <ProseSection title={t.about.noteTitle}>
        <P>{t.about.note}</P>
      </ProseSection>

      <AppText variant="caption" tone="subtle" style={styles.version}>
        {t.about.version(appVersion())}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tagline: { marginTop: spacing.xs },
  rule: { width: 32, height: 2, borderRadius: 1, marginVertical: spacing.xl },
  version: { marginTop: spacing.md },
});
