import { useRouter } from 'expo-router';
import { ArrowLeft, X } from '@/components/icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { IconButton } from './IconButton';

interface BackHeaderProps {
  variant?: 'back' | 'close';
  right?: ReactNode;
}

/** Minimal header row for stacked screens: a back (or close) button and an optional action. */
export function BackHeader({ variant = 'back', right }: BackHeaderProps) {
  const router = useRouter();
  const { t } = useI18n();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={styles.row}>
      <View style={styles.offset}>
        <IconButton
          icon={variant === 'back' ? ArrowLeft : X}
          onPress={goBack}
          accessibilityLabel={variant === 'back' ? t.nav.back : t.nav.close}
        />
      </View>
      {right ? <View style={styles.offsetRight}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  offset: { marginLeft: -spacing.sm },
  offsetRight: { marginRight: -spacing.sm },
});
