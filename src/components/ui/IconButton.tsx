import type { LucideIcon } from '@/components/icons';
import { StyleSheet } from 'react-native';

import { HIT_TARGET } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { PressableScale } from './PressableScale';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  accessibilityLabel: string;
  color?: string;
  size?: number;
  variant?: 'plain' | 'soft';
}

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  color,
  size = 22,
  variant = 'plain',
}: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      scaleTo={0.9}
      style={[styles.base, variant === 'soft' && { backgroundColor: colors.surface }]}
    >
      <Icon size={size} color={color ?? colors.text} strokeWidth={1.6} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: HIT_TARGET,
    height: HIT_TARGET,
    borderRadius: HIT_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
