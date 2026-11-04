import type { ReactNode } from 'react';
import { StyleSheet, View, type ScrollViewProps } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Edges to pad. Tab screens skip 'bottom' (the tab bar handles it). */
  edges?: Edge[];
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  /** Decorative layer drawn behind the content (scrolls with it). */
  background?: ReactNode;
}

/** Page container: background, safe areas, readable max width on tablets. */
export function Screen({ children, scroll = true, edges = ['top'], contentContainerStyle, background }: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const scrimStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [0, 24], [0, 1], 'clamp') }));
  const pad = {
    paddingTop: edges.includes('top') ? insets.top + spacing.xs : 0,
    paddingBottom: (edges.includes('bottom') ? insets.bottom : 0) + spacing.xl,
  };

  if (!scroll) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }, pad]}>
        <View style={styles.inner}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.root}
        contentContainerStyle={[pad, styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {background}
        <View style={styles.inner}>{children}</View>
      </Animated.ScrollView>
      {/* Edge-to-edge: once scrolled, keep content from showing under the status bar. */}
      {edges.includes('top') ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.scrim, { height: insets.top, backgroundColor: colors.background }, scrimStyle]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1 },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0 },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
});
