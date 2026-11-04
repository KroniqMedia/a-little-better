import { Compass, Feather, Flame, HandHeart, Sprout, Sun, type LucideIcon } from '@/components/icons';

import type { CategoryId } from '@/types';

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  confidence: Sun,
  hope: Sprout,
  comfort: HandHeart,
  'fresh-start': Feather,
  perspective: Compass,
  courage: Flame,
};

export function CategoryIcon({ id, size = 22, color }: { id: CategoryId; size?: number; color: string }) {
  const Icon = CATEGORY_ICONS[id];
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}
