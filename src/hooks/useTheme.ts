import { theme, type Theme } from '@/constants/theme';

/**
 * Single access point for theme tokens. Light mode only for now; when dark
 * mode lands, this hook can read `useColorScheme()` and return a dark scheme.
 */
export function useTheme(): Theme {
  return theme;
}
