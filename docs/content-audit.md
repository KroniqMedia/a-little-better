# Content audit (November 2026)

All 624 messages were read in English and Spanish, with an automated pass first: "should/must/have to", absolutes ("always", "never", "everything"), common toxic-positivity phrases, gendered Spanish adjectives aimed at the reader, and near-duplicates.

## Overall

The library is in good shape. The voice is consistent, warm and mostly permission-giving rather than prescriptive. Almost every "have to" is a "you **don't** have to". Spanish reads as natural Spanish rather than translation in nearly all cases, and gendered adjectives about the reader are already avoided.

The problems fall into four patterns, all fixed below:

1. **Promises the app can't keep** ("something good *is* on its way", "the beginning *will* be gentler"). Softened to possibility.
2. **Quiet blame** for a feeling or a situation ("it doesn't carry today's mood *unless you hand it over*", "perspective is a *choice*").
3. **Gratitude that assumes circumstances** ("someone wished for your life", "a full fridge"). These can land as guilt for someone struggling.
4. **Pressure where rest might be needed** ("Don't stop now", "Stretch further than yesterday").

## Changes made

IDs and order are unchanged, so saved favourites are unaffected.

| ID | Issue | Before → after (EN; ES changed to match where noted) |
| --- | --- | --- |
| conf-001 | Spelling (rest of the library uses UK spelling) | recognize → recognise |
| conf-003 | Scolding imperative | "Stop measuring…" → "Try not to measure…" (+ES) |
| conf-012 | Typesetting: opening quote rendered as ’ | 'just being yourself' → “just being yourself” |
| conf-062 | ES calque of "bad hair day" | "un mal día de pelo" → "un día de pelo rebelde" (ES only) |
| hope-002 | Promise | "Something good is still on its way" → "may still be on its way" (+ES) |
| hope-005 | Typesetting | 'never' → “never” |
| hope-022 | Absolute promise | "There's always one more door" → "There's often…" (+ES) |
| hope-045 | Over-optimistic | "it often goes somewhere better" → "sometimes…" (+ES) |
| hope-051 | Pressure on a tired reader | "Don't stop now." → "Rest if you need to, then keep going." (+ES) |
| hope-055 | Blame for carrying a mood | "…unless you hand it over" → "Today's mood doesn't have to come with it." (+ES) |
| comf-027 | Asserts safety the app can't know | "you are safe enough to rest" → "you can take it one breath at a time" (+ES) |
| fres-001 | Blames grief ("you can't… if you keep…") | → "It's hard to start the next chapter while you keep rereading the last one. Turn the page when you're ready." (+ES) |
| fres-072 | Asserts a counterfactual | "Staying would have been harder" → "might have been" (+ES) |
| fres-077 | Scolding imperative | "Stop rehearsing…" → "You can stop rehearsing…" (+ES) |
| fres-104 | Promise | "The beginning will be gentler" → "can be gentler" (+ES) |
| pers-004 | Gratitude-guilt by comparison | "Someone once wished for the life you are living" → "Some part of the life you're living now was once something you hoped for." (+ES) |
| pers-021 | Implies needing more is a failure to notice | → "Some of today's happiness may already be here, waiting to be noticed." (+ES) |
| pers-054 | Assumes means ("a full fridge") | → "Warm socks, a clean cup, a light that switches on…" (+ES) |
| pers-091 | Mood framed as a choice | "Perspective is a choice" → "something you can practise" (+ES) |
| cour-021 | ES "Defiéndete" reads as physical self-defence | → "Habla por ti hoy…" (ES only) |
| cour-079 | ES masculine "lo perfecto que tienes que ser" | → "la perfección que te exiges" (ES only) |
| cour-080 | Daily-improvement pressure | "Stretch a little further than yesterday" → "Stretch a little, if you can." (+ES) |
| cour-084 | ES masculine "aunque no sea perfecto" | → "aunque no salga perfecto" (ES only) |

## Reviewed and kept

- **hope-093** "a day you'll be very glad you stayed for": can be read as being about staying alive. It's gentle and in keeping with crisis-line language, so it stays, but it's worth a second opinion from someone with a mental-health background.
- **conf-055 / fres-003** (both "allowed to change your mind"): similar wording, different subject (yourself vs. plans). Kept.
- **cour-010** "Growth often feels uncomfortable… That's how you know it's real": borderline ("discomfort means it's working"), but it's in the courage collection, where that framing fits.
- Many "you don't have to…" lines: these grant permission rather than impose duties, so they're the voice working as intended.

## Not covered by this pass

- Whether the messages *help* real people. That needs the user test in [user-testing.md](user-testing.md).
- Review of the Spanish by a reader from Latin America. It's written in Spain's Spanish (for example "móvil", "vale la pena" as "merece la pena", "calcetines"), which reads fine but slightly foreign there.
