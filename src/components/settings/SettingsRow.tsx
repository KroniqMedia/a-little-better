import { ChevronRight } from '@/components/icons';
import type { LucideIcon } from '@/components/icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { HIT_TARGET, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '../ui/AppText';

interface BaseProps {
  icon: LucideIcon;
  label: string;
  description?: string;
}

type RowProps = BaseProps &
  (
    | { kind: 'switch'; value: boolean; onValueChange: (v: boolean) => void; disabled?: boolean }
    | { kind: 'link'; onPress: () => void; value?: string }
    | { kind: 'value'; value: string }
  );

export function SettingsRow(props: RowProps) {
  const { colors } = useTheme();
  const { icon: Icon, label, description } = props;

  const body = (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: colors.background }]}>
        <Icon size={18} color={colors.accentStrong} strokeWidth={1.6} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyMedium">{label}</AppText>
        {description ? (
          <AppText variant="caption" tone="muted" style={styles.desc}>
            {description}
          </AppText>
        ) : null}
      </View>
      {props.kind === 'switch' ? (
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          disabled={props.disabled}
          trackColor={{ false: '#D9D3C7', true: colors.accent }}
          thumbColor={colors.surfaceRaised}
          ios_backgroundColor="#D9D3C7"
          accessibilityLabel={label}
        />
      ) : null}
      {props.kind === 'value' ? <AppText tone="muted">{props.value}</AppText> : null}
      {props.kind === 'link' ? (
        <View style={styles.linkRight}>
          {props.value ? <AppText tone="muted">{props.value}</AppText> : null}
          <ChevronRight size={18} color={colors.textSubtle} strokeWidth={1.6} />
        </View>
      ) : null}
    </View>
  );

  if (props.kind === 'link') {
    return (
      <Pressable
        onPress={props.onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        android_ripple={{ color: colors.divider }}
        style={({ pressed }) => pressed && { opacity: 0.6 }}
      >
        {body}
      </Pressable>
    );
  }
  return body;
}

export function SettingsGroup({ title, children }: { title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.group}>
      {title ? (
        <AppText variant="overline" tone="muted" style={styles.groupTitle}>
          {title}
        </AppText>
      ) : null}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

export function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.divider }]} />;
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.lg },
  groupTitle: { marginBottom: spacing.xs, marginLeft: spacing.xxs },
  card: { borderRadius: 20, overflow: 'hidden' },
  row: {
    minHeight: HIT_TARGET + 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  desc: { marginTop: 2 },
  linkRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: spacing.md + 34 + spacing.sm },
});
