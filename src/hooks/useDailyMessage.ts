import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { getDailyMessage } from '@/services/messageService';
import { localDayNumber, msUntilMidnight } from '@/utils/date';

/**
 * Today's message. Stays the same all day and rolls over at local midnight,
 * both while the app is open and when it returns from the background.
 */
export function useDailyMessage() {
  const [day, setDay] = useState(() => localDayNumber());

  useEffect(() => {
    const refresh = () => setDay(localDayNumber());
    let timer = setTimeout(function tick() {
      refresh();
      timer = setTimeout(tick, msUntilMidnight());
    }, msUntilMidnight());
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);

  // `day` is the dependency that matters; the date is derived from "now".
  const date = useMemo(() => new Date(), [day]); // eslint-disable-line react-hooks/exhaustive-deps
  const message = useMemo(() => getDailyMessage(date), [date]);
  return { message, date };
}
