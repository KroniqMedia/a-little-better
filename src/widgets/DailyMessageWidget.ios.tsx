import { Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { containerBackground, font, foregroundStyle, minimumScaleFactor, widgetURL } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { DailyMessageProps } from './types';

/**
 * Today's message on the home screen (iOS). Widget code runs outside the
 * app: no hooks, no imports at runtime, no module-level values. Everything it
 * needs is declared inside or passed in as props.
 */
const DailyMessage = (props: DailyMessageProps, environment: WidgetEnvironment) => {
  'widget';
  const dark = environment.colorScheme === 'dark';
  const background = dark ? '#1C1D1A' : '#F5F1E9';
  const ink = dark ? '#EDE7DC' : '#33352F';
  const muted = dark ? '#B3AFA4' : '#5F5C53';
  const small = environment.widgetFamily === 'systemSmall';
  return (
    <VStack
      alignment="leading"
      spacing={6}
      modifiers={[containerBackground(background, 'widget'), widgetURL('alittlebetter://')]}
    >
      <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(muted)]}>{props.label || 'A little better.'}</Text>
      <Text modifiers={[font({ size: small ? 15 : 19, design: 'serif' }), foregroundStyle(ink), minimumScaleFactor(0.7)]}>
        {props.text}
      </Text>
      <Spacer />
    </VStack>
  );
};

export default createWidget('DailyMessage', DailyMessage, { text: '', label: '' });
