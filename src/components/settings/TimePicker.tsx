import { Minus, Plus } from '@/components/icons';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { formatTime } from '@/utils/date';
import { AppText } from '../ui/AppText';
import { IconButton } from '../ui/IconButton';
import { PressableScale } from '../ui/PressableScale';

interface TimePickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}

const PRESETS: readonly [number, number, 'early' | 'morning' | 'midday' | 'evening'][] = [
  [7, 30, 'early'],
  [9, 0, 'morning'],
  [12, 30, 'midday'],
  [20, 0, 'evening'],
];

const STEP = 15;

/** Brand-styled time picker: 15-minute steps plus a few gentle presets. */
export function TimePicker({ hour, minute, onChange }: TimePickerProps) {
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const format = (h: number, m: number) => formatTime(h, m, locale);
  const total = hour * 60 + minute;

  const shift = (delta: number) => {
    const next = (((Math.round(total / STEP) * STEP + delta) % 1440) + 1440) % 1440;
    onChange(Math.floor(next / 60), next % 60);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.stepper}>
        <IconButton icon={Minus} variant="soft" onPress={() => shift(-STEP)} accessibilityLabel={t.time.earlier} size={18} />
        <AppText
          variant="title"
          align="center"
          style={styles.time}
          accessibilityLiveRegion="polite"
          accessibilityLabel={t.time.label(format(hour, minute))}
        >
          {format(hour, minute)}
        </AppText>
        <IconButton icon={Plus} variant="soft" onPress={() => shift(STEP)} accessibilityLabel={t.time.later} size={18} />
      </View>
      <View style={styles.presets}>
        {PRESETS.map(([h, m, key]) => {
          const label = t.time.presets[key];
          const active = h === hour && m === minute;
          return (
            <PressableScale
              key={key}
              onPress={() => onChange(h, m)}
              accessibilityRole="button"
              accessibilityLabel={`${label}, ${format(h, m)}`}
              accessibilityState={{ selected: active }}
              style={[
                styles.chip,
                { backgroundColor: active ? colors.text : colors.background },
              ]}
            >
              <AppText variant="caption" style={{ color: active ? colors.onAccent : colors.text }}>
                {label}
              </AppText>
              <AppText variant="caption" style={{ color: active ? colors.onAccent : colors.textMuted, fontSize: 11 }}>
                {format(h, m)}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, paddingTop: spacing.xs },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { flex: 1 },
  presets: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  chip: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
});
