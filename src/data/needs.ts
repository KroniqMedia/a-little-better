import type { MessageTone, NeedId } from '@/types';

/**
 * "What would help right now?" Each need is answered by message tones the
 * library already has, so no new content is required to support it.
 * Plain data (no React Native imports) so scripts can load it.
 */
export const NEEDS: readonly { id: NeedId; tones: readonly MessageTone[] }[] = [
  { id: 'comfort', tones: ['reassuring'] },
  { id: 'perspective', tones: ['reflective', 'uplifting'] },
  { id: 'step', tones: ['grounding', 'gentle-challenge'] },
];

export function isNeedId(id: unknown): id is NeedId {
  return NEEDS.some((n) => n.id === id);
}

export function getNeed(id: NeedId) {
  return NEEDS.find((n) => n.id === id)!;
}

export function needForTone(tone: MessageTone): NeedId | undefined {
  return NEEDS.find((n) => n.tones.includes(tone))?.id;
}

/** The need most of these messages answer, or null if there are none. */
export function topNeed(messages: readonly { tone: MessageTone }[]): NeedId | null {
  const counts = new Map<NeedId, number>();
  for (const m of messages) {
    const need = needForTone(m.tone);
    if (need) counts.set(need, (counts.get(need) ?? 0) + 1);
  }
  let best: NeedId | null = null;
  for (const [need, n] of counts) if (!best || n > counts.get(best)!) best = need;
  return best;
}
