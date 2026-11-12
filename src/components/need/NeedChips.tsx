import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { NEEDS } from '@/data/needs';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import type { NeedId } from '@/types';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { NeedIcon } from './NeedIcon';

interface NeedChipsProps {
  onSelect: (need: NeedId) => void;
  /** Highlighted need, if any. */
  selected?: NeedId;
  /** Names the group for screen readers. */
  label: string;
  accessibilityHint?: string;
}

/** Comfort · Another view · A small step, as small pill buttons. */
export function NeedChips({ onSelect, selected, label, accessibilityHint }: NeedChipsProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <View style={styles.chips} accessibilityLabel={label}>
      {NEEDS.map(({ id }) => {
        const active = selected === id;
        return (
          <PressableScale
            key={id}
            onPress={() => onSelect(id)}
            scaleTo={0.95}
            accessibilityRole="button"
            accessibilityLabel={t.needs[id].label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              active
                ? { backgroundColor: colors.text, borderColor: colors.text }
                : { backgroundColor: 'transparent', borderColor: colors.border },
            ]}
          >
            <NeedIcon id={id} size={15} color={active ? colors.onAccent : colors.textMuted} />
            <AppText variant="caption" style={{ color: active ? colors.onAccent : colors.text }}>
              {t.needs[id].label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
