import { Column, Text } from '@expo/ui/jetpack-compose';
import { background, fillMaxSize, padding } from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

import type { DailyMessageProps } from './types';

/**
 * Today's message on the home screen (Android). Widget code runs outside the
 * app: no hooks, no imports at runtime, no module-level values. Android widgets
 * support only a subset of Expo UI (Column, Text, padding, background…).
 */
const DailyMessage = (props: DailyMessageProps) => {
  'widget';
  return (
    <Column verticalArrangement={{ spacedBy: 6 }} modifiers={[fillMaxSize(), background('#F5F1E9'), padding(18, 16, 18, 16)]}>
      <Text color="#5F5C53" style={{ fontSize: 11, fontWeight: '500' }}>
        {props.label || 'A little better.'}
      </Text>
      <Text color="#33352F" style={{ fontSize: 17, fontFamily: 'serif', lineHeight: 23 }} maxLines={6} overflow="ellipsis">
        {props.text}
      </Text>
    </Column>
  );
};

export default createWidget('DailyMessage', DailyMessage, { text: '', label: '' });
