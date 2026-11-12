import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

type Variant = keyof ReturnType<typeof useTheme>['type'];
type Tone = 'default' | 'muted' | 'subtle' | 'accent' | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: 'left' | 'center' | 'right';
}

/**
 * How far each style may grow with the system text size. Body text can grow a
 * lot; the large serif styles are already big, so they grow less and still fit.
 */
const MAX_SCALE: Partial<Record<Variant, number>> = { display: 1.4, message: 1.4, title: 1.5, messageSmall: 1.6 };

export function AppText({ variant = 'body', tone = 'default', align, style, ...rest }: AppTextProps) {
  const { type, colors } = useTheme();
  const color = {
    default: colors.text,
    muted: colors.textMuted,
    subtle: colors.textSubtle,
    accent: colors.accentStrong,
    inverse: colors.onAccent,
  }[tone];
  return (
    <Text
      maxFontSizeMultiplier={MAX_SCALE[variant] ?? 2}
      {...rest}
      style={[type[variant], { color }, align && { textAlign: align }, style]}
    />
  );
}
