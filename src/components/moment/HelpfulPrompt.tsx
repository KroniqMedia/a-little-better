import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/providers/FavoritesProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { addHelped, removeHelped } from '@/services/helped';
import { selectionFeedback, successFeedback } from '@/services/haptics';
import type { Message } from '@/types';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { TextLink } from '../ui/TextLink';

type State = 'asked' | 'yes' | 'no' | 'kept' | 'kept-saved';

/**
 * "Did this help?", optional and answered only on this phone. A yes offers to
 * keep the message in "To come back to"; a no offers a different kind.
 */
export function HelpfulPrompt({ message, onTryDifferent }: { message: Message; onTryDifferent: () => void }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { prefs } = usePreferences();
  const { isSaved, toggle, togglePin, saved } = useFavorites();
  const [state, setState] = useState<State>('asked');
  const alreadyPinned = saved.some((s) => s.message.id === message.id && s.pinned);

  const answer = (helped: boolean) => {
    selectionFeedback(prefs.hapticsEnabled);
    if (helped) addHelped(message.id);
    else removeHelped(message.id);
    setState(helped ? 'yes' : 'no');
  };

  const keep = () => {
    if (!isSaved(message.id)) toggle(message.id);
    const result = togglePin(message.id);
    successFeedback(prefs.hapticsEnabled);
    setState(result === 'full' ? 'kept-saved' : 'kept');
  };

  if (state === 'asked') {
    return (
      <View style={styles.row}>
        <AppText variant="caption" tone="muted" style={styles.question}>
          {t.helpful.question}
        </AppText>
        {[
          { label: t.helpful.yes, value: true },
          { label: t.helpful.no, value: false },
        ].map(({ label, value }) => (
          <PressableScale
            key={label}
            onPress={() => answer(value)}
            accessibilityRole="button"
            accessibilityLabel={`${t.helpful.question} ${label}`}
            hitSlop={4}
            style={[styles.chip, { borderColor: colors.border }]}
          >
            <AppText variant="caption">{label}</AppText>
          </PressableScale>
        ))}
      </View>
    );
  }

  const text =
    state === 'yes' ? t.helpful.thanks : state === 'no' ? t.helpful.noReply : state === 'kept' ? t.helpful.kept : t.helpful.keptSaved;

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.reply}>
      <AppText variant="caption" tone="muted" align="center" accessibilityLiveRegion="polite">
        {text}
      </AppText>
      {state === 'yes' && !alreadyPinned ? <TextLink label={t.helpful.keep} onPress={keep} align="center" /> : null}
      {state === 'no' ? <TextLink label={t.helpful.tryDifferent} onPress={onTryDifferent} align="center" /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  question: { marginRight: spacing.xxs },
  chip: {
    minHeight: 40,
    minWidth: 56,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reply: { marginTop: spacing.md, alignItems: 'center' },
});
