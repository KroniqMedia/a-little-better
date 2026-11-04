import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { getMood, type MoodId } from '@/data/moods';
import { localDayNumber } from '@/utils/date';

const KEY = 'alb:mood:v1';

interface StoredMood {
  day: number;
  mood: MoodId;
}

/** Today's check-in. Remembered for the rest of the local day, then forgotten. */
export function useTodayMood() {
  const [moodId, setMoodId] = useState<MoodId | undefined>();

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const stored = JSON.parse(raw) as StoredMood;
        if (stored.day === localDayNumber() && getMood(stored.mood)) setMoodId(stored.mood);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const choose = useCallback((next: MoodId) => {
    setMoodId(next);
    const value: StoredMood = { day: localDayNumber(), mood: next };
    AsyncStorage.setItem(KEY, JSON.stringify(value)).catch(() => {});
  }, []);

  return { moodId, choose };
}
