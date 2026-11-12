import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

interface ChoiceChipsProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group for screen readers. */
  label: string;
}

/** A row of mutually exclusive chips (a radio group) for settings. */
export function ChoiceChips<T extends string>({ options, value, onChange, label }: ChoiceChipsProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <PressableScale
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: active, checked: active }}
            style={[styles.chip, { backgroundColor: active ? colors.text : colors.background }]}
          >
            <AppText variant="caption" align="center" style={{ color: active ? colors.onAccent : colors.text }}>
              {o.label}
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
    paddingVertical: spacing.xs,
  },
});
