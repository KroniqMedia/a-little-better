import type { LucideIcon } from '@/components/icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { HIT_TARGET, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
}

export function Button({ label, onPress, icon: Icon, variant = 'primary', loading, disabled, accessibilityHint }: ButtonProps) {
  const { colors } = useTheme();
  const bg = { primary: colors.text, secondary: colors.surfaceRaised, ghost: 'transparent' }[variant];
  const fg = variant === 'primary' ? colors.onAccent : colors.text;
  const inactive = disabled || loading;

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={[
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        variant === 'secondary' && { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon size={18} color={fg} strokeWidth={1.7} /> : null}
          <AppText variant="bodyMedium" style={{ color: fg }}>
            {label}
          </AppText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: HIT_TARGET + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
