import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { palette } from '@/constants/theme';

/**
 * A soft, warm light behind the top of a screen — like a lamp in the
 * corner of a room. Purely decorative and very low contrast.
 */
export function WarmGlow({ evening = false, dark = false }: { evening?: boolean; dark?: boolean }) {
  const { width } = useWindowDimensions();
  const color = evening || dark ? palette.clay : '#E9C9A8';
  // On a dark background the same light needs much less strength to read as a glow.
  const opacity = dark ? 0.14 : evening ? 0.38 : 0.45;
  return (
    <Svg pointerEvents="none" width={width} height={420} style={styles.glow}>
      <Defs>
        <RadialGradient id="glow" cx="78%" cy="18%" rx="62%" ry="58%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={width * 0.78} cy={76} rx={width * 0.8} ry={300} fill="url(#glow)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', top: 0, left: 0 },
});
