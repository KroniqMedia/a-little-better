import { forwardRef, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, palette } from '@/constants/theme';
import type { Message } from '@/types';
import { AppText } from '../ui/AppText';

export interface ShareTemplate {
  id: 'ivory' | 'cream' | 'sage' | 'charcoal' | 'dawn' | 'mist' | 'forest' | 'night';
  /** Part of A Little Better+. */
  plus?: boolean;
  background: string;
  text: string;
  muted: string;
  accent: string;
}

export const SHARE_TEMPLATES: readonly ShareTemplate[] = [
  { id: 'ivory', background: palette.ivory, text: palette.charcoal, muted: palette.grey, accent: palette.sage },
  { id: 'cream', background: palette.cream, text: palette.charcoal, muted: palette.grey, accent: palette.clay },
  { id: 'sage', background: palette.sage, text: palette.charcoal, muted: '#4E5449', accent: palette.cream },
  { id: 'charcoal', background: palette.charcoal, text: palette.cream, muted: '#B3AFA4', accent: palette.clay },
  { id: 'dawn', plus: true, background: '#F3DCCB', text: palette.charcoal, muted: '#6E5A4E', accent: '#E9B9A0' },
  { id: 'mist', plus: true, background: '#DCE3E9', text: '#2F3A44', muted: '#55636F', accent: '#B9C7D3' },
  { id: 'forest', plus: true, background: '#3F5C58', text: '#F1EEE6', muted: '#C3D2CD', accent: '#9FBDB8' },
  { id: 'night', plus: true, background: '#1C1D1A', text: '#EDE7DC', muted: '#A29E93', accent: '#B9B0CC' },
];

interface ShareCardProps {
  message: Message;
  template: ShareTemplate;
  /** Rendered width in points; height is always 16:9 portrait. */
  width: number;
  /** Small line under the brand name, in the current language. */
  tagline: string;
  previewLabel: string;
}

export type ShareCardHandle = ComponentRef<typeof View>;

/**
 * The image people share. Everything is sized relative to `width`, so the
 * on-screen preview and the 1080x1920 capture are visually identical.
 */
export const ShareCard = forwardRef<ShareCardHandle, ShareCardProps>(function ShareCard({ message, template, width, tagline, previewLabel }, ref) {
  const s = width / 360;
  const height = (width * 16) / 9;
  const size = message.length === 'short' ? 34 : message.length === 'medium' ? 29 : 25;

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[styles.card, { width, height, backgroundColor: template.background, padding: 34 * s }]}
      accessibilityLabel={previewLabel}
    >
      {/* Soft decorative orb, very low contrast. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 300 * s,
          height: 300 * s,
          borderRadius: 150 * s,
          top: -110 * s,
          right: -120 * s,
          backgroundColor: template.accent,
          opacity: 0.28,
        }}
      />

      <AppText style={{ fontFamily: fonts.serif, fontSize: 15 * s, lineHeight: 20 * s, color: template.text }}>
        A little better.
      </AppText>

      <View style={styles.center}>
        <AppText
          allowFontScaling={false}
          style={{ fontFamily: fonts.serif, fontSize: 52 * s, lineHeight: 52 * s, color: template.accent, marginBottom: 4 * s }}
        >
          {'“'}
        </AppText>
        <AppText
          allowFontScaling={false}
          style={{
            fontFamily: fonts.serif,
            fontSize: size * s,
            lineHeight: size * 1.28 * s,
            letterSpacing: -0.2 * s,
            color: template.text,
          }}
        >
          {message.text}
        </AppText>
        {message.support ? (
          <AppText
            allowFontScaling={false}
            style={{ fontFamily: fonts.sans, fontSize: 14 * s, lineHeight: 21 * s, color: template.muted, marginTop: 18 * s }}
          >
            {message.support}
          </AppText>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={{ width: 28 * s, height: 1.5 * s, backgroundColor: template.accent, marginBottom: 12 * s }} />
        <AppText
          allowFontScaling={false}
          style={{ fontFamily: fonts.sansMedium, fontSize: 10 * s, letterSpacing: 1.6 * s, color: template.muted }}
        >
          A LITTLE BETTER
        </AppText>
        <AppText allowFontScaling={false} style={{ fontFamily: fonts.sans, fontSize: 10 * s, color: template.muted, marginTop: 3 * s }}>
          {tagline}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { overflow: 'hidden', justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center' },
  footer: { alignItems: 'flex-start' },
});
