import type { MoodId } from '@/data/moods';
/**
 * Centralised design tokens for A Little Better.
 *
 * Components read colors through `useTheme()` rather than importing `palette`
 * directly, so a dark scheme can be added later by supplying a second
 * `ColorScheme` object without touching component code.
 */

export const palette = {
  ivory: '#EDE7DC',
  cream: '#F5F1E9',
  charcoal: '#33352F',
  grey: '#77746A',
  sage: '#A8B3A0',
  clay: '#D5A78F',
  white: '#FFFFFF',
} as const;

export interface ColorScheme {
  background: string;
  surface: string;
  surfaceRaised: string;
  /** Warm paper tone for featured cards. */
  card: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentStrong: string;
  accentSecondary: string;
  border: string;
  divider: string;
  shadow: string;
  danger: string;
  onAccent: string;
}

export const lightColors: ColorScheme = {
  background: palette.ivory,
  surface: palette.cream,
  surfaceRaised: palette.white,
  card: '#FFFCF6',
  text: palette.charcoal,
  textMuted: palette.grey,
  textSubtle: '#A29E93',
  accent: palette.sage,
  accentStrong: '#7F8C77',
  accentSecondary: palette.clay,
  border: 'rgba(51, 53, 47, 0.08)',
  divider: 'rgba(51, 53, 47, 0.06)',
  shadow: '#5A5245',
  danger: '#B5735A',
  onAccent: palette.white,
};

/**
 * One soft tone per mood face. All share the same low saturation and light
 * fill so the six sit together calmly on ivory; ink is the same hue, darkened
 * for at least 4.5:1 contrast on its fill.
 */
export const faceColors = {
  cheek: palette.clay,
  good: { fill: '#F2E2BE', ink: '#6E5226' }, // honey
  overwhelmed: { fill: '#F0D9CF', ink: '#7A4A3A' }, // rose clay
  unsure: { fill: '#DDE4D4', ink: '#4F5D46' }, // sage
  stuck: { fill: '#D6E4E1', ink: '#3F5C58' }, // misty teal
  down: { fill: '#DCE3E9', ink: '#475968' }, // dusty blue
  nervous: { fill: '#E4DEEA', ink: '#584D6B' }, // lavender
} as const satisfies Record<MoodId | 'cheek', unknown>;

export const fonts = {
  serif: 'DMSerifDisplay_400Regular',
  serifItalic: 'DMSerifDisplay_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
} as const;

export const type = {
  display: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, letterSpacing: -0.4 },
  message: { fontFamily: fonts.serif, fontSize: 29, lineHeight: 37, letterSpacing: -0.2 },
  messageSmall: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 29, letterSpacing: -0.1 },
  title: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30 },
  heading: { fontFamily: fonts.sansSemiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: fonts.sansMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 2,
  },
  soft: {
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
} as const;

/** Minimum touch target in points (Apple HIG 44, Material 48). */
export const HIT_TARGET = 48;

export const theme = { colors: lightColors, fonts, spacing, radius, type, shadows };
export type Theme = typeof theme;
