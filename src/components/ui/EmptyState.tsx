import type { LucideIcon } from '@/components/icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.wrap}>
      <View style={[styles.badge, { backgroundColor: colors.surface }]}>
        <Icon size={26} color={colors.accentStrong} strokeWidth={1.5} />
      </View>
      <AppText variant="title" align="center" style={styles.title}>
        {title}
      </AppText>
      <AppText tone="muted" align="center" style={styles.body}>
        {body}
      </AppText>
      {action ? <View style={styles.action}>{action}</View> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.md },
  badge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { marginBottom: spacing.xs },
  body: { maxWidth: 280 },
  action: { marginTop: spacing.lg },
});
