# A Little Better

*A little reminder. A little perspective. A little better.*

An everyday emotional companion: one thoughtful message a day, plus six small collections for the moments you need something specific. Built with Expo SDK 58, React Native 0.88, TypeScript and Expo Router.

No account is needed, and everything works offline.

## Run it

```bash
npm install
npx expo start          # then press i (iOS) / a (Android), or scan with Expo Go
```

Everything used here (notifications, sharing, view capture, haptics, Reanimated) is bundled in Expo Go, so you don't need a custom dev build for the MVP. Local notifications work in Expo Go. For store builds, use EAS: `npx eas-cli@latest build`.

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
    category/[id].tsx     A collection: one message at a time, never the full list
    share/[id].tsx        Share-card composer (modal)
    settings/             Settings · Privacy · About
  components/             ui/ (primitives), message/, category/, share/, settings/
  constants/theme.ts      Design tokens: palette, type scale, spacing, radii, shadows
  data/                   categories.ts + messages/ (624 original messages per language)
  hooks/                  useTheme, useDailyMessage, useMessageActions
  providers/              FavoritesProvider, PreferencesProvider (state + persistence)
  services/               storage, messageService, notifications, share, haptics, sync
  types/ utils/
scripts/validate-messages.ts
```

Business logic lives in `services/` and `providers/`. Screens only compose components.

## Key behaviours

- **Daily message.** All messages go into one fixed, seeded order, and the local calendar day picks the entry. Everyone sees the same message all day, it rolls over at local midnight, and nothing repeats for 624 days.
- **Another message.** Each category deals from a shuffled deck, so you won't see a repeat until you've seen the whole collection, and a new pass never starts with the message that ended the last one.
- **Favorites and preferences.** Stored in AsyncStorage behind the `FavoritesRepository` / `PreferencesRepository` interfaces in `services/storage.ts`.
- **Notifications.** Exactly one per day, and only after you opt in. The app schedules a rolling 30 days of local notifications, each carrying that day's message. About 1.5 s after launch it checks the window, and it rebuilds it only when fewer than 21 days are left or the reminder time changed. If you revoke permission in system settings, the toggle switches itself off.
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

Home asks how you feel with six drawn faces (`components/mood/MoodFace.tsx`, defined in `data/moods.ts`). Each face opens the collection that answers it, with a reply written for that feeling. The choice is remembered until local midnight.

| Face | Opens | Collection theme |
| --- | --- | --- |
| Good | Some Perspective | Happiness & Gratitude |
| A bit down | A Little Hope | Hope & Positivity |
| Overwhelmed | Some Comfort | Difficult Days & Comfort |
| Nervous | A Little Courage | Courage & Personal Growth |
| Unsure of me | Some Confidence | Self-worth & Confidence |
| Stuck | A Fresh Start | Letting Go & Moving Forward |

Explore still lists all six collections by name.

## Known Expo Go limitations

- On Android, Expo Go (SDK 58) rejects custom notification-channel creation with a native error. The app catches this and schedules on the default channel. In a development or store build, the `daily-reminder` channel from app.json is used.
- In Expo Go, the notification permission prompt names "Expo Go", and the splash-screen options are ignored.

## Future: accounts and sync

`services/sync.ts` lazily creates a Supabase client only when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set, and documents a suggested `favorites` table. To add sync, implement the repository interfaces against Supabase and pass them to the providers in `src/app/_layout.tsx`. Dark mode works the same way: add a second `ColorScheme` in `constants/theme.ts` and return it from `useTheme()`.
