import { ChevronRight } from '@/components/icons';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { CategoryIcon } from './CategoryIcon';

/** Larger editorial row used on the Explore screen. */
export function CategoryRow({ category, count, onPress }: { category: Category; count: number; onPress: () => void }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={t.category.rowLabel(category.title, category.theme, count)}
      style={[styles.row, { backgroundColor: category.tint }]}
    >
      <View style={styles.top}>
        <View style={styles.icon}>
          <CategoryIcon id={category.id} color={category.ink} size={24} />
        </View>
        <View style={styles.count}>
          <AppText variant="caption" tone="muted">
            {t.category.count(count)}
          </AppText>
          <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
        </View>
      </View>
      <AppText variant="title">{category.title}</AppText>
      <AppText variant="overline" tone="muted" style={styles.theme}>
        {category.theme}
      </AppText>
      <AppText tone="muted" numberOfLines={2}>
        {category.description}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: radius.lg, padding: spacing.lg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  theme: { marginTop: spacing.xxs, marginBottom: spacing.sm },
});
