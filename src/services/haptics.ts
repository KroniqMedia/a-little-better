import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Fire-and-forget haptics; never throws (web/simulators lack support). */
export function tapFeedback(enabled: boolean): void {
  if (!enabled || Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function successFeedback(enabled: boolean): void {
  if (!enabled || Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function selectionFeedback(enabled: boolean): void {
  if (!enabled || Platform.OS === 'web') return;
  Haptics.selectionAsync().catch(() => {});
}
