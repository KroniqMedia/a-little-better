import { ALL_MESSAGES, getMessagesForCategory } from '@/data/messages';
import type { CategoryId, Message } from '@/types';
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

/**
 * On-demand "another message" decks, one per category, kept for the app
 * session. Each deck is a shuffled pass through the whole collection, so
 * nothing repeats until every message has been seen, and a new pass never
 * starts with the message that ended the previous one.
 */
interface Deck {
  order: Message[];
  position: number;
}

const decks = new Map<CategoryId, Deck>();

function freshDeck(category: CategoryId, avoidFirst?: string): Message[] {
  const order = shuffle(getMessagesForCategory(category));
  if (avoidFirst && order.length > 1 && order[0].id === avoidFirst) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return order;
}

export function nextMessageFor(category: CategoryId): Message {
  let deck = decks.get(category);
  if (!deck || deck.position >= deck.order.length) {
    const last = deck?.order[deck.order.length - 1]?.id;
    deck = { order: freshDeck(category, last), position: 0 };
    decks.set(category, deck);
  }
  const msg = deck.order[deck.position];
  deck.position += 1;
  return msg;
}
