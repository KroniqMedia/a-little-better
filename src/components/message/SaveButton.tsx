import { Heart } from '@/components/icons';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { HIT_TARGET } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { PressableScale } from '../ui/PressableScale';

interface SaveButtonProps {
  saved: boolean;
  onPress: () => void;
  color?: string;
  /** Accessibility labels in the current language. */
  labels: { save: string; unsave: string };
}

/** Heart toggle with a soft "bloom" when a message is saved. */
export function SaveButton({ saved, onPress, color, labels }: SaveButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const ring = useSharedValue(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (saved) {
      scale.set(withSequence(withTiming(1.25, { duration: 140 }), withSpring(1, { damping: 9, stiffness: 180 })));
      ring.set(0);
      ring.set(withTiming(1, { duration: 520 }));
    } else {
      scale.set(withSequence(withTiming(0.85, { duration: 90 }), withSpring(1)));
    }
  }, [saved, scale, ring]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.get() === 0 ? 0 : 1 - ring.get(),
    transform: [{ scale: 0.6 + ring.get() * 0.8 }],
  }));

  const tint = color ?? colors.text;

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={saved ? labels.unsave : labels.save}
      accessibilityState={{ selected: saved }}
      style={styles.base}
    >
      <Animated.View pointerEvents="none" style={[styles.ring, { borderColor: colors.accentSecondary }, ringStyle]} />
      <Animated.View style={iconStyle}>
        <Heart
          size={22}
          strokeWidth={1.6}
          color={saved ? colors.accentSecondary : tint}
          fill={saved ? colors.accentSecondary : 'transparent'}
        />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { width: HIT_TARGET, height: HIT_TARGET, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 1.5 },
});
