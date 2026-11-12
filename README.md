# A Little Better

*A little reminder. A little perspective. A little better.*

An everyday emotional companion: one thoughtful message a day, plus six small collections for the moments you need something specific. Built with Expo SDK 58, React Native 0.88, TypeScript and Expo Router.

No account is needed, and everything works offline.

## Run it

```bash
npm install
npx expo start          # then press i (iOS) / a (Android), or scan with Expo Go
```

The app runs in Expo Go (notifications, sharing, view capture, haptics, Reanimated and file picking are all bundled there). The **home-screen widget** (`expo-widgets`) needs native code, so it only exists in a development or store build: `npx expo run:ios` / `npx expo run:android`, or `npx eas-cli@latest build --profile development`. In Expo Go the widget code is simply skipped. For store builds, use EAS: `npx eas-cli@latest build`.

| Script | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npx eslint .` | Lint (eslint-config-expo) |
| `npm run validate:messages` | Checks the library: ≥300 messages, unique IDs/texts, typography, and that the daily rotation is deterministic and non-repeating |

## Structure

```
src/
  app/                    Expo Router routes (screens only)
    (tabs)/               Home · Explore · Saved
    category/[id].tsx     A collection (optionally from a feeling and/or a need): one message at a time
    moment.tsx            A need on its own, drawn from the whole library
    welcome.tsx           One-screen welcome, shown once
    share/[id].tsx        Share-card composer (modal)
    settings/             Settings · Privacy · About
  components/             ui/ (primitives), moment/, need/, message/, category/, share/, settings/, reminder/
  constants/theme.ts      Design tokens: palette, type scale, spacing, radii, shadows
  data/                   categories.ts, moods.ts, needs.ts + messages/ (624 original messages per language)
  hooks/                  useTheme, useDailyMessage, useMessageActions
  providers/              FavoritesProvider, PreferencesProvider (state + persistence)
  services/               storage, messageService, notForMe, helped, backup, purchases, widget, notifications, share, haptics, sync
  widgets/                Home-screen widget (expo-widgets), one file per platform
  types/ utils/
