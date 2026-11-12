import { Footprints, HandHeart, Telescope, type LucideIcon } from '@/components/icons';
import type { NeedId } from '@/types';

export const NEED_ICONS: Record<NeedId, LucideIcon> = {
  comfort: HandHeart,
  perspective: Telescope,
  step: Footprints,
};

export function NeedIcon({ id, size = 22, color }: { id: NeedId; size?: number; color: string }) {
  const Icon = NEED_ICONS[id];
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}
