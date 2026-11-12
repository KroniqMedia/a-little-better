import { Pin, PinOff, Share2, Trash2 } from '@/components/icons';
import { StyleSheet, View } from 'react-native';

import { getCategory } from '@/data/categories';
import { localizeMessage } from '@/data/messages';
import { fonts, radius, shadows, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useMessageActions } from '@/hooks/useMessageActions';
import { useTheme } from '@/hooks/useTheme';
import type { Message } from '@/types';
import { AppText } from '../ui/AppText';
import { IconButton } from '../ui/IconButton';
import { SaveButton } from './SaveButton';

interface MessageCardProps {
  message: Message;
  /** 'feature' is the large editorial card; 'compact' is for lists. */
  size?: 'feature' | 'compact';
  showCategory?: boolean;
  /** Overline label override (e.g. "Today"). */
  label?: string;
  /** Replace the heart with a remove button (Saved screen). */
  onRemove?: () => void;
  /** Saved screen: pin to / unpin from "To come back to". */
  pinned?: boolean;
  onTogglePin?: () => void;
}

export function MessageCard({
  message,
  size = 'feature',
  showCategory = true,
  label,
  onRemove,
  pinned,
  onTogglePin,
}: MessageCardProps) {
  const { colors, scheme } = useTheme();
  const { t, locale } = useI18n();
  const { saved, toggleSave, share } = useMessageActions(message);
  const category = getCategory(message.category, locale, scheme);
  // Messages are picked by ID; show them in the current language.
  const { text, support } = localizeMessage(message, locale);
  const feature = size === 'feature';
  const overline = label ?? (showCategory ? category?.theme : undefined);

  return (
    <View
      style={[
        styles.card,
        feature ? styles.feature : styles.compact,
        { backgroundColor: feature ? colors.card : colors.surface },
        feature && shadows.card,
      ]}
      accessible={false}
    >
      {overline ? (
        <View style={styles.overlineRow}>
          <View style={[styles.dot, { backgroundColor: category?.ink ?? colors.accent }]} />
          <AppText variant="overline" tone="muted">
            {overline}
          </AppText>
        </View>
      ) : null}

      {feature ? (
        <AppText
          allowFontScaling={false}
          importantForAccessibility="no"
          style={[styles.quote, { color: colors.accentSecondary }]}
        >
          {'“'}
        </AppText>
      ) : null}

      <AppText variant={feature ? 'message' : 'messageSmall'} accessibilityRole="text">
        {text}
      </AppText>

      {support ? (
        <AppText tone="muted" style={styles.support}>
          {support}
        </AppText>
      ) : null}

      <View style={[styles.actions, { borderTopColor: colors.divider }]}>
        {onRemove ? (
          <IconButton icon={Trash2} onPress={onRemove} accessibilityLabel={t.message.unsave} color={colors.textMuted} size={20} />
        ) : (
          <SaveButton saved={saved} onPress={toggleSave} labels={t.message} />
        )}
        {onTogglePin ? (
          <IconButton
            icon={pinned ? PinOff : Pin}
            onPress={onTogglePin}
            accessibilityLabel={pinned ? t.saved.unpin : t.saved.pin}
            color={pinned ? colors.accentStrong : colors.textMuted}
            size={20}
          />
        ) : null}
        <IconButton icon={Share2} onPress={share} accessibilityLabel={t.message.share} size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg },
  feature: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xs },
  compact: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxs },
  overlineRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3 },
  quote: { fontFamily: fonts.serif, fontSize: 56, lineHeight: 44, marginTop: -spacing.xs, marginBottom: -spacing.md, opacity: 0.8 },
  support: { marginTop: spacing.md },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    paddingTop: spacing.xxs,
    marginHorizontal: -spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
