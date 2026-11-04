import Svg, { Circle, G, Path } from 'react-native-svg';

import { faceColors } from '@/constants/theme';
import type { Mood } from '@/data/moods';

/**
 * Hand-drawn style mood faces, each in its own soft tone. Simple strokes on a tinted circle,
 * matching the line weight of the Lucide icons used elsewhere.
 */
export function MoodFace({ mood, size = 56 }: { mood: Mood; size?: number }) {
  const { fill, ink } = faceColors[mood.id];
  const line = { stroke: ink, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const dot = (cx: number, cy: number) => <Circle cx={cx} cy={cy} r={2.6} fill={ink} />;

  let features: React.ReactNode;
  switch (mood.id) {
    case 'good':
      features = (
        <>
          <Path d="M20 29 q4 -5 8 0" {...line} />
          <Path d="M36 29 q4 -5 8 0" {...line} />
          <Path d="M22 38 q10 9 20 0" {...line} />
          <Circle cx={17} cy={37} r={3.6} fill={faceColors.cheek} opacity={0.35} />
          <Circle cx={47} cy={37} r={3.6} fill={faceColors.cheek} opacity={0.35} />
        </>
      );
      break;
    case 'down':
      features = (
        <>
          <Path d="M19 23 L27 21" {...line} />
          <Path d="M45 23 L37 21" {...line} />
          {dot(24, 29)}
          {dot(40, 29)}
          <Path d="M24 43 q8 -6 16 0" {...line} />
        </>
      );
      break;
    case 'overwhelmed':
      features = (
        <>
          <Path d="M20 25 l6 3.5 l-6 3.5" {...line} />
          <Path d="M44 25 l-6 3.5 l6 3.5" {...line} />
          <Path d="M21 41 q2.75 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" {...line} />
        </>
      );
      break;
    case 'nervous':
      features = (
        <>
          <Path d="M19 22 q4 -3 8 0" {...line} />
          <Path d="M37 22 q4 -3 8 0" {...line} />
          {dot(23, 29)}
          {dot(41, 29)}
          <Path d="M24 40 h16" {...line} />
          <Path d="M49 13 q4 6 0 8.5 q-4 -2.5 0 -8.5 Z" fill={ink} opacity={0.3} />
        </>
      );
      break;
    case 'unsure':
      features = (
        <>
          <Path d="M19 21 q4 -3.5 8 0" {...line} />
          <Path d="M37 24 h8" {...line} />
          {dot(23, 29)}
          {dot(41, 29)}
          <Path d="M25 42 L39 38" {...line} />
        </>
      );
      break;
    case 'stuck':
      features = (
        <>
          <Path d="M20 29 h8" {...line} />
          <Path d="M36 29 h8" {...line} />
          <Path d="M25 40 h14" {...line} />
        </>
      );
      break;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={29} fill={fill} />
      <G>{features}</G>
    </Svg>
  );
}
