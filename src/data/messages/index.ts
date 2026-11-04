import type { CategoryId, Locale, Message } from '@/types';
import { translateMessages } from './build';
import { comfortMessages } from './comfort';
import { confidenceMessages } from './confidence';
import { courageMessages } from './courage';
import { comfortEs } from './es/comfort';
import { confidenceEs } from './es/confidence';
import { courageEs } from './es/courage';
import { freshStartEs } from './es/freshStart';
import { hopeEs } from './es/hope';
import { perspectiveEs } from './es/perspective';
import { freshStartMessages } from './freshStart';
import { hopeMessages } from './hope';
import { perspectiveMessages } from './perspective';

/**
 * The English library is canonical: it defines IDs and order, and drives the
 * daily rotation and "another message" decks. Other languages share the same
 * IDs, so screens pick a message by ID and display it with `localizeMessage`.
 */
export const MESSAGES_BY_CATEGORY: Readonly<Record<CategoryId, readonly Message[]>> = {
  confidence: confidenceMessages,
  hope: hopeMessages,
  comfort: comfortMessages,
  'fresh-start': freshStartMessages,
  perspective: perspectiveMessages,
  courage: courageMessages,
};

export const TRANSLATED_BY_CATEGORY: Readonly<Record<Exclude<Locale, 'en'>, Record<CategoryId, readonly Message[]>>> = {
  es: {
    confidence: translateMessages(confidenceMessages, confidenceEs),
    hope: translateMessages(hopeMessages, hopeEs),
    comfort: translateMessages(comfortMessages, comfortEs),
    'fresh-start': translateMessages(freshStartMessages, freshStartEs),
    perspective: translateMessages(perspectiveMessages, perspectiveEs),
    courage: translateMessages(courageMessages, courageEs),
  },
};

export const ALL_MESSAGES: readonly Message[] = Object.values(MESSAGES_BY_CATEGORY).flat();

const byId: Record<Locale, Map<string, Message>> = {
  en: new Map(ALL_MESSAGES.map((m) => [m.id, m])),
  es: new Map(Object.values(TRANSLATED_BY_CATEGORY.es).flat().map((m) => [m.id, m])),
};

export function getMessage(id: string, locale: Locale = 'en'): Message | undefined {
  return byId[locale].get(id) ?? byId.en.get(id);
}

/** The same message in another language (falls back to the original). */
export function localizeMessage(message: Message, locale: Locale): Message {
  return locale === 'en' ? message : (byId[locale].get(message.id) ?? message);
}

export function getMessagesForCategory(id: CategoryId, locale: Locale = 'en'): readonly Message[] {
  return locale === 'en' ? MESSAGES_BY_CATEGORY[id] : TRANSLATED_BY_CATEGORY[locale][id];
}
