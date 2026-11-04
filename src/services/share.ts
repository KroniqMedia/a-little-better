import * as Sharing from 'expo-sharing';
import type { ComponentRef, RefObject } from 'react';
import { Platform, Share, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import type { Message } from '@/types';

/** Instagram-story proportions. */
export const SHARE_IMAGE = { width: 1080, height: 1920 } as const;

export function messageAsText(message: Message): string {
  return `“${message.text}”\n\n— A Little Better`;
}

/** Plain-text fallback via the OS share sheet (used on web or if imaging fails). */
export async function shareText(message: Message): Promise<void> {
  await Share.share({ message: messageAsText(message) });
}

/**
 * Renders the given card view to a 1080x1920 PNG and opens the native share
 * sheet. Falls back to sharing text if image sharing isn't possible.
 */
export async function shareCardImage(
  viewRef: RefObject<ComponentRef<typeof View> | null>,
  message: Message,
  dialogTitle: string,
): Promise<'image' | 'text'> {
  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    await shareText(message);
    return 'text';
  }
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width: SHARE_IMAGE.width,
      height: SHARE_IMAGE.height,
    });
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      UTI: 'public.png',
      dialogTitle,
    });
    return 'image';
  } catch (err) {
    console.warn('[share] image share failed, falling back to text', err);
    await shareText(message);
    return 'text';
  }
}
