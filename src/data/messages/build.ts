import type { CategoryId, Message, MessageLength, MessageTone } from '@/types';

/** Compact authoring tuple: [text, support | null, tone, tags]. */
export type MessageSeed = readonly [
  text: string,
  support: string | null,
  tone: MessageTone,
  tags: readonly string[],
];

/** A translation of one seed: [text, support | null], in the same order as the seeds. */
export type Translation = readonly [text: string, support: string | null];

const PREFIX: Record<CategoryId, string> = {
  confidence: 'conf',
  hope: 'hope',
  comfort: 'comf',
  'fresh-start': 'fres',
  perspective: 'pers',
  courage: 'cour',
};

/** Seeds are authored with straight apostrophes; display uses typographic ones. */
function typeset(s: string): string {
  return s.replace(/'/g, '’');
}

export function lengthOf(text: string): MessageLength {
  const words = text.trim().split(/\s+/).length;
  if (words <= 9) return 'short';
  if (words <= 16) return 'medium';
  return 'long';
}

/**
 * Turns authoring seeds into fully-formed messages. IDs are positional and
 * stable, so new messages must only ever be appended to a seed list
 * (never inserted or reordered), otherwise saved favorites would shift.
 */
export function buildMessages(category: CategoryId, seeds: readonly MessageSeed[]): Message[] {
  return seeds.map(([text, support, tone, tags], i) => ({
    id: `${PREFIX[category]}-${String(i + 1).padStart(3, '0')}`,
    text: typeset(text),
    ...(support ? { support: typeset(support) } : {}),
    category,
    tone,
    length: lengthOf(text),
    tags: [...tags],
  }));
}

/**
 * Builds the translated library for one category. Entry N of `translations`
 * translates message N, so IDs, tone and tags are shared across languages and
 * saved favorites work in every language. A missing entry falls back to the
 * original (scripts/validate-messages.ts reports it).
 */
export function translateMessages(messages: readonly Message[], translations: readonly Translation[]): Message[] {
  return messages.map((m, i) => {
    const t = translations[i];
    if (!t) return m;
    const [text, support] = t;
    const { support: _original, ...rest } = m;
    return {
      ...rest,
      text: typeset(text),
      ...(support ? { support: typeset(support) } : {}),
      length: lengthOf(text),
    };
  });
}
