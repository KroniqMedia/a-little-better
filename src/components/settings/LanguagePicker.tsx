import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { LOCALE_NAMES, LOCALES } from '@/i18n/locale';
import type { LanguagePreference } from '@/types';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

interface LanguagePickerProps {
  value: LanguagePreference;
  onChange: (value: LanguagePreference) => void;
  /** "Automatic" in the current language. */
  systemLabel: string;
  label: string;
}

/** Automatic · English · Español. Language names stay in their own language. */
export function LanguagePicker({ value, onChange, systemLabel, label }: LanguagePickerProps) {
  const { colors } = useTheme();
  const options: { id: LanguagePreference; name: string }[] = [
    { id: 'system', name: systemLabel },
    ...LOCALES.map((l) => ({ id: l, name: LOCALE_NAMES[l] })),
  ];

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <PressableScale
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="radio"
            accessibilityLabel={o.name}
            accessibilityState={{ selected: active }}
            style={[styles.chip, { backgroundColor: active ? colors.text : colors.background }]}
          >
            <AppText variant="caption" style={{ color: active ? colors.onAccent : colors.text }}>
              {o.name}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, padding: spacing.md },
  chip: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
});
