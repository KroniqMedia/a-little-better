import type { LucideIcon } from '@/components/icons';
import { StyleSheet, View } from 'react-native';

import { HIT_TARGET, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface TextLinkProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  accessibilityHint?: string;
  /** For disclosure toggles. */
  expanded?: boolean;
  align?: 'left' | 'center';
}

/** A quiet, underlined text action with a full-size touch target. */
export function TextLink({ label, onPress, icon: Icon, accessibilityHint, expanded, align = 'left' }: TextLinkProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      style={[styles.base, align === 'center' && styles.center]}
    >
      <View style={styles.row}>
        {Icon ? <Icon size={16} color={colors.textMuted} strokeWidth={1.7} /> : null}
        <AppText variant="bodyMedium" style={[styles.text, { color: colors.text, textDecorationColor: colors.accentSecondary }]}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: HIT_TARGET, justifyContent: 'center', alignSelf: 'flex-start' },
  center: { alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  text: { textDecorationLine: 'underline' },
});
