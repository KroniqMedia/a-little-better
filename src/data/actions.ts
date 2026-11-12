import type { CategoryId, Message } from '@/types';

/**
 * Optional 20–60 second actions offered under some messages ("A small step").
 * One at a time, nothing to tick off, nothing remembered afterwards.
 * Text lives in i18n/strings (`actions`). Plain data so scripts can load it.
 */
export type ActionId =
  | 'breathe'
  | 'see-five'
  | 'shoulders'
  | 'water'
  | 'warm-hands'
  | 'one-for-today'
  | 'leave-for-tomorrow'
  | 'kinder-sentence'
  | 'did-well'
  | 'look-forward'
  | 'good-surprise'
  | 'fresh-air'
  | 'one-good-thing'
  | 'listen'
  | 'tiny-first-step';

export const ACTION_SECONDS: Record<ActionId, number> = {
  breathe: 40,
  'see-five': 40,
  shoulders: 20,
  water: 30,
  'warm-hands': 30,
  'one-for-today': 60,
  'leave-for-tomorrow': 30,
  'kinder-sentence': 30,
  'did-well': 45,
  'look-forward': 40,
  'good-surprise': 40,
  'fresh-air': 30,
  'one-good-thing': 40,
  listen: 30,
  'tiny-first-step': 60,
};

/** Tags that call for a specific action, checked in order. */
const BY_TAG: readonly (readonly [string, ActionId])[] = [
  ['breathing', 'breathe'],
  ['anxiety', 'breathe'],
  ['calm', 'breathe'],
  ['grounding', 'see-five'],
  ['overwhelm', 'one-for-today'],
  ['stress', 'one-for-today'],
  ['priorities', 'one-for-today'],
  ['tension', 'shoulders'],
  ['body', 'shoulders'],
  ['self-care', 'water'],
  ['basics', 'water'],
  ['warmth', 'warm-hands'],
  ['comfort', 'warm-hands'],
  ['sleep', 'leave-for-tomorrow'],
  ['evening', 'leave-for-tomorrow'],
  ['self-talk', 'kinder-sentence'],
  ['procrastination', 'tiny-first-step'],
  ['avoidance', 'tiny-first-step'],
  ['action', 'tiny-first-step'],
  ['noticing', 'one-good-thing'],
  ['nature', 'fresh-air'],
];

/** Otherwise, a couple of actions that fit each collection. */
const BY_CATEGORY: Record<CategoryId, readonly ActionId[]> = {
  confidence: ['did-well', 'kinder-sentence'],
  hope: ['look-forward', 'good-surprise'],
  comfort: ['breathe', 'shoulders', 'warm-hands'],
  'fresh-start': ['leave-for-tomorrow', 'fresh-air'],
  perspective: ['one-good-thing', 'listen'],
  courage: ['tiny-first-step', 'breathe'],
};

/** Only messages that already point at doing something get an action. */
const PRACTICAL_TONES = new Set<Message['tone']>(['grounding', 'gentle-challenge']);

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** The action offered under a message, if any. Stable for a given message. */
export function actionFor(message: Message): ActionId | undefined {
  const tagged = BY_TAG.find(([tag]) => message.tags.includes(tag));
  if (tagged) return tagged[1];
  if (!PRACTICAL_TONES.has(message.tone)) return undefined;
  const options = BY_CATEGORY[message.category];
  return options[hash(message.id) % options.length];
}
