import { StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { P, ProseSection } from '@/components/ui/Prose';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';

export default function PrivacyScreen() {
  const { t } = useI18n();
  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />
      <AppText variant="display" accessibilityRole="header" style={styles.title}>
        {t.privacy.title}
      </AppText>
      <AppText variant="messageSmall" style={styles.lede}>
        {t.privacy.lede}
      </AppText>

      {t.privacy.sections.map((section) => (
        <ProseSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <P key={paragraph}>{paragraph}</P>
          ))}
        </ProseSection>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.xs },
  lede: { marginBottom: spacing.xl },
});
