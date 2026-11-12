import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Lock, MessageSquareQuote, Share2 } from '@/components/icons';
import { useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SHARE_TEMPLATES, ShareCard, type ShareCardHandle, type ShareTemplate } from '@/components/share/ShareCard';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { HIT_TARGET, lightColors, spacing } from '@/constants/theme';
import { getMessage } from '@/data/messages';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback } from '@/services/haptics';
import { usePlus } from '@/services/purchases';
import { shareCardImage, shareText } from '@/services/share';

export default function ShareScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plus = usePlus();
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const { prefs } = usePreferences();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const cardRef = useRef<ShareCardHandle>(null);
  const [template, setTemplate] = useState<ShareTemplate>(SHARE_TEMPLATES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const message = getMessage(id ?? '', locale);

  // Fit a 9:16 card in the space left after header, two rows of swatches and buttons.
  const available = height - insets.top - insets.bottom - 400;
  const cardWidth = Math.max(180, Math.min(width - spacing.lg * 2, 380, (available * 9) / 16));

  if (!message) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.pad}>
          <BackHeader variant="close" />
        </View>
        <EmptyState icon={MessageSquareQuote} title={t.share.unavailableTitle} body={t.share.unavailableBody} />
      </View>
    );
  }

  const onShare = async () => {
    setBusy(true);
    setError(null);
    try {
      await shareCardImage(cardRef, message, t.share.title);
    } catch {
      setError(t.share.error);
    } finally {
      setBusy(false);
    }
  };

  const onShareText = async () => {
    setError(null);
    try {
      await shareText(message);
    } catch {
      setError(t.share.error);
    }
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <View style={styles.pad}>
        <BackHeader variant="close" />
        <AppText variant="title" accessibilityRole="header">
          {t.share.title}
        </AppText>
      </View>

      <Animated.View entering={FadeIn.duration(350)} style={styles.preview}>
        <View style={styles.cardShadow}>
          <View style={styles.cardClip}>
            <ShareCard
              ref={cardRef}
              message={message}
              template={template}
              width={cardWidth}
              tagline={t.share.cardTagline}
              previewLabel={t.share.cardPreview(message.text)}
            />
          </View>
        </View>
      </Animated.View>

      <View style={styles.pad}>
        <View style={styles.swatches} accessibilityRole="radiogroup" accessibilityLabel={t.share.cardStyle}>
          {SHARE_TEMPLATES.map((tpl) => {
            const active = tpl.id === template.id;
            const locked = Boolean(tpl.plus) && !plus;
            return (
              <PressableScale
                key={tpl.id}
                onPress={() => {
                  selectionFeedback(prefs.hapticsEnabled);
                  // Locked styles explain A Little Better+ instead of applying.
                  if (locked) router.push('/settings/plus');
                  else setTemplate(tpl);
                }}
                scaleTo={0.92}
                accessibilityRole={locked ? 'button' : 'radio'}
                accessibilityLabel={
                  locked ? t.share.lockedStyle(t.share.templates[tpl.id]) : t.share.styleLabel(t.share.templates[tpl.id])
                }
                accessibilityState={locked ? undefined : { selected: active }}
                style={styles.swatchHit}
              >
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: tpl.background, borderColor: active ? colors.text : colors.border },
                    active && styles.swatchActive,
                  ]}
                >
                  {active ? <Check size={16} color={tpl.text} strokeWidth={2} /> : null}
                  {locked ? <Lock size={13} color={tpl.text} strokeWidth={1.8} /> : null}
                </View>
                <AppText variant="caption" tone={active ? 'default' : 'muted'}>
                  {t.share.templates[tpl.id]}
                </AppText>
              </PressableScale>
            );
          })}
        </View>

        {error ? (
          <AppText variant="caption" align="center" style={{ color: colors.danger, marginBottom: spacing.xs }}>
            {error}
          </AppText>
        ) : null}

        <Button label={t.share.shareImage} icon={Share2} onPress={onShare} loading={busy} />
        <Button label={t.share.shareText} variant="ghost" onPress={onShareText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { paddingHorizontal: spacing.lg, width: '100%', maxWidth: 640, alignSelf: 'center' },
  preview: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
  cardShadow: {
    borderRadius: 18,
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  cardClip: { borderRadius: 18, overflow: 'hidden' },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: spacing.md, rowGap: spacing.xs, marginBottom: spacing.md },
  swatchHit: { alignItems: 'center', minWidth: HIT_TARGET, gap: spacing.xxs },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: { borderWidth: 1.5 },
});
