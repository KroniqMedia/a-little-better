import type { MoodId } from '@/data/moods';
import type { AccentId, ColorSchemeName } from '@/types';
/**
 * Centralised design tokens for A Little Better.
 *
 * Components read colors through `useTheme()` rather than importing `palette`
 * directly; the hook picks the light or dark scheme.
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
  /** Text and icons drawn on a `text`-colored fill (primary buttons, active chips). */
  onAccent: string;
  /** Switch track when off. */
  trackOff: string;
}

// Text tones meet WCAG AA (4.5:1) on background, surface and card.
export const lightColors: ColorScheme = {
  background: palette.ivory,
  surface: palette.cream,
  surfaceRaised: palette.white,
  card: '#FFFCF6',
  text: palette.charcoal,
  textMuted: '#5F5C53',
  textSubtle: '#6B685F',
  accent: palette.sage,
  accentStrong: '#5E6B57',
  accentSecondary: palette.clay,
  border: 'rgba(51, 53, 47, 0.08)',
  divider: 'rgba(51, 53, 47, 0.06)',
  shadow: '#5A5245',
  danger: '#9C5A42',
  onAccent: palette.white,
  trackOff: '#D9D3C7',
};

/** Warm, low-glare evening version of the same palette. */
export const darkColors: ColorScheme = {
  background: '#1C1D1A',
  surface: '#252723',
  surfaceRaised: '#30322D',
  card: '#2A2C27',
  text: '#EDE7DC',
  textMuted: '#B3AFA4',
  textSubtle: '#A29E93',
  accent: '#7F8C77',
  accentStrong: '#B8C3AF',
  accentSecondary: palette.clay,
  border: 'rgba(237, 231, 220, 0.10)',
  divider: 'rgba(237, 231, 220, 0.08)',
  shadow: '#000000',
  danger: '#E0A08A',
  onAccent: '#1C1D1A',
  trackOff: '#4A4C46',
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

const base = { fonts, spacing, radius, type, shadows };

export interface Theme {
  scheme: ColorSchemeName;
  colors: ColorScheme;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
  shadows: typeof shadows;
}

type AccentColors = Pick<ColorScheme, 'accent' | 'accentStrong' | 'accentSecondary'>;

/**
 * Accent sets (A Little Better+ personalisation). `accentStrong` is used for
 * icons and small text, so it keeps 4.5:1 on the background in both schemes.
 */
export const ACCENTS: Record<AccentId, Record<ColorSchemeName, AccentColors> & { swatch: string }> = {
  sage: {
    swatch: palette.sage,
    light: { accent: lightColors.accent, accentStrong: lightColors.accentStrong, accentSecondary: lightColors.accentSecondary },
    dark: { accent: darkColors.accent, accentStrong: darkColors.accentStrong, accentSecondary: darkColors.accentSecondary },
  },
  clay: {
    swatch: palette.clay,
    light: { accent: '#D5A78F', accentStrong: '#8A5A45', accentSecondary: '#A8B3A0' },
    dark: { accent: '#A87B66', accentStrong: '#E0B8A3', accentSecondary: '#A8B3A0' },
  },
  lavender: {
    swatch: '#B9B0CC',
    light: { accent: '#B9B0CC', accentStrong: '#5E5577', accentSecondary: '#D5A78F' },
    dark: { accent: '#7E7596', accentStrong: '#C9C0DC', accentSecondary: '#D5A78F' },
  },
  sea: {
    swatch: '#9FBDB8',
    light: { accent: '#9FBDB8', accentStrong: '#3F5C58', accentSecondary: '#D5A78F' },
    dark: { accent: '#5F837E', accentStrong: '#A9CBC5', accentSecondary: '#D5A78F' },
  },
};

const BASE_COLORS: Record<ColorSchemeName, ColorScheme> = { light: lightColors, dark: darkColors };
const themeCache = new Map<string, Theme>();

export function getTheme(scheme: ColorSchemeName, accent: AccentId = 'sage'): Theme {
  const key = `${scheme}:${accent}`;
  let theme = themeCache.get(key);
  if (!theme) {
    theme = { scheme, colors: { ...BASE_COLORS[scheme], ...ACCENTS[accent][scheme] }, ...base };
    themeCache.set(key, theme);
  }
  return theme;
}
