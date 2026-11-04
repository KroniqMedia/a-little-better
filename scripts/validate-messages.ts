/**
 * Sanity checks for the message library, in every language. Run with:
 *   npm run validate:messages
 */
import { getCategories } from '../src/data/categories';
import { confidenceEs } from '../src/data/messages/es/confidence';
import { comfortEs } from '../src/data/messages/es/comfort';
import { courageEs } from '../src/data/messages/es/courage';
import { freshStartEs } from '../src/data/messages/es/freshStart';
import { hopeEs } from '../src/data/messages/es/hope';
import { perspectiveEs } from '../src/data/messages/es/perspective';
import { ALL_MESSAGES, MESSAGES_BY_CATEGORY, TRANSLATED_BY_CATEGORY } from '../src/data/messages';
import { getDailyMessage } from '../src/services/messageService';
import type { CategoryId, Message } from '../src/types';

const MIN_TOTAL = 600;
const MIN_PER_CATEGORY = 100;

let problems = 0;
const fail = (msg: string) => {
  problems++;
  console.error('  x ' + msg);
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\p{L} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

function checkLibrary(label: string, messages: readonly Message[]) {
  const ids = new Set<string>();
  const texts = new Map<string, string>();
  for (const m of messages) {
    if (ids.has(m.id)) fail(`[${label}] duplicate id ${m.id}`);
    ids.add(m.id);
    const key = norm(m.text);
    if (texts.has(key)) fail(`[${label}] duplicate text: ${m.id} = ${texts.get(key)}`);
    texts.set(key, m.id);
    if (!m.text.trim()) fail(`[${label}] ${m.id} is empty`);
    if (m.tags.length === 0) fail(`[${label}] ${m.id} has no tags`);
    if (m.text.includes("'") || m.support?.includes("'")) fail(`[${label}] ${m.id} has a straight apostrophe`);
  }
}

// ---- English (canonical)
console.log(`English: ${ALL_MESSAGES.length} messages`);
if (ALL_MESSAGES.length < MIN_TOTAL) fail(`English has fewer than ${MIN_TOTAL} messages`);
for (const c of getCategories('en')) {
  const n = MESSAGES_BY_CATEGORY[c.id].length;
  console.log(`  ${c.title.padEnd(18)} ${n}`);
  if (n < MIN_PER_CATEGORY) fail(`${c.id} has only ${n} messages`);
}
checkLibrary('en', ALL_MESSAGES);

// ---- Spanish: one translation per message, in the same order
const ES_SOURCES: Record<CategoryId, readonly unknown[]> = {
  confidence: confidenceEs,
  hope: hopeEs,
  comfort: comfortEs,
  'fresh-start': freshStartEs,
  perspective: perspectiveEs,
  courage: courageEs,
};
const spanish = Object.values(TRANSLATED_BY_CATEGORY.es).flat();
console.log(`Spanish: ${spanish.length} messages`);
for (const c of getCategories('es')) {
  const en = MESSAGES_BY_CATEGORY[c.id];
  const es = TRANSLATED_BY_CATEGORY.es[c.id];
  const source = ES_SOURCES[c.id].length;
  console.log(`  ${c.title.padEnd(24)} ${source}`);
  if (source !== en.length) fail(`[es] ${c.id} has ${source} translations for ${en.length} messages`);
  es.forEach((m, i) => {
    if (m.text === en[i].text) fail(`[es] ${m.id} is not translated`);
    if (Boolean(m.support) !== Boolean(en[i].support)) fail(`[es] ${m.id} support line doesn't match the English`);
    for (const s of [m.text, m.support ?? '']) {
      if (s.includes('?') && !s.includes('¿')) fail(`[es] ${m.id} is missing an opening ¿`);
      if (s.includes('!') && !s.includes('¡')) fail(`[es] ${m.id} is missing an opening ¡`);
    }
  });
}
checkLibrary('es', spanish);

// ---- Mix of lengths and tones (English)
const lengths: Record<string, number> = { short: 0, medium: 0, long: 0 };
const tones: Record<string, number> = {};
for (const m of ALL_MESSAGES) {
  lengths[m.length]++;
  tones[m.tone] = (tones[m.tone] ?? 0) + 1;
}
console.log('Lengths:', lengths);
console.log('Tones:', tones);

// ---- Daily selection: deterministic and unique across a full cycle.
const start = new Date(2026, 0, 1);
const seen = new Set<string>();
for (let i = 0; i < ALL_MESSAGES.length; i++) {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
  const a = getDailyMessage(d).id;
  const b = getDailyMessage(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59)).id;
  if (a !== b) fail(`daily message changes within ${d.toDateString()}`);
  if (seen.has(a)) fail(`daily message repeats within one cycle on day ${i}`);
  seen.add(a);
}
console.log(`Daily cycle: ${seen.size} unique days before repeating`);
console.log('Today:', getDailyMessage().text);

if (problems) {
  console.error(`\n${problems} problem(s) found`);
  process.exit(1);
}
console.log('\nAll checks passed.');