scripts/validate-messages.ts
```

Business logic lives in `services/` and `providers/`. Screens only compose components.

## Key behaviours

- **Daily message.** All messages go into one fixed, seeded order, and the local calendar day picks the entry. Everyone sees the same message all day, it rolls over at local midnight, and nothing repeats for 624 days.
- **Another message.** Each collection/need combination deals from a shuffled deck, so you won't see a repeat until you've seen every match, and a new pass never starts with the message that ended the last one. "Another message" is a secondary action; the main one is "That's enough for now".
- **"This one isn't for me".** No reason asked. The message is hidden from collections (never from the shared daily message), the next one has a different tone, and tones marked more often come up a little later in each pass. Stored only on the device (`services/notForMe.ts`), undoable on the spot and from Settings › Your data.
- **Favorites and preferences.** Stored in AsyncStorage behind the `FavoritesRepository` / `PreferencesRepository` interfaces in `services/storage.ts`. Up to 3 saved messages can be pinned to "To come back to".
- **Backups.** Settings › Your data exports saved messages, "not for me" marks and settings to a JSON file (shared via the system sheet) and restores one with `File.pickFileAsync` from `expo-file-system`. Restoring merges; it never switches reminders on.
- **Welcome and reminder offer.** First launch shows one welcome screen (no permission prompts). The reminder is offered on Home only after the person has opened a message for themselves, once.
- **Notifications.** Exactly one per day, and only after you opt in. Discreet by default: the notification says only that today's message is waiting, so nothing personal shows on the lock screen; "Full message" puts the text in the notification. The app schedules a rolling 30 days of local notifications. About 1.5 s after launch it checks the window, and it rebuilds it only when fewer than 21 days are left or the time, language or style changed. If you revoke permission in system settings, the toggle switches itself off.
- **A small step.** About 250 messages (practical tones, or tags like breathing, overwhelm or self-talk) offer one optional 20–60 second action underneath (`data/actions.ts`): breathing, five things you can see, leaving one thing for tomorrow, and so on. It opens only if tapped; the timer is a guide; nothing is recorded or left "to do".
- **"Did this help?"** Optional, under each message. Answers stay on the phone (`services/helped.ts`), feed Settings › Your data › What has helped you (which need helps most), can be kept in "To come back to", travel in backups and can be forgotten at any time. "Not really" offers a different kind of message.
- **Home-screen widget.** `src/widgets/DailyMessageWidget.{ios,android}.tsx`, configured in app.json (`expo-widgets`). The app pushes today's message in its language (`services/widget.ts`): iOS gets a two-week timeline and rolls over at midnight on its own; Android gets a snapshot refreshed whenever the app is opened (or open at midnight). Tapping the widget opens the app on iOS; `expo-widgets` doesn't offer that on Android yet.
- **A Little Better+.** A prepared one-time purchase (`services/purchases.ts`, `app/settings/plus.tsx`): four extra share-card styles and an app accent colour. The store isn't connected, so it shows "Coming soon"; development builds can unlock it for testing. To go live, implement `PurchaseProvider` (RevenueCat or expo-iap) for product `alittlebetter.plus` and call `setPurchaseProvider` at startup. Offered only from Settings and locked share styles, never from a feeling or need. Accessibility, privacy, backups and all content stay free.
- **Appearance and accessibility.** Light and dark schemes (`constants/theme.ts`), following the phone unless set in Settings › Appearance. Text tones meet 4.5:1 contrast. Body text scales up to 2× with the system text size (large serif styles up to 1.4×). Animations follow the system "reduce motion" setting, and new messages are announced to screen readers.
- **Share cards.** A 9:16 card in 4 brand templates, captured at 1080×1920 with `react-native-view-shot` and opened in the native share sheet. If image sharing isn't possible, it falls back to plain-text sharing.

## Performance notes

- **Icons:** import them from `@/components/icons`, never from `lucide-react-native`. The package's main entry file pulls in all ~2,000 icons. To add one, add a line to `src/components/icons.ts`.
- **Fonts:** import one weight per subpath (`@expo-google-fonts/inter/400Regular`). The package root bundles every weight (18 TTFs for Inter). ESLint enforces both rules.
- **React Compiler** is on (`experiments.reactCompiler` in app.json), so components are memoized automatically. Keep components pure; `npx eslint .` flags violations.
- **Android release builds** use R8 minification and resource shrinking (`expo-build-properties`).

Measured with `npx expo export --platform android`:

| | Before | After |
| --- | --- | --- |
| JS bundle (Hermes bytecode) | 6.3 MB | 4.1 MB |
| Bundled assets | 6.2 MB (46 files) | 1.2 MB (31 files) |

## Languages

The app is in English and Spanish. It follows the phone's language (Spanish devices get Spanish, everything else English), and the person can override it in Settings → Language.

- **Interface text** lives in `src/i18n/strings.ts`. `es` is typed against `en`, so a missing string is a type error. Screens read it with `useI18n()`.
- **Messages** are written per language with the same IDs. English (`src/data/messages/*.ts`) is canonical and drives the daily order and decks. `src/data/messages/es/*.ts` holds the Spanish, line for line in the same order. Screens show a message with `localizeMessage(message, locale)`, so saved favorites carry over between languages.
- **Reminders** are written in the active language. Changing language reschedules them.
- **Spanish style:** use tú, and avoid gendered adjectives about the reader ("sentir orgullo" rather than "estar orgulloso/a").

## Adding messages

Append to the relevant English file in `src/data/messages/`, and add its Spanish at the same position in `src/data/messages/es/`. **Never insert or reorder**, because IDs are positional and saved favorites depend on them. Write straight apostrophes in English; they are typeset to ’ automatically. Then run `npm run validate:messages`, which checks both languages line up.

## "How do you feel today?"

Home leads with six drawn faces (`components/mood/MoodFace.tsx`, defined in `data/moods.ts`) under today's message ("I need something else today" scrolls to them). Each face opens the collection that answers it, with a reply written for that feeling. The choice is remembered until local midnight; tap another face to change it.

Inside the collection, three chips narrow the next message by what would help (`data/needs.ts`, mapped to tones the library already has); tapping the active chip widens it again:

| Need | Tones |
| --- | --- |
| Comfort | reassuring |
| Another view | reflective, uplifting |
| A small step | grounding, gentle-challenge |

Below the faces, the same three needs are a shortcut for when naming a feeling isn't what someone wants: on their own they draw from the whole library, or from today's feeling's collection if one was picked.

| Face | Opens | Collection theme |
| --- | --- | --- |
| Good | Some Perspective | Happiness & Gratitude |
| A bit down | A Little Hope | Hope & Positivity |
| Overwhelmed | Some Comfort | Difficult Days & Comfort |
| Nervous | A Little Courage | Courage & Personal Growth |
| Unsure of me | Some Confidence | Self-worth & Confidence |
| Stuck | A Fresh Start | Letting Go & Moving Forward |

Explore still lists all six collections by name.

## Docs

- [docs/content-audit.md](docs/content-audit.md): the November 2026 review of all 624 messages in both languages, and what was changed.
- [docs/user-testing.md](docs/user-testing.md): a two-week test plan to learn who the app helps and when.

## Known Expo Go limitations

- On Android, Expo Go (SDK 58) rejects custom notification-channel creation with a native error. The app catches this and schedules on the default channel. In a development or store build, the `daily-reminder` channel from app.json is used.
- In Expo Go, the notification permission prompt names "Expo Go", and the splash-screen options are ignored.

## Future: accounts and sync

`services/sync.ts` lazily creates a Supabase client only when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set, and documents a suggested `favorites` table. To add sync, implement the repository interfaces against Supabase and pass them to the providers in `src/app/_layout.tsx`.
