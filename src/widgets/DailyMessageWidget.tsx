import type { Widget } from 'expo-widgets';

import type { DailyMessageProps } from './types';

/**
 * Platforms without home-screen widgets (web). iOS and Android load
 * DailyMessageWidget.ios.tsx / .android.tsx instead.
 */
const widget: Widget<DailyMessageProps> | null = null;
export default widget;
