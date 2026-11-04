import { StyleSheet, View } from 'react-native';

import { faceColors, radius, spacing } from '@/constants/theme';
import { getMoods, type Mood } from '@/data/moods';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { MoodFace } from './MoodFace';

interface MoodPickerProps {
  selected?: Mood;
  onSelect: (mood: Mood) => void;
}

/** A 3x2 grid of faces: "How do you feel today?" */
export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const moods = getMoods(locale);
  const rows = [moods.slice(0, 3), moods.slice(3, 6)];

  return (
    <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel={t.home.checkinTitle}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((mood) => {
            const active = selected?.id === mood.id;
            return (
              <PressableScale
                key={mood.id}
                onPress={() => onSelect(mood)}
                scaleTo={0.94}
                accessibilityRole="radio"
                accessibilityLabel={mood.label}
                accessibilityHint={t.home.moodHint}
                accessibilityState={{ selected: active }}
                style={[
                  styles.tile,
                  active
                    ? { backgroundColor: colors.card, borderColor: `${faceColors[mood.id].ink}66` }
                    : { backgroundColor: colors.surface, borderColor: 'transparent' },
                ]}
              >
                <MoodFace mood={mood} size={58} />
                <AppText
                  variant="caption"
                  align="center"
                  numberOfLines={1}
                  style={[styles.label, { color: active ? colors.text : colors.textMuted }]}
                >
                  {mood.label}
                </AppText>
              </PressableScale>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  label: { marginTop: spacing.xs },
});
