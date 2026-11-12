import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Check, Lock } from '@/components/icons';
import { SHARE_TEMPLATES } from '@/components/share/ShareCard';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { P, ProseSection } from '@/components/ui/Prose';
import { Screen } from '@/components/ui/Screen';
import { TextLink } from '@/components/ui/TextLink';
import { ACCENTS, HIT_TARGET, radius, spacing } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/providers/PreferencesProvider';
import { selectionFeedback, successFeedback } from '@/services/haptics';
import { buyPlus, getPlusPrice, restorePlus, setPlusForDevelopment, storeConnected, usePlus } from '@/services/purchases';
import type { AccentId } from '@/types';

const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[];

/**
 * The only place the purchase is offered. Reached from Settings or a locked
 * share style; never from a feeling or a need.
 */
export default function PlusScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { prefs, update } = usePreferences();
  const plus = usePlus();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const connected = storeConnected();

  useEffect(() => {
    let alive = true;
    getPlusPrice()
      .then((p) => alive && setPrice(p))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const onBuy = async () => {
    setBusy(true);
    setNote(null);
    const result = await buyPlus();
    setBusy(false);
    if (result === 'purchased') successFeedback(prefs.hapticsEnabled);
    else if (result === 'error') setNote(t.plus.error);
  };

  const onRestore = async () => {
    setBusy(true);
    setNote(null);
    const found = await restorePlus();
    setBusy(false);
    if (!found) setNote(t.plus.restoreNone);
  };

  const plusTemplates = SHARE_TEMPLATES.filter((tpl) => tpl.plus);

  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />
      <AppText variant="display" accessibilityRole="header">
        {t.plus.title}
      </AppText>
      <AppText tone="muted" style={styles.lede}>
        {t.plus.lede}
      </AppText>

      <ProseSection title={t.plus.includedTitle}>
        {t.plus.included.map((line) => (
          <P key={line}>{line}</P>
        ))}
        <View style={styles.swatches} accessible accessibilityLabel={plusTemplates.map((tpl) => t.share.templates[tpl.id]).join(', ')}>
          {plusTemplates.map((tpl) => (
            <View key={tpl.id} style={[styles.card, { backgroundColor: tpl.background, borderColor: colors.border }]}>
              <View style={[styles.cardRule, { backgroundColor: tpl.accent }]} />
              <AppText variant="caption" style={{ color: tpl.text }}>
                {t.share.templates[tpl.id]}
              </AppText>
            </View>
          ))}
        </View>
      </ProseSection>

      <ProseSection title={t.plus.accentTitle}>
        <View style={styles.accents} accessibilityRole="radiogroup" accessibilityLabel={t.plus.accentTitle}>
          {ACCENT_IDS.map((id) => {
            const active = (plus ? prefs.accent : 'sage') === id;
            const locked = !plus && id !== 'sage';
            return (
              <PressableScale
                key={id}
                disabled={locked}
                onPress={() => {
                  selectionFeedback(prefs.hapticsEnabled);
                  update({ accent: id });
                }}
                accessibilityRole="radio"
                accessibilityLabel={locked ? `${t.plus.accents[id]}. ${t.plus.locked}` : t.plus.accents[id]}
                accessibilityState={{ selected: active, checked: active, disabled: locked }}
                style={styles.accent}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: ACCENTS[id].swatch, borderColor: active ? colors.text : 'transparent', opacity: locked ? 0.55 : 1 },
                  ]}
                >
                  {active ? <Check size={16} color={colors.text} strokeWidth={2} /> : null}
                  {locked ? <Lock size={14} color={colors.text} strokeWidth={1.8} /> : null}
                </View>
                <AppText variant="caption" tone={active ? 'default' : 'muted'}>
                  {t.plus.accents[id]}
                </AppText>
              </PressableScale>
            );
          })}
        </View>
      </ProseSection>

      <ProseSection title={t.plus.freeTitle}>
        <P>{t.plus.free}</P>
      </ProseSection>

      <View style={styles.actions}>
        {plus ? (
          <AppText align="center" style={styles.owned}>
            {t.plus.owned}
          </AppText>
        ) : connected && price ? (
          <Button label={t.plus.buy(price)} onPress={onBuy} loading={busy} />
        ) : (
          <>
            <Button label={t.plus.comingSoon} onPress={() => {}} disabled />
            <AppText variant="caption" tone="muted" align="center">
              {t.plus.comingSoonNote}
            </AppText>
          </>
        )}
        {!plus && connected ? <TextLink label={t.plus.restore} onPress={onRestore} align="center" /> : null}
        {note ? (
          <AppText variant="caption" tone="muted" align="center" accessibilityLiveRegion="polite">
            {note}
          </AppText>
        ) : null}
        {__DEV__ ? (
          <TextLink
            label={plus ? t.plus.devLock : t.plus.devUnlock}
            onPress={() => setPlusForDevelopment(!plus)}
            align="center"
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: spacing.xs, marginBottom: spacing.xl },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  card: {
    width: 72,
    height: 96,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xs,
    justifyContent: 'flex-end',
  },
  cardRule: { width: 18, height: 2, borderRadius: 1, marginBottom: spacing.xxs },
  accents: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  accent: { alignItems: 'center', gap: spacing.xxs, minWidth: HIT_TARGET },
  dot: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actions: { marginTop: spacing.md, gap: spacing.sm },
  owned: { marginBottom: spacing.xs },
});
