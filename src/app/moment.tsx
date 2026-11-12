import { useLocalSearchParams } from 'expo-router';

import { MomentScreen } from '@/components/moment/MomentScreen';
import { isNeedId } from '@/data/needs';

/** A message for a need, drawn from the whole library. */
export default function MomentRoute() {
  const { need } = useLocalSearchParams<{ need?: string }>();
  const initial = isNeedId(need) ? need : 'comfort';
  return <MomentScreen key={initial} initialNeed={initial} />;
}
