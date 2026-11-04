import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { AppText } from './AppText';

/** Simple long-form text sections for Privacy / About. */
export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="heading" accessibilityRole="header" style={styles.heading}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <AppText tone="muted" style={styles.p}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  heading: { marginBottom: spacing.xs },
  p: { marginBottom: spacing.sm },
});
