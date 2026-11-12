import { ALL_MESSAGES, getMessage, getMessagesForCategory } from '@/data/messages';
import { getNeed } from '@/data/needs';
import type { CategoryId, Message, MessageTone, NeedId } from '@/types';
import { localDayNumber } from '@/utils/date';
import { mulberry32, shuffle } from '@/utils/random';

/**
 * Daily message selection.
 *
 * All messages are put into one fixed, seeded order (identical on every
 * device and every launch). Day N shows entry N modulo the library size, so:
 * - the same calendar day always shows the same message,
 * - no message repeats until the whole library has been shown (~10 months).
 */
const DAILY_SEED = 0x1a77e;
const dailyOrder: readonly Message[] = shuffle(ALL_MESSAGES, mulberry32(DAILY_SEED));

export function getDailyMessage(date: Date = new Date()): Message {
  const day = localDayNumber(date);
  const index = ((day % dailyOrder.length) + dailyOrder.length) % dailyOrder.length;
  return dailyOrder[index];
}

/** What to draw from: a collection, a need, both, or neither (whole library). */
export interface MessageFilter {
  category?: CategoryId;
  need?: NeedId;
}

/**
 * On-demand decks, one per filter, kept for the app session. Each deck is a
 * shuffled pass through the matching messages, so nothing repeats until every
 * one has been seen, and a new pass never starts with the message that ended
 * the previous one.
 *
 * Messages marked "not for me" are skipped, and tones that were marked more
 * often drift towards the end of each pass (a soft preference, never a ban).
 */
interface Deck {
  order: Message[];
  position: number;
}

const decks = new Map<string, Deck>();

const keyOf = (f: MessageFilter) => `${f.category ?? 'all'}:${f.need ?? 'any'}`;

function poolFor(f: MessageFilter): readonly Message[] {
  const base = f.category ? getMessagesForCategory(f.category) : ALL_MESSAGES;
  if (!f.need) return base;
  const tones = getNeed(f.need).tones;
  return base.filter((m) => tones.includes(m.tone));
}

function toneWeights(hidden: readonly string[]): Map<MessageTone, number> {
  const skips = new Map<MessageTone, number>();
  for (const id of hidden) {
    const tone = getMessage(id)?.tone;
    if (tone) skips.set(tone, (skips.get(tone) ?? 0) + 1);
  }
  const weights = new Map<MessageTone, number>();
  for (const [tone, n] of skips) weights.set(tone, 1 / (1 + n / 3));
  return weights;
}

/** Weighted shuffle (Efraimidis–Spirakis): heavier items tend to come first. */
function weightedOrder(pool: readonly Message[], hidden: readonly string[]): Message[] {
  const weights = toneWeights(hidden);
  return pool
    .map((m) => ({ m, key: Math.random() ** (1 / (weights.get(m.tone) ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.m);
}

function freshDeck(f: MessageFilter, hidden: readonly string[], avoidFirst?: string): Message[] {
  const order = weightedOrder(poolFor(f), hidden);
  if (avoidFirst && order.length > 1 && order[0].id === avoidFirst) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return order;
}

export interface NextOptions {
  /** IDs marked "not for me" (services/notForMe). */
  hidden?: readonly string[];
  /** Prefer a message whose tone differs from this one. */
  differentToneFrom?: MessageTone;
}

export function nextMessage(f: MessageFilter, opts: NextOptions = {}): Message {
  const key = keyOf(f);
  const hiddenList = opts.hidden ?? [];
  const hidden = new Set(hiddenList);

  for (let pass = 0; pass < 2; pass++) {
    let deck = decks.get(key);
    if (!deck || deck.position >= deck.order.length) {
      const last = deck?.order[deck.order.length - 1]?.id;
      deck = { order: freshDeck(f, hiddenList, last), position: 0 };
      decks.set(key, deck);
    }
    const { order } = deck;
    // Find the next playable entry, preferring a different tone if asked.
    let pick = -1;
    let fallback = -1;
    for (let i = deck.position; i < order.length; i++) {
      if (hidden.has(order[i].id)) continue;
      if (fallback < 0) fallback = i;
      if (!opts.differentToneFrom || order[i].tone !== opts.differentToneFrom) {
        pick = i;
        break;
      }
    }
    // Only the unwanted tone is left in this pass: try a fresh pass before settling for it.
    const settle = pick < 0 && fallback >= 0 && (pass === 1 || !opts.differentToneFrom);
    if (settle) pick = fallback;
    if (pick >= 0) {
      [order[deck.position], order[pick]] = [order[pick], order[deck.position]];
      const msg = order[deck.position];
      deck.position += 1;
      return msg;
    }
    // Nothing suitable left in this pass: start a new one.
    deck.position = order.length;
  }

  // Every matching message is hidden: show one anyway rather than nothing.
  const pool = poolFor(f);
  return pool[Math.floor(Math.random() * pool.length)] ?? getDailyMessage();
}
