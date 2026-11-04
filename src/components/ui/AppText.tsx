import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

type Variant = keyof ReturnType<typeof useTheme>['type'];
type Tone = 'default' | 'muted' | 'subtle' | 'accent' | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: 'left' | 'center' | 'right';
}

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
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[type[variant], { color }, align && { textAlign: align }, style]}
    />
  );
}
