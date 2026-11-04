import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useFavorites } from '@/providers/FavoritesProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { successFeedback, tapFeedback } from '@/services/haptics';
import type { Message } from '@/types';

/** Save / share behaviour shared by every message card. */
export function useMessageActions(message: Message) {
  const router = useRouter();
  const { isSaved, toggle } = useFavorites();
  const { prefs } = usePreferences();
  const saved = isSaved(message.id);

  const toggleSave = useCallback(() => {
    const nowSaved = toggle(message.id);
    if (nowSaved) successFeedback(prefs.hapticsEnabled);
    else tapFeedback(prefs.hapticsEnabled);
  }, [toggle, message.id, prefs.hapticsEnabled]);

  const share = useCallback(() => {
    tapFeedback(prefs.hapticsEnabled);
    router.push({ pathname: '/share/[id]', params: { id: message.id } });
  }, [router, message.id, prefs.hapticsEnabled]);

  return { saved, toggleSave, share };
}
